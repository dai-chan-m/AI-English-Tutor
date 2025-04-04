// src/hooks/useAuthGuard.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabaseClient";

export const useAuthGuard = (redirectOnFailure = true) => {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // ログインページとサインアップページでは認証チェックをスキップ
    if (pathname === "/login" || pathname === "/signup") {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabaseBrowser().auth.getUser();

      if (user) {
        setIsAuthenticated(true);
      } else if (redirectOnFailure) {
        router.push("/login");
      }
      setLoading(false);
    };

    checkAuth();
  }, [router, pathname, redirectOnFailure]);

  return { isAuthenticated, checkingAuth };
};
