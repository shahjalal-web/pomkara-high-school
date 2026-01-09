"use client";
import { useEffect, useState } from "react";
import CircularGallery from "./CircularGallery";

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: "", label: "All", icon: "📸" },
    { value: "events", label: "Events", icon: "🎉" },
    { value: "campus", label: "Campus", icon: "🏫" },
    { value: "activities", label: "Activities", icon: "🎨" },
    { value: "achievements", label: "Achievements", icon: "🏆" },
    { value: "sports", label: "Sports", icon: "⚽" }
  ];

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://pomkara-high-school-server.vercel.app/gallery?category=${selectedCategory}`
    )
      .then(res => res.json())
      .then(data => {
        // CircularGallery expects { image, text }
        const formatted = (data.images || data).map(item => ({
          image: item.imageUrl,
          text: item.title || ""
        }));
        setItems(formatted);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <section className="text-black bg-white min-h-screen">
      {/* Header */}
      <div className="text-center pt-20 pb-6">
        <h2 className="text-4xl md:text-5xl font-bold">
          Photo <span className="text-blue-500">Gallery</span>
        </h2>
        <p className="text-gray-400 mt-3">
          Drag, scroll or swipe to explore moments
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-3 overflow-x-auto px-4 pb-6 justify-center">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
              selectedCategory === cat.value
                ? "bg-blue-600 text-white"
                : "text-gray-800 bg-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery */}
      <div className="h-[70vh]">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500">Loading Gallery...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            No images found
          </div>
        ) : (
          <CircularGallery
            items={items}
            bend={-3}
            borderRadius={0.08}
            textColor="#black"
            scrollSpeed={3}
          />
        )}
      </div>
    </section>
  );
}
