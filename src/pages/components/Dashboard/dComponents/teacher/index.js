import React, { useEffect, useState } from "react";
import DashboardLayout from "../../DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  approveTeacher,
  deleteTeacher,
  fetchTeacherData,
  unapproveTeacher,
} from "../../../../../../Redux/api/teacher";
import { FaTrash } from "react-icons/fa";

const Teacher = () => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const { teachers, loading, error } = useSelector((state) => state.teacher);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  useEffect(() => {
    dispatch(fetchTeacherData());
  }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(approveTeacher(id));
    dispatch(fetchTeacherData());
  };

  const handleUnApprove = (id) => {
    dispatch(unapproveTeacher(id));
    dispatch(fetchTeacherData());
  };

  const handleDelete = (id) => {
    dispatch(deleteTeacher(id));
    dispatch(fetchTeacherData());
  };

  /* ---------- STATES ---------- */
  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg text-green-600"></span>
      </div>
    );
  }

  if (error) return <p className="text-red-500 text-center">{error}</p>;

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

  const unapprovedTeachers = teachers.filter((t) => !t.isApprove);
  const approvedTeachers = teachers.filter((t) => t.isApprove === true);

  return (
    <div className="p-6 md:p-10 space-y-16">
      {/* 🔴 Pending Teachers */}
      {unapprovedTeachers.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-6">
            Pending Teacher Approvals
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
                {unapprovedTeachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-red-50">
                    <td className="font-medium">{teacher.name}</td>
                    <td>{teacher.email}</td>
                    <td>
                      {new Date(
                        teacher.uploatedTime
                      ).toLocaleDateString()}
                    </td>
                    <td className="capitalize">{teacher.role}</td>
                    <td>
                      <button
                        onClick={() => handleApprove(teacher._id)}
                        className="btn btn-sm bg-green-600 text-white hover:bg-green-700"
                      >
                        Approve
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(teacher._id)}
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

      {/* 🟢 Approved Teachers */}
      {approvedTeachers.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-green-700 mb-6">
            Approved Teachers
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
                {approvedTeachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-green-50">
                    <td className="font-medium">{teacher.name}</td>
                    <td>{teacher.email}</td>
                    <td>
                      {new Date(
                        teacher.uploatedTime
                      ).toLocaleDateString()}
                    </td>
                    <td className="capitalize">{teacher.role}</td>
                    <td>
                      <button
                        onClick={() => handleUnApprove(teacher._id)}
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

export default Teacher;

Teacher.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
