import { createClient } from "npm:@supabase/supabase-js@2";
import { listWafdeenStudentNames } from "./wafdeen_names.js";
import { createWafdeenSession, listWafdeenSessionData } from "./wafdeen_sessions.js";
import { createWafdeenStudent, createWafdeenTeacher, listWafdeenTeachers } from "./wafdeen_admin.js";
import { listWafdeenAccounts, listWafdeenGrades } from "./wafdeen_access.js";
import { authorizeApiOperation, selectAccountForLogin, sessionScopeForLoginMode, signSessionToken, verifySessionToken } from "./session_scope.js";

const URL = Deno.env.get("SUPABASE_URL") ?? "";
const KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const db = URL && KEY
  ? createClient(URL, KEY, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;
const enc = new TextEncoder();
const ITERATIONS = 310000;
const TTL = 8 * 60 * 60;
const accountTypes: Record<string, string> = {
  teachers: "staff",
  wafdeenTeachers: "wafdeen_teacher",
  wafdeenStudents: "wafdeen_student"
};
const collections = new Set([
  "teachers", "students", "dailyRecords", "dailyRecordsArchive", "shariaGrades", "notes", "results", "payments",
  "wafdeenTeachers", "wafdeenStudents", "wafdeenDailyRecords", "wafdeenExams", "wafdeenSettings", "wafdeenUsage",
  "wafdeenMonthlyReports", "books"
]);
const adminOnly = new Set(["teachers", "dailyRecordsArchive", "wafdeenTeachers", "wafdeenStudents", "wafdeenSettings", "wafdeenMonthlyReports", "books"]);
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store"
};
const respond = (x: unknown, status = 200) => new Response(JSON.stringify(x), {
  status,
  headers: { ...cors, "Content-Type": "application/json" }
});

