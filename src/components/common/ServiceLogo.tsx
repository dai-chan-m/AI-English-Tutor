import { APP_NAME } from "@/constants/app";
import Link from "next/link";

export default function ServiceLogo() {
  return (
    <div className="absolute top-6 left-6 print:hidden">
      <h1 className="text-2xl font-bold text-blue-700 tracking-tight">
        <Link href="/" className="flex items-center">
          <span className="text-3xl">{APP_NAME}</span>
        </Link>
      </h1>
    </div>
  );
}
