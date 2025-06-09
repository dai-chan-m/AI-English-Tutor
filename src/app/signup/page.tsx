import Footer from "@/components/common/Footer";
import ServiceLogo from "@/components/common/ServiceLogo";
import SignupForm from "@/components/common/SignupForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white px-4 py-10">
      <div className="flex flex-col items-center justify-center flex-grow">
        <ServiceLogo />
        <SignupForm />
        <Footer />
      </div>
    </div>
  );
}
