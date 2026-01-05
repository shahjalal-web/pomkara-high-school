"use client";

import { useState, useMemo } from "react";

const AttendanceSummary = ({ attendance = [] }) => {
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredAttendance = useMemo(() => {
    return attendance.filter((a) => {
      const d = new Date(a.date);

      if (filter === "all") return true;

      if (filter === "year") {
        return startDate && d.getFullYear() === Number(startDate);
      }

      if (filter === "month") {
        const [y, m] = startDate.split("-");
        return (
          d.getFullYear() === Number(y) &&
          d.getMonth() + 1 === Number(m)
        );
      }

      if (filter === "range") {
        return (
          (!startDate || new Date(a.date) >= new Date(startDate)) &&
          (!endDate || new Date(a.date) <= new Date(endDate))
        );
      }

      return true;
    });
  }, [attendance, filter, startDate, endDate]);

  const totalPresent = filteredAttendance.filter((a) => a.isPresent).length;
  const totalAbsent = filteredAttendance.filter((a) => !a.isPresent).length;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-center mb-4 text-indigo-600">
        Attendance Summary
      </h3>

      {/* Filters */}
      <div className="grid md:grid-cols-4 gap-3 mb-4">
        <select
          className="select select-bordered bg-white"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setStartDate("");
            setEndDate("");
          }}
        >
          <option value="all">All Records</option>
          <option value="year">Filter by Year</option>
          <option value="month">Filter by Month</option>
          <option value="range">Date Range</option>
        </select>

        {filter === "year" && (
          <input
            type="number"
            className="input input-bordered bg-blue-200 text-black"
            placeholder="Enter year (2026)"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        )}

        {filter === "month" && (
          <input
            type="month"
            className="input input-bordered bg-white text-black"
placeholder="Enter Month"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        )}

        {filter === "range" && (
          <>
            <input
              type="date"
              className="input input-bordered bg-white text-black"
placeholder="Enter Started Month"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="input input-bordered bg-white text-black"
placeholder="Enter Ending Month"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
        <div className="p-4 rounded-xl bg-green-100 text-green-700 font-bold">
          Present: {totalPresent}
        </div>
        <div className="p-4 rounded-xl bg-red-100 text-red-700 font-bold">
          Absent: {totalAbsent}
        </div>
        <div className="p-4 rounded-xl bg-blue-100 text-blue-700 font-bold">
          Total Days: {filteredAttendance.length}
        </div>
        <div className="p-4 rounded-xl bg-indigo-100 text-indigo-700 font-bold">
          Attendance % :
          {filteredAttendance.length
            ? ` ${Math.round(
                (totalPresent / filteredAttendance.length) * 100
              )}%`
            : " 0%"}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredAttendance
              ?.slice()
              .reverse()
              .map((a, i) => (
                <tr key={i}>
                  <td>{new Date(a.date).toLocaleDateString()}</td>
                  <td>
                    {a.isPresent ? (
                      <span className="text-green-600 font-bold">
                        Present
                      </span>
                    ) : (
                      <span className="text-red-500 font-bold">
                        Absent
                      </span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceSummary;
