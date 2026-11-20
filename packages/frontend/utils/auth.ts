import type { SupabaseClient } from "@supabase/supabase-js";

export async function signOutUser(client: SupabaseClient) {
    const { error } = await client.auth.signOut();
    return error ? {ok: false as const, message: error.message } : { ok: true as const };
}