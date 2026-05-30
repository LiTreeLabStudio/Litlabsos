"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyPassword } from "@/lib/db";
import { signToken } from "@/lib/jwt";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect("/login?error=Email+and+password+required");
  }

  const user = await verifyPassword(email, password);
  if (!user) {
    redirect("/login?error=Invalid+credentials");
  }

  const token = await signToken({
    id: user.id,
    email: user.email,
    name: user.name,
  });

  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/dashboard");
}
