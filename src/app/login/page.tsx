import type { Metadata } from "next";
import { LoginShowcase } from "@/components/auth/LoginShowcase";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login | RouteManager",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden w-1/2 lg:block">
        <LoginShowcase />
      </div>
      <div className="flex w-full items-center lg:w-1/2">
        <LoginForm />
      </div>
    </div>
  );
}
