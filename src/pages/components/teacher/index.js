/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import ChromaGrid from "./ChromaGrid";

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
    science: {
      border: "#2563EB",
      gradient: "linear-gradient(145deg,#2563EB,#000)",
    },
    arts: {
      border: "#F59E0B",
      gradient: "linear-gradient(145deg,#F59E0B,#000)",
    },
    commerce: {
      border: "#10B981",
      gradient: "linear-gradient(145deg,#10B981,#000)",
    },
    mathematics: {
      border: "#8B5CF6",
      gradient: "linear-gradient(145deg,#8B5CF6,#000)",
    },
    english: {
      border: "#EF4444",
      gradient: "linear-gradient(145deg,#EF4444,#000)",
    },
    bangla: {
      border: "#06B6D4",
      gradient: "linear-gradient(145deg,#06B6D4,#000)",
    },
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
      console.log(data, "teacher");
      setTeachers(data);
    } catch {
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  /* 🔁 Convert teacher → ChromaGrid item */
  const chromaItems = teachers.map((t) => {
    const deptKey = t.group?.toLowerCase() || "science";
    const color = DEPARTMENT_COLORS[deptKey] || DEPARTMENT_COLORS.science;

    return {
      image: t.image || "https://i.pravatar.cc/300",
      title: t.name,
      subtitle: t.number || "—",
      handle: deptKey.toUpperCase(),
      borderColor: color.border,
      gradient: color.gradient,
      url: t.image || "",
    };
  });

  return (
    <section id="teachers" className="py-20 bg-white">
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
            className={`px-4 py-2 rounded-full text-sm ${
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
              className={`px-4 py-2 rounded-full text-sm ${
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
          <ChromaGrid
            items={chromaItems}
            radius={320}
            damping={0.5}
            fadeOut={0.6}
          />
        )}
      </div>
    </section>
  );
}
