"use client";
import { useEffect, useState } from "react";

const MAX_TITLE_LENGTH = 28;

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("events");
  const [filterCategory, setFilterCategory] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gallery, setGallery] = useState([]);

  const categories = ["events", "campus", "activities", "achievements", "sports"];

  /* ---------------- FETCH GALLERY ---------------- */
  useEffect(() => {
    fetchGallery();
  }, [filterCategory]);

  const fetchGallery = async () => {
    const url = filterCategory
      ? `https://pomkara-high-school-server.vercel.app/gallery?category=${filterCategory}`
      : "https://pomkara-high-school-server.vercel.app/gallery";

    const res = await fetch(url);
    const data = await res.json();
    setGallery(data);
  };

  /* ---------------- UPLOAD ---------------- */
  const uploadImage = async () => {
    if (!image) return alert("Select an image");

    if (title.length > MAX_TITLE_LENGTH) {
      setError(`Title must be less than ${MAX_TITLE_LENGTH} characters`);
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Upload to imgBB
      const formData = new FormData();
      formData.append("image", image);

      const imgbbRes = await fetch(
        `https://api.imgbb.com/1/upload?key=d7d4f9a3ea286c573db8cbeb4f1b3520`,
        { method: "POST", body: formData }
      );
      const imgbbData = await imgbbRes.json();
      const imageUrl = imgbbData.data.url;

      // Save to backend
      await fetch("https://pomkara-high-school-server.vercel.app/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          imageUrl,
          createdAt: new Date()
        })
      });

      setTitle("");
      setImage(null);
      fetchGallery();
      alert("Image uploaded successfully!");
    } catch {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DELETE ---------------- */
  const deleteImage = async (id) => {
    const ok = confirm("Are you sure you want to delete this image?");
    if (!ok) return;

    await fetch(`https://pomkara-high-school-server.vercel.app/gallery/${id}`, {
      method: "DELETE"
    });

    setGallery((prev) => prev.filter((item) => item._id !== id));
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen p-6 md:p-10 bg-gray-100">
      {/* Upload Form */}
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow mb-12">
        <h2 className="text-2xl font-bold mb-4">📤 Upload Gallery Image</h2>

        {/* Title */}
        <input
          type="text"
          placeholder="Title (max 28 characters)"
          className="w-full mb-1 p-2 border rounded bg-white text-black"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (e.target.value.length > MAX_TITLE_LENGTH) {
              setError(`Title must be less than ${MAX_TITLE_LENGTH} characters`);
            } else {
              setError("");
            }
          }}
        />

        <div className="text-sm mb-2 text-gray-500">
          {title.length}/{MAX_TITLE_LENGTH}
        </div>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        {/* Category */}
        <select
          className="w-full mb-3 p-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Image */}
        <input
          type="file"
          accept="image/*"
          className="w-full mb-4"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          onClick={uploadImage}
          disabled={loading || !!error}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Gallery Table */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
          <h3 className="text-2xl font-bold">🖼️ Gallery Images</h3>

          {/* Filter */}
          <select
            className="p-2 border rounded w-full md:w-64"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {gallery.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No images found
                  </td>
                </tr>
              ) : (
                gallery.map((item) => (
                  <tr key={item._id} className="border-t">
                    <td className="p-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-24 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-3 max-w-xs truncate">{item.title}</td>
                    <td className="p-3 capitalize">{item.category}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => deleteImage(item._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
