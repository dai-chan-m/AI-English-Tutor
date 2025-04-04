"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/utils/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import ServiceLogo from "@/components/ServiceLogo";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    const { error } = await supabaseBrowser().auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage("❌ エラー: " + error.message);
    } else {
      setMessage("✅ 確認メールを送信しました。メールを確認してください。");
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white px-4 py-10">
      <ServiceLogo />
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-700">
          アカウント作成
        </h2>
        <p className="text-center text-sm text-gray-600">
          無料で始めて、英語学習を加速させよう！
        </p>

        {!success && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              placeholder="パスワード（6文字以上）"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold shadow-md transition"
            >
              登録する
            </button>
          </form>
        )}

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`text-center text-sm font-medium ${
                success ? "text-green-600" : "text-red-500"
              } whitespace-pre-wrap`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {success && (
          <div className="text-center pt-2">
            <button
              onClick={() => router.push("/")}
              className="text-blue-600 hover:underline text-sm"
            >
              ホームに戻る
            </button>
          </div>
        )}

        {!success && (
          <div className="text-center pt-2 text-sm text-gray-600">
            すでにアカウントをお持ちの方は{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              ログイン
            </a>
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
}
