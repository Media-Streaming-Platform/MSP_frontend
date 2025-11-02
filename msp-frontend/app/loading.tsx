// app/loading.tsx
export default function Loading() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          {/* Main Spinner */}
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-red-600/30 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          
          {/* Loading Text */}
          <h2 className="text-2xl font-bold text-white mb-4">Loading Faith Stream</h2>
          
          {/* Progress Bar */}
          <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto mb-4">
            <div className="h-full bg-gradient-to-r from-red-600 to-purple-600 animate-pulse"></div>
          </div>
          
          {/* Loading Dots */}
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          {/* Subtle Message */}
          <p className="text-gray-400 mt-6">Preparing your spiritual journey...</p>
        </div>
      </div>
    );
  }