function b64(a: Uint8Array) {
  let s = "";
  for (let i = 0; i < a.length; i += 0x8000) s += String.fromCharCode(...a.subarray(i, i + 0x8000));
  return btoa(s);
}
function un64(s: string) {
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}
function norm(s: unknown) {
  return String(s ?? "").trim().toLocaleLowerCase();
}
function clean(x: any) {
  const y = { ...(x || {}) };
  delete y.password;
  delete y.password_hash;
  delete y.password_salt;
  return y;
}
function isDeleted(r: any) {
  const v = (r?.data ?? r ?? {})._deleted;
  return v === true || v === 1 || ["true", "1", "yes"].includes(String(v ?? "").trim().toLowerCase());
}
function admin(a: any) {
  return a?.account_type === "staff" && (a?.username_norm === "admin" || a?.profile?.role === "admin");
}
function accountView(a: any) {
  const p = clean(a.profile);
  return {
    ...p,
    id: a.id,
    username: a.username,
    accountType: a.account_type,
    role: admin(a) ? "admin" : (p.role || a.account_type),
    isAdmin: admin(a),
    isActive: a.is_active,
    password: "••••••••"
  };
}
async function passHash(password: string, salt = crypto.getRandomValues(new Uint8Array(16))) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const h = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" }, key, 256));
  return { salt: b64(salt), hash: b64(h) };
}
async function passOK(password: string, salt: string, expected: string) {
  const h = await passHash(password, un64(salt));
  const a = un64(h.hash);
  const b = un64(expected);
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i];
  return d === 0;
}
async function sign(id: string, scope: string) {
  return await signSessionToken(id, scope, KEY, TTL);
}
async function authenticate(token: string) {
  try {
    const claims = await verifySessionToken(token, KEY);
    if (!claims) return null;
    const { data, error } = await db!.from("majd_accounts").select("id,username,username_norm,account_type,profile,is_active").eq("id", String(claims.sub)).maybeSingle();
    return error || !data?.is_active ? null : { ...data, sessionScope: claims.scope };
  } catch {
    return null;
  }
}
function ownerScope(user: any, row: any) {
  const d = row?.data ?? row ?? {};
  const username = String(user.username || "").trim();
  const uid = String(user.id || "").trim();
  const cls = String(user.profile?.assignedClass || "").trim();
  const rowClass = String(d.className ?? d.assignedClass ?? d.class ?? d.class_name ?? "").trim();
  const owner = String(d.teacherName ?? d.teacherUsername ?? d.teacherId ?? d.teacher ?? d.studentName ?? d.studentId ?? d.username ?? "").trim();
  return (!!cls && rowClass === cls) || owner === username || owner === uid;
}
function canRead(u: any, c: string, r: any) {
  if (admin(u)) return true;
  if (u.account_type === "wafdeen_student") return c === "wafdeenDailyRecords" && ownerScope(u, r);
  if (u.account_type === "wafdeen_teacher" || u.profile?.canWafdeen) {
    if (c === "wafdeenStudents") return true;
    if (c === "wafdeenTeachers") return ownerScope(u, r);
    return c.startsWith("wafdeen") && (ownerScope(u, r) || String((r?.data ?? r)?.className || "") === "الوافدين");
  }
  if (adminOnly.has(c)) return false;
  return u.account_type === "staff" && ownerScope(u, r);
}
function canWrite(u: any, c: string, r: any) {
  if (admin(u)) return true;
  if (u.account_type === "wafdeen_teacher" || u.profile?.canWafdeen) return ["wafdeenDailyRecords", "wafdeenUsage", "wafdeenExams"].includes(c) && ownerScope(u, r);
  if (u.account_type === "staff") return ["students", "dailyRecords", "shariaGrades", "notes", "payments"].includes(c) && ownerScope(u, r);
  return false;
}
async function readRows(c: string, maxRows = 10000) {
  const out: any[] = [];
  const pageSize = 1000;
  for (let from = 0; from < maxRows; from += pageSize) {
    const { data, error } = await db!.from("majd_records").select("record_id,data").eq("collection", c).order("record_id").range(from, Math.min(from + pageSize - 1, maxRows - 1));
    if (error) throw error;
    const page = data || [];
    out.push(...page);
    if (page.length < pageSize) break;
  }
  return out;
}
async function login(body: any) {
  const username = String(body.username ?? "").trim();
  const password = String(body.password ?? "");
  const key = norm(username);
  if (!key || !password || password.length > 256) return respond({ error: "INVALID_CREDENTIALS" }, 401);
  const mode = String(body.mode || "staff");
  const scope = sessionScopeForLoginMode(mode);
  if (!scope) return respond({ error: "INVALID_LOGIN_MODE" }, 400);
  const { data: matches, error } = await db!.from("majd_accounts").select("*").eq("username_norm", key).order("account_type").limit(10);
  if (error || !matches?.length) return respond({ error: "INVALID_CREDENTIALS" }, 401);
  const active = (matches || []).filter((x: any) => x.is_active);
  const a = selectAccountForLogin(mode, active, admin);
  if (!a) return respond({ error: "INVALID_CREDENTIALS" }, 401);
  if (a.locked_until && Date.parse(a.locked_until) > Date.now()) return respond({ error: "ACCOUNT_TEMPORARILY_LOCKED" }, 429);
  if (!await passOK(password, a.password_salt, a.password_hash)) {
    const n = Number(a.failed_attempts || 0) + 1;
    await db!.from("majd_accounts").update({ failed_attempts: n, locked_until: n >= 8 ? new Date(Date.now() + 900000).toISOString() : null }).eq("id", a.id);
    return respond({ error: "INVALID_CREDENTIALS" }, 401);
  }
  await db!.from("majd_accounts").update({ failed_attempts: 0, locked_until: null, updated_at: new Date().toISOString() }).eq("id", a.id);
  return respond({ token: await sign(a.id, scope), user: accountView(a), mustChangePassword: !!a.password_change_required });
}
async function records(u: any, c: string) {
  if (accountTypes[c]) {
    const type = accountTypes[c];
    if (!admin(u) && !(c === "wafdeenStudents" && (u.account_type === "wafdeen_teacher" || u.profile?.canWafdeen))) return [];
    const { data, error } = await db!.from("majd_accounts").select("*").eq("account_type", type).order("username_norm").limit(1500);
    if (error) throw error;
    return (data || []).filter((a: any) => a.is_active).map(accountView);
  }
  const data = await readRows(c);
  return data.filter((r: any) => !isDeleted(r) && canRead(u, c, r)).map((r: any) => ({ ...clean(r.data), id: r.record_id }));
}
async function one(u: any, c: string, id: string) {
  if (accountTypes[c]) {
    if (!admin(u)) return null;
    const { data, error } = await db!.from("majd_accounts").select("*").eq("id", id).eq("account_type", accountTypes[c]).maybeSingle();
    if (error) throw error;
    return data ? accountView(data) : null;
  }
  const { data, error } = await db!.from("majd_records").select("record_id,data").eq("collection", c).eq("record_id", id).maybeSingle();
  if (error) throw error;
  return data && !isDeleted(data) && canRead(u, c, data) ? { ...clean(data.data), id: data.record_id } : null;
}
async function saveAccount(u: any, c: string, id: string, x: any, forcePasswordChange = false) {
  if (!admin(u)) return respond({ error: "FORBIDDEN" }, 403);
  const { data: old } = await db!.from("majd_accounts").select("*").eq("id", id).maybeSingle();
  const username = String(x.username ?? x.name ?? old?.username ?? old?.profile?.username ?? "").trim();
  const username_norm = norm(username);
  if (!id || !username_norm) return respond({ error: "USERNAME_REQUIRED" }, 400);
  const profile = clean({ ...((old?.profile || {}) as any), ...x, id, username });
  const pw = String(x.password ?? "");
  const masked = !pw || ["••••••••", "********", "••••••"].includes(pw);
  let creds: any = null;
  if (!masked) {
    if (pw.length < 1 || pw.length > 256) return respond({ error: "PASSWORD_TOO_SHORT" }, 400);
    creds = await passHash(pw);
  } else if (!old) return respond({ error: "PASSWORD_REQUIRED" }, 400);
  const row: any = { id, username, username_norm, account_type: accountTypes[c], profile, is_active: x._deleted !== true, updated_at: new Date().toISOString() };
  if (creds) {
    row.password_salt = creds.salt;
    row.password_hash = creds.hash;
    row.password_change_required = forcePasswordChange;
  } else {
    row.password_salt = old.password_salt;
    row.password_hash = old.password_hash;
    row.password_change_required = !!old.password_change_required;
  }
  const { data, error } = await db!.from("majd_accounts").upsert(row, { onConflict: "id" }).select("*").single();
  if (error) return respond({ error: "ACCOUNT_SAVE_FAILED", detail: error.message }, 400);
  return respond({ ...accountView(data), saveAction: old ? "updated" : "created" });
}

