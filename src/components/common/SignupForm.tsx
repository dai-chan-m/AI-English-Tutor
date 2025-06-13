"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthForm from "@/components/common/AuthForm";

export default function Form() {
  const router = useRouter();

  const handleSuccess = () => {
    // 成功時のホームへの遷移処理
    router.push("/");
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md space-y-6 mt-8">
      <h2 className="text-3xl font-bold text-center text-blue-700">
        アカウント作成
      </h2>
      <p className="text-center text-sm text-gray-600">
        無料で始めて、英語学習を加速させよう！
      </p>

      <AuthForm type="signup" buttonText="登録する" onSuccess={handleSuccess} />

      <div className="text-center pt-2 text-sm text-gray-600">
        すでにアカウントをお持ちの方は{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          ログイン
        </Link>
      </div>
    </div>
  );
}
