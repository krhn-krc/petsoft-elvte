import AuthForm from "@/components/auth-form";
import H1 from "@/components/h1";
import Link from "next/link";

export default function Page() {
  return (
    <main className="max-w-64 w-full">
      <H1 className="text-center mb-6">Log In</H1>
      <AuthForm type="logIn" />

      <p className="mt-6 text-sm text-zinc-500">
        No account yet?{" "}
        <Link href="/signup" className="font-medium">
          Sign up.
        </Link>
      </p>
    </main>
  );
}
