/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Print
  const [selectedNotice, setSelectedNotice] = useState(null);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://pomkara-high-school-server.vercel.app/api/notices?limit=50`);
      const data = await res.json();
      setNotices(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Failed to fetch notices", error);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ✅ open print preview
  const handleOpenPrintView = (notice) => {
    setSelectedNotice(notice);

    // scroll top (optional)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrint = () => {
    if (!selectedNotice) return;
    setTimeout(() => window.print(), 200);
  };

  const handleClose = () => setSelectedNotice(null);

  return (
    <section className="py-16 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-3 text-gray-800">
            School <span className="text-blue-600">Notices</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Click any notice card to open print view.
          </p>
        </div>

        {/* Loader */}
        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500">Loading Notices...</p>
          </div>
        )}

        {/* Notice List */}
        {!loading && notices.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-6">
            {notices.map((notice) => (
              <button
                key={notice._id}
                onClick={() => handleOpenPrintView(notice)}
                className="text-left bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition">
                      {notice.heading || notice.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      📅 {formatDate(notice.createdAt || notice.publishedAt)}
                    </p>
                  </div>

                  <span className="text-2xl">📰</span>
                </div>

                <p className="text-gray-600 mt-4 line-clamp-3">
                  {/* preview text */}
                  {notice.paragraph
                    ? notice.paragraph.replace(/<[^>]*>?/gm, "").slice(0, 120) + "..."
                    : (notice.content || "").slice(0, 120) + "..."}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-blue-600 text-sm font-semibold">
                    View & Print →
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && notices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Notices Available
            </h3>
            <p className="text-gray-600">Please check back later.</p>
          </div>
        )}

        {/* ✅ Print Preview Modal (click card -> show) */}
        {selectedNotice && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
              {/* Modal Header */}
              <div className="flex justify-between items-center px-5 py-3 border-b bg-gray-50">
                <h3 className="font-bold text-gray-800">
                  Print Preview:{" "}
                  <span className="text-blue-600">
                    {selectedNotice.heading || selectedNotice.title}
                  </span>
                </h3>

                <div className="flex gap-2">
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Print
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="p-4 max-h-[80vh] overflow-auto">
                {/* ✅ print area */}
                <div id="printArea">
                  {/* ✅ exact header image */}
                  <div className="printHeaderImg">
                    <img
                      src="/notice-header.png"
                      alt="School Header"
                      className="headerImage"
                    />
                  </div>

                  {/* title */}
                  <div className="printTitle">
                    <h2>{selectedNotice.heading || selectedNotice.title}</h2>
                  </div>

                  {/* body */}
                  <div
                    className="printBody ql-editor"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        selectedNotice.paragraph || selectedNotice.content || ""
                      ),
                    }}
                  />

                  {/* footer signatures */}
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
              </div>
            </div>

            {/* ✅ Print CSS */}
            <style jsx global>{`
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

                .printBody p {
                  margin: 0 0 8px 0 !important;
                }

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

              .printHeaderImg {
                width: 100%;
                margin-bottom: 8px;
              }
              .headerImage {
                width: 100%;
                height: auto;
                display: block;
              }

              .printTitle {
                text-align: center;
                margin: 12px 0 12px;
              }
              .printTitle h2 {
                font-size: 18px;
                font-weight: 700;
                margin: 0;
              }

              .printBody {
                font-size: 14px;
                line-height: 22px;
                padding: 0 4px;
                max-height: 200mm;
                overflow: hidden;
              }

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
        )}
      </div>
    </section>
  );
}
