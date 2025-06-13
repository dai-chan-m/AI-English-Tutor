import Footer from "@/components/common/Footer";
import ServiceLogo from "@/components/common/ServiceLogo";
import LoginForm from "@/components/common/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-green-50 px-4">
      <div className="flex flex-col items-center justify-center flex-grow">
        <ServiceLogo />
        <LoginForm />
        <Footer />
      </div>
    </div>
  );
}
