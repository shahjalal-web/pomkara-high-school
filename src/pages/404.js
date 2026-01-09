import Link from "next/link";

export default function Custom404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white px-4">
      <div className="text-center max-w-xl">
        {/* 404 */}
        <h1 className="text-[120px] font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          404
        </h1>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-blue-100 mb-8">
          Sorry, the page you are looking for doesn’t exist or has been moved.
        </p>

        {/* Action */}
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:scale-105"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
