"use client";

import { useState } from "react";
import DashboardLayout from "../../DashboardLayout";

const AttendanceCorrectionPage = () => {
  const [className, setClassName] = useState("");
  const [date, setDate] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // fetch students attendance by date
  const loadAttendance = async () => {
    if (!className || !date) return alert("Select class & date");

    setLoading(true);

    const res = await fetch(
      `https://pomkara-high-school-server.vercel.app/students/by-class/${className}`
    );

    const data = await res.json();

    // filter attendance by date
    const mapped = data?.map((s) => {
      const today = s?.attendance?.find((a) => a.date === date);

      return {
        ...s,
        todayAttendance: today || null,
      };
    });

    setStudents(mapped);
    setLoading(false);
  };

  const toggleAttendance = async (student) => {
    const isPresent = student.todayAttendance?.isPresent;

    const route = isPresent ? "absent" : "present";

    await fetch(
      `https://pomkara-high-school-server.vercel.app/students/attendance/mark-${route}/${student._id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      }
    );

    loadAttendance();
  };

  return (
    <div className="max-w-4xl mx-auto p-5 space-y-5">
      <h1 className="text-2xl font-bold text-indigo-600">
        Attendance Correction
      </h1>

      {/* filters */}
      <div className="grid md:grid-cols-3 gap-3">
        <select
          className="select select-bordered bg-white text-black"
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

        <label className="md:hidden block ml-2">Select Date</label>
        <input
          type="date"
          className="input input-bordered bg-blue-300 text-black"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          className="btn bg-indigo-600 text-white"
          onClick={loadAttendance}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load Attendance"}
        </button>
      </div>

      {/* table */}
      {students?.length > 0 && (
        <div className="bg-white rounded-xl shadow p-4">
          {/* ⬇️ scroll wrapper */}
          <div className="w-full overflow-x-auto">
            <table className="table w-full md:min-w-[750px]">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th>Name</th>
                  <th>Roll</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {students.map((s) => (
                  <tr key={s._id} className="whitespace-nowrap">
                    <td>{s.name}</td>
                    <td>{s.class_role}</td>

                    <td>
                      {s.todayAttendance ? (
                        s.todayAttendance.isPresent ? (
                          <span className="text-green-600 font-bold">
                            Present
                          </span>
                        ) : (
                          <span className="text-red-500 font-bold">Absent</span>
                        )
                      ) : (
                        <span className="text-gray-400 text-sm">
                          No attendance this day
                        </span>
                      )}
                    </td>

                    <td>
                      {s.todayAttendance && (
                        <button
                          className={`btn btn-sm text-white ${s.todayAttendance.isPresent ? "bg-red-400" : "bg-green-500"}`}
                          onClick={() => toggleAttendance(s)}
                        >
                          {s.todayAttendance.isPresent
                            ? "Mark Absent"
                            : "Mark Present"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!students?.length && (
        <p className="text-gray-500 text-sm">
          Select class & date to load attendance.
        </p>
      )}
    </div>
  );
};

export default AttendanceCorrectionPage;

AttendanceCorrectionPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
