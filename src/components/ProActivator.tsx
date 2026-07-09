"use client";

import { useEffect } from "react";
import { setPro } from "@/lib/progress";

/** 決済完了リダイレクト先でこの端末のPro機能を有効化する */
export default function ProActivator() {
  useEffect(() => {
    setPro(true);
  }, []);
  return null;
}
