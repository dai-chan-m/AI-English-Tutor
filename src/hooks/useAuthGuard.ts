// src/hooks/useAuthGuard.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabaseClient";

export const useAuthGuard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabaseBrowser().auth.getUser();

      if (user) {
        setIsAuthenticated(true);
      } else {
        router.push("/login");
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  return { isAuthenticated, loading };
};
