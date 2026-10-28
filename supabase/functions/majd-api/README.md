# Local `majd-api` Edge Function source

This local source is based on the previously deployed `majd-api` version 11 for project `ixjfhkoozjuoswohqqcr` (source hash `ba5362b5743edc7c611564f4f2e684dc9e52344e7dcfec5b01cbab5473aa90cf`). The updated function is now deployed as version 12. The existing `verify_jwt = false` setting is preserved because the function validates its existing HMAC session token itself. Token validation selects only `id`, username, account type, profile, and active status; it does not fetch password hashes or salts.

## Wafdeen data boundary

The authenticated `listWafdeenStudentNames` operation projects only the student-name JSON text path from `wafdeenDailyRecords`.

`listWafdeenSessionData` has two authenticated purposes:

- `daily` returns student identity and Quran session timing fields from daily records only. It does not read the usage collection or return grades, record IDs, or unrelated fields. The server also allowlists each field and the three supported keys in the per-type time map.
- `report` is administrator-only, requires a valid `YYYY-MM` value, and reads daily timing and usage-session fields only for that report's 15th-through-14th period. It does not select or return student names, grades, record IDs, or unrelated fields.

`createWafdeenSession` validates an authorized existing student and the session fields, checks for an existing type, and inserts new daily and usage rows with one database `insert`. It does not call `upsert`, `update`, or `delete`; existing records remain unchanged. Teacher identity is taken from the authenticated account, not from frontend input.

The main app entrypoint explicitly enables `window.__MAJD_WAFDEEN_SESSIONS_ENABLED__` for this approved release. If that flag is absent, the feature retains its fictional in-memory mock fallback. The live function and site use the existing main-site authentication; the service-role key remains only in Edge Function environment variables and is never placed in frontend code.

All automated tests use fictional rows and a fake database query builder; no new session operation was executed against live records. The function deployment replaced only the Edge Function code/configuration; it did not modify database records. The website deployment is being verified separately.

## Query syntax references

- Supabase JavaScript `select()` documentation: https://supabase.com/docs/reference/javascript/select — specific-column selection and `range()` pagination; the default response cap is 1,000 rows.
- PostgREST tables/views documentation: https://docs.postgrest.org/en/v12/references/api/tables_views.html — JSON/JSONB path projection, filtering, and ordering.
