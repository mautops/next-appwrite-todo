"use client";

import { FaGithub } from "react-icons/fa";
import { SiKeycloak } from "react-icons/si";
import { Button } from "../ui/button";
import { SocialLogin } from "@/app/auth/login/actions";
import { OAuthProvider } from "node-appwrite";

export default function Social() {
  return (
    <div className="flex w-full gap-x-2 items-center justify-center">
      <Button
        variant="outline"
        className="w-full"
        size="lg"
        onClick={() => {
          SocialLogin(OAuthProvider.Oidc);
        }}
      >
        <SiKeycloak className="w-5 h-5" />
      </Button>
      <Button
        variant="outline"
        className="w-full"
        size="lg"
        onClick={() => {
          console.log("github clicked");
          SocialLogin(OAuthProvider.Github).then((res) => {
            console.log(res);
          });
        }}
      >
        <FaGithub className="w-5 h-5" />
      </Button>
    </div>
  );
}
