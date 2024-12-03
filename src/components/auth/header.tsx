"use client";

interface HeaderProps {
  label: string;
}

export default function Header({ label }: HeaderProps) {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className="text-2xl font-bold">🔐 Auth</h1>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
