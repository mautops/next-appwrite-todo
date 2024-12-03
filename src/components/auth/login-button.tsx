"use client";

import { useRouter } from "next/navigation";

interface LoginButtonProps {
  children: React.ReactNode;
}

export const LoginButton = ({ children }: LoginButtonProps) => {
  const router = useRouter();
  const onClick = () => {
    console.log("LOGIN BUTTON CLICKED");
    router.push("/auth/login");
  };

  return (
    <span className="cursor-pointer" onClick={onClick}>
      {children}
    </span>
  );
};
