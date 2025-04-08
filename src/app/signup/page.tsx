"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import ServiceLogo from "@/components/ServiceLogo";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function SignUpPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // 成功時のホームへの遷移処理
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white px-4 py-10">
      <ServiceLogo />
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md space-y-6 mt-8">
        <h2 className="text-3xl font-bold text-center text-blue-700">
          アカウント作成
        </h2>
        <p className="text-center text-sm text-gray-600">
          無料で始めて、英語学習を加速させよう！
        </p>

        <AuthForm 
          type="signup"
          title="新規登録"
          buttonText="登録する"
          onSuccess={handleSuccess}
        />

        <div className="text-center pt-2 text-sm text-gray-600">
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            ログイン
          </Link>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}
