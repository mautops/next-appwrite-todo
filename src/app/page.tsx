import auth from "@/auth";
import { Button } from "@/components/ui/button";
import { SignOut } from "./auth/login/actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await auth.getUser();
  return (
    <>
      <p>用户名: {user?.name}</p>
      <p>邮箱: {user?.email}</p>
      <p>手机: {user?.phone}</p>
      {user && (
        <Button
          onClick={async () => {
            "use server";
            await SignOut();
            redirect("/");
          }}
        >
          登出
        </Button>
      )}
    </>
  );
}
