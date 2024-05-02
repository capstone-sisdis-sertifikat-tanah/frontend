import Image from "next/image";
import { Grid } from "@/components/grid";
import { LoginForm } from "@/modules/auth/login-form";

export default function LoginPage() {
  return (
    <main className="relative flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 h-dvh">
      <Image src="/images/cover.jpg" alt="" className="object-cover" fill />
      <Grid />
      <LoginForm />
    </main>
  );
}

LoginPage.title = "Login | Sistem Penerbitan Sertifikat Tanah";
