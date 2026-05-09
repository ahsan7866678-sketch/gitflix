import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141414] px-4">
      <div className="text-center">
        <h1 className="text-8xl font-black text-[#e50914] mb-4">404</h1>
        <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. It may have been moved or deleted.
        </p>
        <Link
          to="/"
          className="bg-[#e50914] hover:bg-[#c4070f] text-white font-semibold px-8 py-3 rounded-lg transition-colors inline-block"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
