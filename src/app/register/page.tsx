
import RegistrationForm from "@/components/RegistrationForm";
import ChatBot from "@/components/ChatBox";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <RegistrationForm />
        </div>
        <div className="w-full md:w-96">
          <ChatBot />
        </div>
      </div>
    </div>
  );
}