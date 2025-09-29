
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 drop-shadow-lg">
            🚀 Welcome to CodeRush 2025
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            The ultimate coding competition for university students. Compete, learn, and win amazing prizes!
          </p>
          <a
            href="/register"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow transition"
          >
            Register Your Team
          </a>
        </div>
        <div className="max-w-2xl mx-auto text-center text-gray-600">
          <h2 className="text-2xl font-bold mb-2">About CodeRush</h2>
          <p>
            CodeRush 2025 brings together the brightest minds to solve real-world problems through code. Join us for a day of innovation, teamwork, and fun. Whether you are a beginner or a pro, there is a place for you!
          </p>
        </div>
      </div>
    </div>
  );
}