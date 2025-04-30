"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function LoginForm() {
  const router = useRouter();

  const handleSuccess = () => {
    setTimeout(() => router.push("/"), 1500);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md animate-fade-in mt-20">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-4">
        ログイン
      </h1>
      <p className="text-center text-gray-500 mb-6">
        登録したメールアドレスとパスワードでログインしてください。
      </p>

      <AuthForm
        type="login"
        buttonText="ログインする"
        onSuccess={handleSuccess}
      />

      <div className="mt-6 text-center text-sm text-gray-500">
        アカウントがまだの方は
        <Link
          href="/signup"
          className="text-green-600 hover:underline font-medium"
        >
          新規登録はこちら
        </Link>
      </div>

      <div className="mt-4 text-center text-sm">
        <Link
          href="/"
          className="text-gray-500 hover:underline hover:text-gray-700 font-semibold"
        >
          トップページに戻る
        </Link>
      </div>
    </div>
  );
}
