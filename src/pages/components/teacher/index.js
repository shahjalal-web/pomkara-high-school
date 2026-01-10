/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useMemo, useState } from "react";
import Stack from "./Stack"; // ✅ ChromaGrid removed

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const departments = [
    "Science",
    "Arts",
    "Commerce",
    "Mathematics",
    "English",
    "Bangla",
  ];

  const DEPARTMENT_COLORS = {
    science: { badge: "bg-blue-600", ring: "ring-blue-500/40" },
    arts: { badge: "bg-amber-500", ring: "ring-amber-500/40" },
    commerce: { badge: "bg-emerald-600", ring: "ring-emerald-500/40" },
    mathematics: { badge: "bg-violet-600", ring: "ring-violet-500/40" },
    english: { badge: "bg-red-500", ring: "ring-red-500/40" },
    bangla: { badge: "bg-cyan-600", ring: "ring-cyan-500/40" },
  };

  useEffect(() => {
    fetchTeachers();
  }, [selectedDepartment]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const url = selectedDepartment
        ? `https://pomkara-high-school-server.vercel.app/teachers_for_front_end?department=${selectedDepartment}`
        : `https://pomkara-high-school-server.vercel.app/teachers_for_front_end`;

      const res = await fetch(url);
      const data = await res.json();
      setTeachers(data);
    } catch {
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  /* ✅ teachers -> cards */
  const cards = useMemo(() => {
    return teachers.map((t) => {
      const deptKey = (t.group || "science").toLowerCase();
      const style = DEPARTMENT_COLORS[deptKey] || DEPARTMENT_COLORS.science;

      return (
        <div className="w-full h-full relative">
          {/* Background image */}
          <img
            src={t.image || "https://i.pravatar.cc/500"}
            alt={t.name}
            className="w-full h-full object-cover pointer-events-none"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* Info */}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-bold truncate">{t.name}</h3>
              <span className={`text-xs px-3 py-1 rounded-full ${style.badge}`}>
                {deptKey.toUpperCase()}
              </span>
            </div>

            <p className="text-sm text-white/80 mt-1">📞 {t.number || "—"}</p>

            {t.subjects?.length > 0 && (
              <p className="text-xs text-white/70 mt-2 line-clamp-2">
                Subjects: {t.subjects.join(", ")}
              </p>
            )}
          </div>

          {/* Glow ring */}
          <div
            className={`absolute inset-0 ring-4 ${style.ring} rounded-2xl`}
          />
        </div>
      );
    });
  }, [teachers]);

  return (
    <section id="teachers" className="py-20 bg-white overflow-x-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Our <span className="text-blue-600">Teachers</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Meet our dedicated and experienced faculty members.
          </p>
        </div>

        {/* Department Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setSelectedDepartment("")}
            className={`px-4 py-2 rounded-full text-sm transition ${
              selectedDepartment === ""
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            All Departments
          </button>

          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                selectedDepartment === dept
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 mx-auto" />
          </div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No teachers found.
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-[92%] max-w-[360px] md:max-w-lg mx-auto">
              {/* ✅ allow stack peeking */}
              <div className="relative w-full h-[420px] md:h-[520px] overflow-visible">
                <Stack
                  cards={cards}
                  randomRotation={false}
                  sensitivity={180}
                  sendToBackOnClick={true}
                  autoplay={true}
                  autoplayDelay={3500}
                  pauseOnHover={true}
                  mobileClickOnly={true}
                />
              </div>

              <p className="text-center text-sm text-gray-500 mt-6">
                Drag or click cards to browse teachers.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
