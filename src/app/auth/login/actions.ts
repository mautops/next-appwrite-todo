"use server";

import { createAdminClient, getSessionClient } from "@/appwrite/config";
import { LoginSchema } from "@/schemas/auth";
import { OAuthProvider } from "node-appwrite";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export const EmailLogin = async (data: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(data);

  if (!validatedFields.success) {
    return { message: "Login failed" };
  }

  const { email, password } = validatedFields.data;

  // Create admin client
  const { account } = await createAdminClient();

  // Login user
  let session;
  try {
    session = await account.createEmailPasswordSession(email, password);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.type === "user_invalid_credentials") {
      return { message: "Invalid email or password" };
    }
    throw error;
  }

  // Set session cookie
  if (session) {
    const c = await cookies();
    c.set("session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(session.expire),
      path: "/",
    });
  }
  return { message: "Login successful", redirect: "/" };
};

export const SocialLogin = async (provider: OAuthProvider) => {
  const account = (await createAdminClient()).account;
  const origin = (await headers()).get("origin");
  const redirectUrl = await account.createOAuth2Token(
    provider,
    `${origin}/auth/oauth/callback`,
    `${origin}/auth/login`
  );

  if (redirectUrl) {
    return redirect(redirectUrl);
  }
  return { message: "Login failed" };
};

export const SignOut = async () => {
  // Create admin client
  const { account } = await getSessionClient();
  // Sign out user
  await account.deleteSession("current");

  // Delete session cookie
  const c = await cookies();
  c.delete("session");

  return { message: "Sign out successful" };
};
