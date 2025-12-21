import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { FaPen } from "react-icons/fa";
import { useRouter } from "next/router";

const PrincipleDashboard = () => {
  const [searchKey, setSearchKey] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    }
  }, []);

  const handleUpdateClick = (studentId) => {
    router.push(`/components/Dashboard/dComponents/student/${studentId}`);
  };

  const handleSearch = async (key = searchKey) => {
    if (!key.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://pomkara-high-school-server.vercel.app/students/search/${key}`
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-green-700 mb-3">
          Principal Dashboard
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Search and manage students easily
        </p>

        {/* Search Input */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            value={searchKey}
            onChange={(e) => {
              const value = e.target.value;
              setSearchKey(value);

              if (typingTimeout) {
                clearTimeout(typingTimeout);
              }

              const timeout = setTimeout(() => {
                if (value.trim()) {
                  handleSearch(value);
                } else {
                  setSearchResults([]);
                }
              }, 400); // debounce

              setTypingTimeout(timeout);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder="Search by student name or roll"
            className="w-full md:flex-1 input input-bordered bg-white text-black border-green-400 focus:border-green-600"
          />

          <button
            onClick={() => handleSearch()}
            className="btn bg-green-600 hover:bg-green-700 text-white px-8"
          >
            Search
          </button>
        </div>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center my-10">
          <span className="loading loading-spinner loading-lg text-green-600"></span>
        </div>
      )}

      {/* Result Table */}
      {searchResults.length > 0 && (
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="text-center">Name</th>
                <th className="text-center">Class</th>
                <th className="text-center">Class Roll</th>
                <th className="text-center">Due Payment</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((student) => {
                const due =
                  student.due_payment.reduce((acc, curr) => {
                    const amount = parseFloat(curr.amount) || 0;
                    return acc + amount;
                  }, 0) -
                  student.paid_payment.reduce((acc, curr) => {
                    const amount = parseFloat(curr.amount) || 0;
                    return acc + amount;
                  }, 0);

                return (
                  <tr
                    key={student._id}
                    className="hover:bg-green-50 transition"
                  >
                    <td className="text-center font-medium">
                      {student.name}
                    </td>
                    <td className="text-center">{student.class}</td>
                    <td className="text-center">{student.class_role}</td>
                    <td className="text-center font-semibold text-red-600">
                      {due.toFixed(2)} ৳
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleUpdateClick(student._id)}
                        className="btn btn-sm btn-outline border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                      >
                        <FaPen />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && searchKey && searchResults.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No student found
        </p>
      )}
    </div>
  );
};

export default PrincipleDashboard;

PrincipleDashboard.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
