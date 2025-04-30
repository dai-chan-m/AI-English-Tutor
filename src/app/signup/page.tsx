import Footer from "@/components/Footer";
import ServiceLogo from "@/components/ServiceLogo";
import SignupForm from "@/components/SignupForm";

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
