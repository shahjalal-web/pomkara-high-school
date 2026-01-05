"use client";

import { useState } from "react";
import DashboardLayout from "../../DashboardLayout";

const AttendancePage = () => {
  const [className, setClassName] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // CREATE ATTENDANCE
  const createAttendance = async () => {
    if (!className) return alert("Please select a class");

    setLoading(true);

    const res = await fetch(
      `https://pomkara-high-school-server.vercel.app/students/attendance/create/${className}`,
      { method: "PATCH" }
    );

    const data = await res.json();
    setStudents(data.students || []);
    setLoading(false);
  };

  // MARK PRESENT
  const markPresent = async (id) => {
    await fetch(`https://pomkara-high-school-server.vercel.app/students/attendance/mark-present/${id}`, {
      method: "PATCH",
    });

    // Refresh
    createAttendance();
  };

  // MARK ABSENT
  const markAbsent = async (id) => {
    await fetch(`https://pomkara-high-school-server.vercel.app/students/attendance/mark-absent/${id}`, {
      method: "PATCH",
    });

    // Refresh
    createAttendance();
  };

  return (
    <div className="max-w-4xl mx-auto p-5 space-y-5">
      <h1 className="text-2xl font-bold text-green-600">Class Attendance</h1>

      {/* SELECT CLASS */}
      <div className="flex gap-3">
        <select
          className="select select-bordered w-full bg-white text-black"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        >
          <option value="">Select class</option>
          <option value="6">Class 6</option>
          <option value="7">Class 7</option>
          <option value="8">Class 8</option>
          <option value="9">Class 9</option>
          <option value="10">Class 10</option>
          <option value="exam batch">Exam Batch</option>
        </select>

        <button
          onClick={createAttendance}
          className="btn bg-green-600 text-white"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Attendance"}
        </button>
      </div>

      {/* STUDENT LIST */}
      {students.length > 0 && (
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-bold mb-3">Attendance — {today}</h2>

          <table className="table w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                <th>Name</th>
                <th>Roll</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => {
                const todayAttendance = s.attendance?.find(
                  (a) => a.date === today
                );

                return (
                  <tr key={s._id}>
                    <td>{s.name}</td>
                    <td>{s.class_role}</td>

                    <td>
                      {todayAttendance?.isPresent ? (
                        <button
                          className="btn btn-sm bg-red-500 text-white"
                          onClick={() => markAbsent(s._id)}
                        >
                          Mark Absent
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm bg-green-500 text-white"
                          onClick={() => markPresent(s._id)}
                        >
                          Mark Present
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {students.length === 0 && (
        <p className="text-gray-500 text-sm">
          Select a class and create attendance to continue.
        </p>
      )}
    </div>
  );
};

export default AttendancePage;

AttendancePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
