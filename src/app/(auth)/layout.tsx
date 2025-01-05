import Logo from "@/components/logo";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-y-4 mx-auto justify-center items-center min-h-screen">
      <Logo />
      {children}
    </div>
  );
}
