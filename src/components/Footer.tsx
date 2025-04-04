import { APP_NAME } from "@/constants/app";

export default function Footer() {
  return (
    <footer className="mt-20 text-gray-400 text-sm text-center print:hidden">
      © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
    </footer>
  );
}
