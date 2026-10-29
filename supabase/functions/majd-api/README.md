# `majd-api` Edge Function

The function preserves the existing HMAC-authenticated session flow and `verify_jwt = false` configuration. It does not expose the service-role key to the website, and this change does not alter database policies or the generic site API.

## Wafdeen data boundary

`listWafdeenAccounts` is limited to administrators and staff explicitly authorized for Wafdeen. It returns active Wafdeen student/teacher accounts and authorized Wafdeen staff using an explicit profile-field projection. It never selects or returns account IDs, passwords, password hashes, password salts, lockout state, or other credential fields.

`listWafdeenGrades` is limited to the same administrator/staff authorization. It reads only `wafdeenDailyRecords`, applies the existing administrator or authorized-staff Wafdeen scope, and returns only student display name, date, session type, and the supported grade fields (`newLesson`, `oldRevision`, `recitation`, `total`). Record IDs and deletion markers are used only internally and are not returned.

Wafdeen student accounts cannot call either operation. The source does not establish a stable relation between `majd_accounts` student accounts and `wafdeenDailyRecords.studentId`; therefore the implementation does not infer a link from username or account ID, does not add a student-grade UI, and does not change the database schema or existing account/grade records. Student-only grade access requires a separately approved, explicit account-to-roster relation.

The existing `listWafdeenSessionData` behavior remains unchanged: `daily` returns only session identity/timing fields through the Wafdeen scope, and `report` remains an administrator-only main-site operation. Generic Wafdeen collection routes remain blocked in the standalone session.

All new automated tests use fictional rows and an in-memory fake query builder. They do not call the connected Supabase project or read live account or grade values. The deployment operation publishes Edge Function code/configuration only and does not modify database rows.

## Query references

- Supabase JavaScript `select()` documentation: https://supabase.com/docs/reference/javascript/select — specific-column selection and `range()` pagination.
- PostgREST tables/views documentation: https://docs.postgrest.org/en/v12/references/api/tables_views.html — JSON/JSONB path projection, filtering, and ordering.