async function handle(req: Request) {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return respond({ error: "METHOD_NOT_ALLOWED" }, 405);
  if (!db || !KEY) return respond({ error: "SERVER_CONFIGURATION_MISSING" }, 500);
  let b: any;
  try {
    const text = await req.text();
    if (text.length > 2500000) return respond({ error: "REQUEST_TOO_LARGE" }, 413);
    b = JSON.parse(text);
  } catch {
    return respond({ error: "INVALID_JSON" }, 400);
  }
  if (b.op === "login") return await login(b);
  const auth = req.headers.get("authorization") || "";
  const u = await authenticate(auth.startsWith("Bearer ") ? auth.slice(7) : "");
  if (!u) return respond({ error: "UNAUTHORIZED" }, 401);
  if (!authorizeApiOperation(u.sessionScope, b.op, b)) return respond({ error: "SESSION_SCOPE_FORBIDDEN" }, 403);

  if (b.op === "addWafdeenStudent") {
    const result = await createWafdeenStudent(db!, u, admin, { studentName: b.studentName });
    if (result.status !== 201) return respond({ error: result.error }, result.status);
    return respond({ student: result.student }, 201);
  }

  if (b.op === "listWafdeenTeachers") {
    const result = await listWafdeenTeachers(db!, u, admin);
    if (result.status !== 200) return respond({ error: result.error }, result.status);
    return respond({ teachers: result.teachers });
  }

  if (b.op === "createWafdeenTeacher") {
    const result = await createWafdeenTeacher(db!, u, admin, b.teacher, passHash);
    if (result.status !== 201) return respond({ error: result.error }, result.status);
    return respond({ teacher: result.teacher }, 201);
  }

  if (b.op === "listWafdeenStudentNames") {
    const result = await listWafdeenStudentNames(db!, u, admin);
    if (result.status !== 200) return respond({ error: result.error }, result.status);
    return respond({ names: result.names });
  }

  if (b.op === "listWafdeenSessionData") {
    const result = await listWafdeenSessionData(db!, u, admin, { purpose: String(b.purpose || "daily"), month: String(b.month || "") });
    if (result.status !== 200) return respond({ error: result.error }, result.status);
    return respond({ students: result.students, dailySessions: result.dailySessions, usage: result.usage });
  }

  if (b.op === "listWafdeenAccounts") {
    const result = await listWafdeenAccounts(db!, u, admin);
    if (result.status !== 200) return respond({ error: result.error }, result.status);
    return respond({ accounts: result.accounts });
  }

  if (b.op === "listWafdeenGrades") {
    const result = await listWafdeenGrades(db!, u, admin);
    if (result.status !== 200) return respond({ error: result.error }, result.status);
    return respond({ grades: result.grades });
  }

  if (b.op === "createWafdeenSession") {
    const result = await createWafdeenSession(db!, u, admin, b.session);
    if (result.status !== 201) return respond({ error: result.error }, result.status);
    return respond({ ok: true }, 201);
  }

  if (b.op === "bulkUpsert") {
    if (!admin(u)) return respond({ error: "FORBIDDEN" }, 403);
    const items = Array.isArray(b.records) ? b.records : [];
    if (!items.length || items.length > 150) return respond({ error: "INVALID_BATCH_SIZE" }, 400);
    const now = new Date().toISOString();
    const rows: any[] = [];
    for (const item of items) {
      const c = String(item?.collection || "");
      if (!collections.has(c) || accountTypes[c]) return respond({ error: "INVALID_IMPORT_COLLECTION" }, 400);
      const id = String(item?.id ?? item?.data?.id ?? item?.data?.recordId ?? "").trim();
      if (!id) return respond({ error: "RECORD_ID_REQUIRED" }, 400);
      const data = clean({ ...((item?.data || {}) as any), id });
      rows.push({ collection: c, record_id: id, data, updated_by: u.username, updated_at: now });
    }
    const { error } = await db!.from("majd_records").upsert(rows, { onConflict: "collection,record_id" });
    if (error) throw error;
    return respond({ upserted: rows.length });
  }

  if (b.op === "changePassword") {
    const next = String(b.newPassword ?? "");
    const oldpass = String(b.currentPassword ?? "");
    if (next.length < 12 || next.length > 256) return respond({ error: "PASSWORD_MIN_12" }, 400);
    const { data: a, error } = await db.from("majd_accounts").select("*").eq("id", u.id).single();
    if (error || !await passOK(oldpass, a.password_salt, a.password_hash)) return respond({ error: "CURRENT_PASSWORD_INVALID" }, 401);
    const h = await passHash(next);
    const { error: e } = await db.from("majd_accounts").update({ password_salt: h.salt, password_hash: h.hash, password_change_required: false, failed_attempts: 0, locked_until: null, updated_at: new Date().toISOString() }).eq("id", u.id);
    if (e) throw e;
    return respond({ ok: true });
  }

  const c = String(b.collection || "");
  if (!collections.has(c)) return respond({ error: "UNKNOWN_COLLECTION" }, 400);
  if (b.op === "list") {
    let a = await records(u, c);
    const filters = Array.isArray(b.filters) ? b.filters : [];
    a = a.filter((r: any) => filters.every((f: any) => {
      const v = String(f.field || "").split(".").reduce((x: any, k: string) => x == null ? undefined : x[k], r);
      if (f.op === "==") return String(v ?? "") === String(f.value ?? "");
      if (f.op === "!=") return String(v ?? "") !== String(f.value ?? "");
      if (f.op === "in") return Array.isArray(f.value) && f.value.map(String).includes(String(v));
      if (f.op === "array-contains") return Array.isArray(v) && v.map(String).includes(String(f.value));
      return true;
    }));
    return respond({ records: a.slice(0, Math.max(1, Math.min(Number(b.limit) || 2000, 10000))) });
  }
  if (b.op === "get") return respond({ record: await one(u, c, String(b.id ?? "")) });
  if (b.op === "upsert") {
    const id = String(b.id ?? b.data?.id ?? b.data?.recordId ?? "").trim();
    if (!id) return respond({ error: "RECORD_ID_REQUIRED" }, 400);
    const x = { ...(b.data || {}), id };
    if (accountTypes[c]) return await saveAccount(u, c, id, x, b.forcePasswordChange === true);
    const { data: old, error } = await db.from("majd_records").select("record_id,data").eq("collection", c).eq("record_id", id).maybeSingle();
    if (error) throw error;
    const merged = b.merge && old ? { ...old.data, ...x, id } : x;
    const safe = clean(merged);
    if (!canWrite(u, c, { data: safe })) return respond({ error: "FORBIDDEN" }, 403);
    const { error: e } = await db.from("majd_records").upsert({ collection: c, record_id: id, data: safe, updated_by: u.username, updated_at: new Date().toISOString() }, { onConflict: "collection,record_id" });
    if (e) throw e;
    return respond({ record: safe, saveAction: old ? "updated" : "created" });
  }
  if (b.op === "delete") {
    const id = String(b.id ?? "");
    if (!id) return respond({ error: "RECORD_ID_REQUIRED" }, 400);
    if (accountTypes[c]) {
      if (!admin(u)) return respond({ error: "FORBIDDEN" }, 403);
      const { error } = await db.from("majd_accounts").delete().eq("id", id).eq("account_type", accountTypes[c]);
      if (error) throw error;
    } else {
      const { data: r, error } = await db.from("majd_records").select("record_id,data").eq("collection", c).eq("record_id", id).maybeSingle();
      if (error) throw error;
      if (!r || !canWrite(u, c, r)) return respond({ error: "FORBIDDEN" }, 403);
      const { error: e } = await db.from("majd_records").delete().eq("collection", c).eq("record_id", id);
      if (e) throw e;
    }
    return respond({ ok: true });
  }
  return respond({ error: "UNKNOWN_OPERATION" }, 400);
}

Deno.serve(async (req) => {
  try {
    return await handle(req);
  } catch (e) {
    console.error("majd-api", e);
    return respond({ error: "INTERNAL_ERROR" }, 500);
  }
});
