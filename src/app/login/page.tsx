"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabaseClient";
import Link from "next/link";
import Footer from "@/components/Footer";
import ServiceLogo from "@/components/ServiceLogo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    const { error } = await supabaseBrowser().auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("ログインに失敗しました：" + error.message);
    } else {
      setMessage("✅ ログイン成功！ホームへリダイレクトします…");
      setSuccess(true);
      setTimeout(() => router.push("/"), 1500);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <ServiceLogo />
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-4">
          ログイン
        </h1>
        <p className="text-center text-gray-500 mb-6">
          登録したメールアドレスとパスワードでログインしてください。
        </p>

        {!success && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded text-gray-800"
              required
            />
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded text-gray-800"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition"
              disabled={loading}
            >
              {loading ? "ログイン中..." : "ログインする"}
            </button>
          </form>
        )}

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700 whitespace-pre-wrap">
            {message}
          </p>
        )}

        {!success && (
          <>
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
                className="text-gray-500 hover:underline hover:text-gray-700"
              >
                トップページに戻る
              </Link>
            </div>
          </>
        )}
        <Footer />
      </div>
    </div>
  );
}
