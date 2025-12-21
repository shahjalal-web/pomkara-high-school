/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "../../DashboardLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Result = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [eror, setError] = useState("");
  const [result, setResult] = useState([]);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    }
  }, []);

  const fetchResult = async () => {
    const response = await fetch(
      "https://pomkara-high-school-server.vercel.app/getResult"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Result");
    }
    return response.json();
  };

  const {
    data: results,
    error,
    isLoading,
  } = useQuery({ queryKey: ["result"], queryFn: fetchResult });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    const { heading, image } = data;
    const imageFile = image[0];
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const imgbbApiKey = "d1fbaa0b9f043f285b08e6d997b387ef"; // Replace with your API key
      const imgbbResponse = await fetch(
        `https://api.imgbb.com/1/upload?expiration=2592000&key=${imgbbApiKey}`,
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

      const resultData = {
        heading,
        image: imageUrl,
        uploader: { name: user?.name, email: user?.email },
      };

      const response = await fetch(
        "https://pomkara-high-school-server.vercel.app/addResult",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resultData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save result in MongoDB");
      }
      // alert("result uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["result"] });
    } catch (err) {
      setError(err.message);
      console.error("Error uploading result:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, deleteUrl) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        // Delete result from MongoDB
        const response = await fetch(
          `https://pomkara-high-school-server.vercel.app/deleteResult/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete result");
        }
        queryClient.invalidateQueries({ queryKey: ["result"] });
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="mt-5 text-center">
        <span className="loading loading-spinner text-primary"></span>
        <span className="loading loading-spinner text-secondary"></span>
        <span className="loading loading-spinner text-accent"></span>
        <span className="loading loading-spinner text-neutral"></span>
        <span className="loading loading-spinner text-info"></span>
        <span className="loading loading-spinner text-success"></span>
        <span className="loading loading-spinner text-warning"></span>
        <span className="loading loading-spinner text-error"></span>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (
    !["teacher", "principle", "faculty"].includes(user?.role) ||
    user?.isApprove == false
  ) {
    return (
      <div className="text-center mt-4 text-2xl text-red-500 font-serif">
        Please login first to see this section
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Results | Pomkara Siddikur Rahman & Hakim High School</title>
        <meta
          name="description"
          content="View the latest examination results and academic performance at Pomkara Siddikur Rahman & Hakim High School. Check your results and track academic progress here."
        />
        <meta
          name="keywords"
          content="results, Pomkara Siddikur Rahman & Hakim High School, examination results, academic performance, student results"
        />
        <meta
          property="og:title"
          content="Results - Pomkara Siddikur Rahman & Hakim High School"
        />
        <meta
          property="og:description"
          content="Check the latest examination results and academic performance at Pomkara Siddikur Rahman & Hakim High School. Stay updated with your academic progress."
        />
        <meta
          property="og:image"
          content="[URL to an image related to results or the school]"
        />
        <meta property="og:url" content="https://pomkara-high-school.netlify.app/components/results" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Results - Pomkara Siddikur Rahman & Hakim High School"
        />
        <meta
          name="twitter:description"
          content="Access your examination results and academic performance from Pomkara Siddikur Rahman & Hakim High School. Stay informed about your progress and achievements."
        />
        <meta
          name="twitter:image"
          content="[URL to an image related to results or the school]"
        />
      </Head>
      <div>
        <div className="md:w-1/2 mx-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-2 shadow-xl mt-5"
          >
            <div>
              <label className="block text-lg font-semibold mb-2">
                Heading
              </label>
              <input
                type="text"
                className="w-full p-3 border bg-white text-black rounded-lg focus:outline-none focus:ring focus:ring-green-500"
                {...register("heading", { required: true })}
              />
              {errors.heading && (
                <span className="text-red-400 ml-2">
                  this field is required
                </span>
              )}
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
                <span className="text-red-400 ml-2">
                  This field is required
                </span>
              )}
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-green-500 text-white py-3 px-8 rounded-lg font-semibold hover:bg-green-600 transition-all mt-3"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload Result"}
              </button>
            </div>
          </form>
        </div>

        <div className=" mx-auto p-2 bg-white rounded-lg shadow-md mt-5">
          <h1 className="text-3xl font-bold text-center mb-6 text-green-600">
            All Result
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
                {results.map((result) => (
                  <tr key={result._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm ">
                      <img
                        src={result.image}
                        alt={result.heading}
                        className="w-24 h-24 object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                      {result.heading}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={() =>
                          handleDelete(result._id, result.deleteUrl)
                        }
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
    </div>
  );
};

export default Result;

Result.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
