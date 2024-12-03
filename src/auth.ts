import { cookies } from "next/headers";
import { createAdminClient, createSessionClient } from "./appwrite/config";
import { Models } from "node-appwrite";

interface Auth {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  getCookieSession: (key: string) => Promise<string>;
  setCookieSession: (key: string, value: string, expire: Date) => Promise<void>;
  deleteCookieSession: (key: string) => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getUser: () => Promise<any>;
  createEmailPasswordSession: (
    email: string,
    password: string
  ) => Promise<Models.Session>;
}

/**
 * The following code fixes the type error by ensuring that the getCookieSession method
 * returns a string instead of a string | undefined.
 */

// Start of Selection
const auth: Auth = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: null,
  getCookieSession: async (key: string) => {
    const c = await cookies();
    const sessionValue = c.get(key)?.value;
    if (!sessionValue) {
      throw new Error(`${key} cookie not found`);
    }
    return sessionValue;
  },
  setCookieSession: async (key: string, value: string, expire: Date) => {
    const c = await cookies();
    c.set(key, value, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(expire),
      path: "/",
    });
  },
  deleteCookieSession: async (key: string) => {
    const c = await cookies();
    c.delete(key);
    auth.user = null;
  },
  getUser: async () => {
    try {
      const sessionCookie = await auth.getCookieSession("session");
      const { account } = await createSessionClient(sessionCookie);
      auth.user = await account.get();
    } catch {
      auth.user = null;
    }

    // Return the user
    return auth.user;
  },
  createEmailPasswordSession: async (email: string, password: string) => {
    "use server";

    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

    // Set the session cookie
    auth.setCookieSession("session", session.secret, new Date(session.expire));

    return session;
  },
};

export default auth;
