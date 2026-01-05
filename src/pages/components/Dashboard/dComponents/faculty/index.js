import React, { useEffect, useState } from "react";
import DashboardLayout from "../../DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  approveFaculty,
  deletefaculty,
  fetchFacultyData,
  unapproveFaculty,
} from "../../../../../../Redux/api/faculty";
import { FaTrash } from "react-icons/fa";

const Faculty = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const { facultys, loading, error } = useSelector((state) => state.faculty);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  useEffect(() => {
    dispatch(fetchFacultyData());
  }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(approveFaculty(id));
    dispatch(fetchFacultyData());
  };

  const handleUnApprove = (id) => {
    dispatch(unapproveFaculty(id));
    dispatch(fetchFacultyData());
  };

  const handleDelete = (id) => {
    dispatch(deletefaculty(id));
    dispatch(fetchFacultyData());
  };

  /* ---------- STATES ---------- */
  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg text-green-600"></span>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-6">Error: {error}</p>;
  }

  if (!user) {
    return (
      <p className="text-center mt-6 text-xl text-red-500 font-serif">
        Please login first.
      </p>
    );
  }

  if (user?.role !== "principle") {
    return (
      <p className="text-center mt-6 text-xl text-red-500 font-serif">
        This section is for the principal only.
      </p>
    );
  }

  if (user?.isApprove === false) {
    return (
      <p className="text-center mt-6 text-xl text-red-500 font-serif">
        Only approved principals can see this section.
      </p>
    );
  }

  const unapprovedFaculty = facultys.filter((f) => !f.isApprove);
  const approvedFaculty = facultys.filter((f) => f.isApprove === true);

  return (
    <div className="p-6 md:p-10 space-y-16">
      {/* 🔴 Pending Faculty */}
      {unapprovedFaculty.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-6">
            Pending Management Approvals
          </h2>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-red-500 text-white">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Uploaded At</th>
                  <th>Role</th>
                  <th>Approve</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {unapprovedFaculty.map((faculty) => (
                  <tr key={faculty._id} className="hover:bg-red-50">
                    <td className="font-medium">{faculty.name}</td>
                    <td>{faculty.email}</td>
                    <td>
                      {new Date(
                        faculty.uploatedTime
                      ).toLocaleDateString()}
                    </td>
                    <td className="capitalize">{faculty.role}</td>
                    <td>
                      <button
                        onClick={() => handleApprove(faculty._id)}
                        className="btn btn-sm bg-green-600 text-white hover:bg-green-700"
                      >
                        Approve
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(faculty._id)}
                        className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 🟢 Approved Faculty */}
      {approvedFaculty.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-green-700 mb-6">
            Approved Faculty
          </h2>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Uploaded At</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {approvedFaculty.map((faculty) => (
                  <tr key={faculty._id} className="hover:bg-green-50">
                    <td className="font-medium">{faculty.name}</td>
                    <td>{faculty.email}</td>
                    <td>
                      {new Date(
                        faculty.uploatedTime
                      ).toLocaleDateString()}
                    </td>
                    <td className="capitalize">{faculty.role}</td>
                    <td>
                      <button
                        onClick={() => handleUnApprove(faculty._id)}
                        className="btn btn-sm bg-yellow-500 text-white hover:bg-yellow-600"
                      >
                        Unapprove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Faculty;

Faculty.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
