'use client';

export default function HeroSection() {
  return (
    <section className="relative h-[70vh] bg-gradient-to-r from-purple-900/50 to-blue-900/50">
      <div className="absolute inset-0 bg-black/50 z-10" />
      <div className="relative z-20 h-full flex items-center justify-start px-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-gray-800 rounded-full text-sm font-medium">
              Sci-Fi
            </span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">⭐</span>
              <span className="font-semibold">8.7</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Quantum Odyssey
          </h1>
          
          <p className="text-gray-300 text-lg mb-6 max-w-lg">
            A mind-bending journey through parallel dimensions where nothing is as it seems. 
            Follow the crew as they uncover the secrets of the universe.
          </p>
          
          <div className="flex gap-4">
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
              ▶ Play
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
              + My List
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}