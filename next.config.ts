import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // 旧「AI English Tutor」時代のURLからの恒久リダイレクト
    return [
      { source: "/vocab", destination: "/drill", permanent: true },
      { source: "/writing", destination: "/", permanent: true },
      { source: "/chat", destination: "/", permanent: true },
      { source: "/daily", destination: "/", permanent: true },
      { source: "/daily/:path*", destination: "/", permanent: true },
      { source: "/login", destination: "/", permanent: true },
      { source: "/signup", destination: "/", permanent: true },
      { source: "/faq", destination: "/#faq", permanent: true },
    ];
  },
};

export default nextConfig;
