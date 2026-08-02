import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
export async function GET(request:Request){const db=await createClient();await db.auth.signOut();return NextResponse.redirect(new URL("/auth",request.url))}
