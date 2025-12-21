/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "../../DashboardLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Notice = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [eror, setError] = useState("");
  const [user, setUser] = useState(null);

  const queryClient = useQueryClient();


  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    }
  }, []);


  const fetchNotices = async () => {
    const response = await fetch("https://pomkara-high-school-server.vercel.app/getNotices");
    if (!response.ok) {
      throw new Error("Failed to fetch Notice");
    }
    return response.json();
  };

  const {
    data: notices,
    error,
    isLoading,
  } = useQuery({ queryKey: ["notice"], queryFn: fetchNotices });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    const { heading, paragraph, image } = data;
    const imageFile = image[0];
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const imgbbApiKey = "d1fbaa0b9f043f285b08e6d997b387ef"; // Replace with your API key
      const imgbbResponse = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const imgbbData = await imgbbResponse.json();
      //console.log(imgbbData);

      if (!imgbbResponse.ok || !imgbbData.success) {
        throw new Error("Failed to upload image to imgbb");
      }

      const imageUrl = imgbbData.data.url;

      const noticeData = {
        heading,
        paragraph,
        image: imageUrl,
        uploader: {name: user?.name, email: user?.email}
      };

      const response = await fetch("https://pomkara-high-school-server.vercel.app/addNotice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noticeData),
      });

      if (!response.ok) {
        throw new Error("Failed to save notice in MongoDB");
      }

     
      queryClient.invalidateQueries({ queryKey: ["notice"] });
    } catch (err) {
      setError(err.message);
      console.error("Error uploading notice:", err);
    } finally {
      setLoading(false);
    }
  };

  

  const handleDelete = async (id, deleteUrl) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        // Delete notice from MongoDB
        const response = await fetch(
          `https://pomkara-high-school-server.vercel.app/deleteNotice/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete notice");
        }

        // Remove notice from local state
        queryClient.invalidateQueries({ queryKey: ["notice"] });
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (!["teacher", "principle", "faculty"].includes(user?.role) || user?.isApprove == false) {
    return <div  className="text-center mt-4 text-2xl text-red-500 font-serif">Please login first to see this section</div>;
  }

  return (
    <div>
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md mt-5">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-600">
          Upload Notice
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold mb-2">Heading</label>
            <input
              type="text"
              className="w-full p-3 border bg-white text-black rounded-lg focus:outline-none focus:ring focus:ring-green-500"
              {...register("heading", { required: true })}
            />
            {errors.heading && (
              <span className="text-red-400 ml-2">this field is required</span>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">
              Paragraph
            </label>
            <textarea
              className="w-full p-3 border bg-white text-black rounded-lg focus:outline-none focus:ring focus:ring-green-500"
              rows="5"
              {...register("paragraph")}
            ></textarea>
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-green-500"
              {...register("image", { required: true })}
            />
            {errors.image && (
              <span className="text-red-400 ml-2">This field is required</span>
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-green-500 text-white py-3 px-8 rounded-lg font-semibold hover:bg-green-600 transition-all"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Notice"}
            </button>
          </div>
        </form>
      </div>

      <div className=" mx-auto p-2 bg-white rounded-lg shadow-md mt-5">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-600">
          All Notices
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left font-medium  bg-gray-50">
                  Image
                </th>
                <th className="px-6 py-3 text-left font-medium  bg-gray-50">
                  Heading
                </th>
                <th className="px-6 py-3 text-left font-medium  bg-gray-50">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {notices?.map((notice) => (
                <tr key={notice._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm ">
                    <img
                      src={notice.image}
                      alt={notice.heading}
                      className="w-24 h-24 object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                    {notice.heading}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => handleDelete(notice._id, notice.deleteUrl)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Notice;

Notice.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
