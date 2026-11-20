/**
 * @jest-environment node
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { signOutUser } from "../../../utils/auth";

dotenv.config({ path: path.resolve(__dirname, "../../../.env.test"), quiet: true });
const URL = process.env.SUPABASE_URL!;
const ANON = process.env.SUPABASE_ANON_KEY!;
const admin = createClient(URL, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

let client: SupabaseClient;
let userId: string | undefined;

beforeEach(async () => {
    const email = `signout${Date.now()}@test.com`;
    const password = "TestPass123!";
    try {const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) throw error;
    userId = data.user.id;} 
    catch (err: any) {console.log("cause:", err?.cause ?? err);
        throw err;
    }
  
    client = createClient(URL, ANON, { auth: { persistSession: false } });
    const signIn = await client.auth.signInWithPassword({ email, password });
    if (signIn.error) throw signIn.error;
  });
  
  afterEach(async () => {
    if (userId) {
    await admin.auth.admin.deleteUser(userId);
    }
    userId = undefined;
  });

  test("signing out succeeds and ends the session", async () => {
    const before = await client.auth.getSession();
    expect(before.data.session).not.toBeNull();
  
    const result = await signOutUser(client);
  
    expect(result).toEqual({ ok: true });
    const after = await client.auth.getSession();
    expect(after.data.session).toBeNull();
  });
  