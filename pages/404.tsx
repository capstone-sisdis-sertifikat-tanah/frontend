import Image from "next/image";
import Link from "next/link";

export default function ErrorNotFoundPage() {
  return (
    <main className="fixed inset-0 w-screen h-dvh isolate min-h-full">
      <Image
        src="https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75"
        alt=""
        className="object-cover"
        fill
      />
      <div className="relative mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
        <p className="text-base font-semibold leading-8 text-white">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">Halaman tidak ditemukan</h1>
        <p className="mt-4 text-base text-white/70 sm:mt-6">
          Maaf, kami tidak dapat menemukan halaman yang Anda cari. Silakan periksa kembali URL atau kembali ke halaman
          utama.
        </p>
        <div className="mt-10 flex justify-center">
          <Link href="/" className="text-sm font-semibold leading-7 text-white">
            <span aria-hidden="true">&larr;</span> Kembali ke halaman utama
          </Link>
        </div>
      </div>
    </main>
  );
}
