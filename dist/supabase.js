"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseAdmin = exports.supabase = void 0;
exports.getSupabase = getSupabase;
exports.getSupabaseAdmin = getSupabaseAdmin;
// Supabase client setup
var supabase_js_1 = require("@supabase/supabase-js");
var supabaseUrl = (_a = process.env.NEXT_PUBLIC_SUPABASE_URL) !== null && _a !== void 0 ? _a : "";
var supabaseKey = (_b = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) !== null && _b !== void 0 ? _b : "";
var _supabase = null;
function getSupabase() {
    if (!supabaseUrl || supabaseUrl.includes("your-project") || !supabaseKey || supabaseKey.includes("your-anon")) {
        throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    }
    if (!_supabase) {
        _supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    }
    return _supabase;
}
exports.supabase = new Proxy({}, {
    get: function (_target, prop) {
        return getSupabase()[prop];
    },
});
// Server-only admin client using service role key (bypasses RLS — server routes only)
var _supabaseAdmin = null;
function getSupabaseAdmin() {
    var _a;
    var serviceKey = (_a = process.env.SUPABASE_SERVICE_ROLE_KEY) !== null && _a !== void 0 ? _a : "";
    if (!supabaseUrl || !serviceKey) {
        throw new Error("Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    }
    if (!_supabaseAdmin) {
        _supabaseAdmin = (0, supabase_js_1.createClient)(supabaseUrl, serviceKey, {
            auth: { autoRefreshToken: false, persistSession: false },
        });
    }
    return _supabaseAdmin;
}
exports.supabaseAdmin = new Proxy({}, {
    get: function (_target, prop) {
        return getSupabaseAdmin()[prop];
    },
});
