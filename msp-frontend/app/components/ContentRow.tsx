"use client";

interface ContentItem {
  id: string;
  title: string;
  progress?: number;
  duration?: string;
  image?: string;
}

interface ContentRowProps {
  title: string;
  items: ContentItem[];
  showProgress?: boolean;
  showSeeAll?: boolean;
}

export default function ContentRow({
  title,
  items,
  showProgress = false,
  showSeeAll = false,
}: ContentRowProps) {
  const backgroundImageUrl = "https://image.tmdb.org/t/p/original/kHOfxq7cMTXyLbj0UmdoGhT540O.jpg";

  return (
    <section className="px-6 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {showSeeAll && (
          <button className="text-gray-400 hover:text-white transition-colors">
            See all &gt;
          </button>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {items.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-98">
            <div className="bg-gray-800 rounded-lg overflow-hidden group hover:scale-105 transition-transform">
              {/* Content image */}
              <div
                className="w-full h-64 bg-cover bg-center relative"
                style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
              >
                {showProgress && item.progress && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gray-700 h-1">
                    <div
                      className="bg-red-600 h-full"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="p-3">
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                {item.duration && (
                  <p className="text-gray-400 text-xs">{item.duration}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}