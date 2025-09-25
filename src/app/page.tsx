import ChatBot from "@/components/ChatBox";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🚀 CodeRush 2025
          </h1>
          <p className="text-lg text-gray-600">
            Registration ChatBot - Get registered step by step!
          </p>
        </div>
        <ChatBot />
      </div>
    </div>
  );
}