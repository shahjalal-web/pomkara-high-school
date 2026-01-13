"use client";

import { useState } from "react";
import DashboardLayout from "../../DashboardLayout";

const AttendancePage = () => {
  const [className, setClassName] = useState("");
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({}); // ✅ checked = present
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // ✅ Helper: today এর আগের last attendance date বের করবে (১ দিন আগের না)
  const getLastAttendanceDate = (attendanceArr = []) => {
    if (!attendanceArr.length) return null;

    const dates = attendanceArr
      .map((a) => a.date)
      .filter((d) => d && d < today) // only before today
      .sort();

    if (dates.length === 0) return null;

    return dates[dates.length - 1]; // last date
  };

  // ✅ CREATE / LOAD ATTENDANCE
  const createAttendance = async () => {
    if (!className) return alert("Please select a class");

    try {
      setLoading(true);

      const res = await fetch(
        `https://pomkara-high-school-server.vercel.app/students/attendance/create/${className}`,
        { method: "PATCH" }
      );

      const data = await res.json();
      const list = data.students || [];
      setStudents(list);

      // ✅ default: everyone checked (Present)
      const initialMap = {};
      list.forEach((s) => {
        initialMap[s._id] = true;
      });
      setAttendanceMap(initialMap);
    } catch (err) {
      console.log(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle checkbox (Present)
  const toggleAttendance = (id) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ✅ SUBMIT Attendance
  const submitAttendance = async () => {
    if (students.length === 0) return alert("No students found");

    try {
      setSubmitting(true);

      const presentIds = [];
      const absentIds = [];

      students.forEach((s) => {
        if (attendanceMap[s._id])
          presentIds.push(s._id); // ✅ checked => present
        else absentIds.push(s._id); // ❌ unchecked => absent
      });

      const res = await fetch(
        `https://pomkara-high-school-server.vercel.app/students/attendance/submit`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            className,
            date: today,
            presentIds,
            absentIds,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) return alert(data.message || "Submit failed ❌");

      alert("Attendance submitted successfully ✅");
    } catch (err) {
      console.log(err);
      alert("Server error!");
    } finally {
      setSubmitting(false);
    }
  };

  const presentCount = Object.values(attendanceMap).filter(Boolean).length;
  const absentCount = students.length - presentCount;

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
        <div className="bg-white rounded-xl shadow p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Attendance — {today}</h2>
          </div>

          <table className="table w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                <th>Name</th>
                <th>Roll</th>
                <th className="text-center">Present?</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => {
                // ✅ last attendance date find (today এর আগের)
                const lastDate = getLastAttendanceDate(s.attendance || []);

                // ✅ last date attendance find
                const lastAttendance = lastDate
                  ? s.attendance?.find((a) => a.date === lastDate)
                  : null;

                // ✅ last attendance এ absent হলে red
                const wasAbsentLastTime =
                  lastAttendance && lastAttendance.isPresent === false;

                return (
                  <tr key={s._id}>
                    <td
                      className={`font-medium ${
                        wasAbsentLastTime ? "text-red-600" : "text-black"
                      }`}
                      title={
                        wasAbsentLastTime
                          ? `Absent on last attendance (${lastDate})`
                          : lastDate
                            ? `Present on last attendance (${lastDate})`
                            : "No previous attendance found"
                      }
                    >
                      {s.name}
                    </td>

                    <td>{s.class_role}</td>

                    <td className="text-center">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-success"
                        checked={!!attendanceMap[s._id]} // ✅ checked = present
                        onChange={() => toggleAttendance(s._id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-between items-center gap-3">
            <p className="text-sm text-gray-500">
              ✅ Tick = Present | ❌ Untick = Absent
            </p>

            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold">
                Present: <span className="text-green-600">{presentCount}</span>{" "}
                | Absent: <span className="text-red-600">{absentCount}</span>
              </p>

              <button
                onClick={submitAttendance}
                className="btn bg-blue-600 text-white"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Attendance"}
              </button>
            </div>
          </div>
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
