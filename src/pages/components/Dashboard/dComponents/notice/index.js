/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "../../DashboardLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// ✅ Rich text editor
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// ✅ HTML sanitize
import DOMPurify from "dompurify";

// ✅ Fix Next.js SSR issue
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

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

  // ✅ Quill editor state
  const [paragraph, setParagraph] = useState("");

  // ✅ print notice state
  const [selectedNotice, setSelectedNotice] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    }
  }, []);

  // ✅ Quill toolbar config
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const fetchNotices = async () => {
    const response = await fetch(
      "https://pomkara-high-school-server.vercel.app/getNotices"
    );

    if (!response.ok) throw new Error("Failed to fetch Notice");

    return response.json();
  };

  const { data: notices, isLoading } = useQuery({
    queryKey: ["notice"],
    queryFn: fetchNotices,
  });

  // ✅ SUBMIT NOTICE
  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    const { heading } = data;

    if (!heading) {
      setLoading(false);
      return setError("Heading is required");
    }

    if (!paragraph || paragraph === "<p><br></p>") {
      setLoading(false);
      return setError("Paragraph is required");
    }

    try {
      // ✅ sanitize HTML before saving
      const cleanParagraph = DOMPurify.sanitize(paragraph);

      const noticeData = {
        heading,
        paragraph: cleanParagraph, // ✅ stored as HTML
        uploader: { name: user?.name, email: user?.email },
        createdAt: new Date(),
      };

      const response = await fetch(
        "https://pomkara-high-school-server.vercel.app/addNotice",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noticeData),
        }
      );

      if (!response.ok) throw new Error("Failed to save notice in MongoDB");

      reset();
      setParagraph("");
      queryClient.invalidateQueries({ queryKey: ["notice"] });
    } catch (err) {
      setError(err.message);
      console.error("Error uploading notice:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE NOTICE
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        const response = await fetch(
          `https://pomkara-high-school-server.vercel.app/deleteNotice/${id}`,
          { method: "DELETE" }
        );

        if (!response.ok) throw new Error("Failed to delete notice");

        queryClient.invalidateQueries({ queryKey: ["notice"] });
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // ✅ PRINT NOTICE
  const handlePrint = (notice) => {
    setSelectedNotice(notice);

    // DOM render করার সময় দিতে হবে
    setTimeout(() => {
      window.print();
      setSelectedNotice(null);
    }, 300);
  };

  // ✅ Role check
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
      {/* ✅ Upload Notice */}
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md mt-5">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-600">
          Upload Notice
        </h1>

        {eror && (
          <p className="text-center mb-4 text-red-500 font-semibold">{eror}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Heading */}
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

          {/* ✅ Rich Paragraph */}
          <div>
            <label className="block text-lg font-semibold mb-2">
              Paragraph (Doc style)
            </label>

            <div className="bg-white text-black">
              <ReactQuill
              className="h-96"
                theme="snow"
                value={paragraph}
                onChange={setParagraph}
                modules={quillModules}
                placeholder="Write notice like a doc file..."
              />
            </div>
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

      {/* ✅ All Notices */}
      <div className="mx-auto p-2 bg-white rounded-lg shadow-md mt-5">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-600">
          All Notices
        </h1>

        {isLoading && (
          <p className="text-center text-gray-500">Loading notices...</p>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left font-medium bg-gray-50">
                  Heading
                </th>
                <th className="px-6 py-3 text-left font-medium bg-gray-50">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {notices?.map((notice) => (
                <tr key={notice._id}>
                  <td className="px-6 py-4 text-sm font-medium">
                    <h2 className="font-bold text-lg">{notice.heading}</h2>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => handlePrint(notice)}
                      >
                        Print
                      </button>

                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={() => handleDelete(notice._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {notices?.length === 0 && !isLoading && (
                <tr>
                  <td colSpan="2" className="text-center py-6 text-gray-500">
                    No notices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ PRINT AREA (Hidden) */}
      {selectedNotice && (
        <div id="printArea">
          {/* ✅ Exact Header Image */}
          <div className="printHeaderImg">
            <img
              src="/notice-header.png"
              alt="School Header"
              className="headerImage"
            />
          </div>

          {/* ✅ NOTICE TITLE */}
          <div className="printTitle">
            <h2>{selectedNotice.heading}</h2>
          </div>

          {/* ✅ NOTICE BODY */}
          <div
            className="printBody ql-editor"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(selectedNotice.paragraph),
            }}
          />

          {/* ✅ Footer signature fixed bottom */}
          <div className="printFooter">
            <div className="signBox">
              <p className="signLine">_______________________</p>
              <p>শ্রেণি শিক্ষক</p>
            </div>

            <div className="signBox">
              <p className="signLine">_______________________</p>
              <p>প্রধান শিক্ষক</p>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* ✅ A4 exact size */
        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          html,
          body {
            width: 210mm;
            height: 297mm;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          body * {
            visibility: hidden;
          }

          #printArea,
          #printArea * {
            visibility: visible;
          }

          /* ✅ PRINT CONTAINER FIXED */
          #printArea {
            position: fixed;
            left: 0;
            top: 0;
            width: 210mm;
            height: 297mm;
            padding: 12mm 12mm 16mm 12mm;
            background: white;
            color: black;
            overflow: hidden;
          }

          /* ✅ prevent multi pages */
          #printArea {
            page-break-after: avoid;
            page-break-before: avoid;
            page-break-inside: avoid;
          }

          /* ✅ remove extra margins */
          .printBody p {
            margin: 0 0 8px 0 !important;
          }

          /* ✅ Lists show properly */
          .printBody ul {
            list-style-type: disc !important;
            padding-left: 22px !important;
            margin: 8px 0 !important;
          }
          .printBody ol {
            list-style-type: decimal !important;
            padding-left: 22px !important;
            margin: 8px 0 !important;
          }
          .printBody li {
            margin: 4px 0 !important;
          }
        }

        /* ✅ HEADER */
        .printHeaderImg {
          width: 100%;
          margin-bottom: 8px;
        }

        .headerImage {
          width: 100%;
          height: auto;
          display: block;
        }

        /* ✅ TITLE */
        .printTitle {
          text-align: center;
          margin: 12px 0 12px;
        }

        .printTitle h2 {
          font-size: 18px;
          font-weight: 700;
          margin: 0;
        }

        /* ✅ BODY */
        .printBody {
          font-size: 14px;
          line-height: 22px;
          padding: 0 4px;
          max-height: 200mm;
          overflow: hidden;
        }

        /* ✅ FOOTER bottom fixed */
        .printFooter {
          position: absolute;
          bottom: 12mm;
          left: 12mm;
          right: 12mm;
          display: flex;
          justify-content: space-between;
          gap: 30px;
        }

        .signBox {
          width: 45%;
          text-align: center;
          font-size: 13px;
        }

        .signLine {
          margin-bottom: 6px;
        }
      `}</style>
    </div>
  );
};

export default Notice;

Notice.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
