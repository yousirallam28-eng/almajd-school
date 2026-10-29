// Supabase connection settings preserved verbatim from the current main page.
var SUPABASE_URL = window.SUPABASE_URL || 'https://ixjfhkoozjuoswohqqcr.supabase.co';
var SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'sb_publishable_W5nl_C3m-kNip4eDNBpUKw_aGFuNPke';
var SUPABASE_RECORDS_TABLE = 'cloud_records';
var supabaseClient = null;
var wafdeenStorage = null;
if (window.supabase && SUPABASE_URL.indexOf('YOUR-') < 0 && SUPABASE_ANON_KEY.indexOf('YOUR_') < 0) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  wafdeenStorage = supabaseClient.storage;
}
