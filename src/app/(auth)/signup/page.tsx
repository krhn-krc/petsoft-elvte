import AuthForm from "@/components/auth-form";
import H1 from "@/components/h1";
import Link from "next/link";

export default function Page() {
  return (
    <main className="max-w-64 w-full">
      <H1 className="text-center mb-6">Sign Up</H1>
      <AuthForm type="signUp" />

      <p className="mt-6 text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium">
          Log in.
        </Link>
      </p>
    </main>
  );
}
