import React, { useEffect, useState } from "react";
import DashboardLayout from "../../DashboardLayout";
import { useForm } from "react-hook-form";
import { FaArrowAltCircleUp, FaPen, FaTrash } from "react-icons/fa";
import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Function to fetch students based on the targeted class
const fetchStudents = async ({ queryKey }) => {
  const [_key, targeted_class] = queryKey;

  const response = await fetch(
    `https://pomkara-high-school-server.vercel.app/students?targeted_class=${targeted_class}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  return response.json();
};

// Function to delete a student by ID
const deleteStudent = async (studentId) => {
  const response = await fetch(
    `https://pomkara-high-school-server.vercel.app/students/${studentId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete student");
  }

  return response.json();
};

const Student = () => {
  const { register } = useForm();
  const [selectedClass, setSelectedClass] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState("class_role"); // Default sorting by class_role
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClassRole, setNewClassRole] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const [user, setUser] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    }
  }, []);

  // Use React Query to fetch students
  const {
    data: students,
    isLoading,
  } = useQuery({
    queryKey: ["students", selectedClass],
    queryFn: fetchStudents,
    enabled: !!selectedClass, // Fetch only if a class is selected
  });

  // Use React Query's useMutation for deleting a student
  const mutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      // Invalidate and refetch the students query to reflect the changes
      queryClient.invalidateQueries(["students", selectedClass]);
    },
  });

  const handleUpdateClick = (studentId) => {
    router.push(`/components/Dashboard/dComponents/student/${studentId}`);
  };

  const handleDelete = (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      mutation.mutate(studentId);
    }
  };

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const handleSort = (newSortBy) => {
    setSortBy(newSortBy);
  };

  // Sort students based on the selected sorting criteria
  const sortedStudents = students
    ? students.sort((a, b) => {
        if (sortBy === "class_role") {
          return a.class_role - b.class_role; // Ascending order by class role
        } else if (sortBy === "due_payment") {
          // Calculate total due payment for each student
          const studentATotalDue = a.due_payment.reduce((acc, curr) => {
            const amount = parseFloat(curr.amount) || 0;
            return acc + amount;
          }, 0);

          const studentBTotalDue = b.due_payment.reduce((acc, curr) => {
            const amount = parseFloat(curr.amount) || 0;
            return acc + amount;
          }, 0);

          return studentBTotalDue - studentATotalDue; // Descending order by due payment
        }
      })
    : [];

  const handlePushStudent = (studentId) => {
    setSelectedStudentId(studentId);
    setIsModalOpen(true); // Open the modal when the button is clicked
  };

  const confirmPromotion = async () => {
    const student = sortedStudents.find((s) => s._id === selectedStudentId);

    if (student) {
      const totalDuePayment =
        student.due_payment.reduce((acc, curr) => {
          const amount = parseFloat(curr.amount) || 0;
          return acc + amount;
        }, 0) -
        student.paid_payment.reduce((acc, curr) => {
          const amount = parseFloat(curr.amount) || 0;
          return acc + amount;
        }, 0);

      try {
        const response = await fetch(
          `https://pomkara-high-school-server.vercel.app/students/promote/${selectedStudentId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              totalDuePayment,
              newClassRole, // Send the new class role to the backend
            }),
          }
        );

        if (response.ok) {
          queryClient.invalidateQueries(["students", selectedClass]);
        } else {
          console.error("Failed to promote student");
        }
      } catch (error) {
        console.error("Error promoting student:", error);
      }
    }

    setIsModalOpen(false); // Close the modal after promotion
    setNewClassRole(""); // Reset the class role state
  };

  const totalDueOnThisClass = sortedStudents
    ?.reduce((studentAcc, student) => {
      const studentTotal = student.due_payment
        .filter((payment) => payment.isPaid === false) // Filter only unpaid dues
        .reduce((paymentAcc, payment) => {
          const amount = parseFloat(payment.amount) || 0;
          return paymentAcc + amount;
        }, 0);

      return studentAcc + studentTotal;
    }, 0)
    .toFixed(2);

  // //console.log(total);

  const totalPaidOnThisClass = sortedStudents
    ?.reduce((studentAcc, student) => {
      const studentTotal = student.paid_payment.reduce(
        (paymentAcc, payment) => {
          const amount = parseFloat(payment.amount) || 0;
          return paymentAcc + amount;
        },
        0
      );

      return studentAcc + studentTotal;
    }, 0)
    .toFixed(2);

  if (
    !["teacher", "principle", "faculty"].includes(user?.role) ||
    user?.isApprove == false
  ) {
    return (
      <div className="text-center mt-4 text-2xl text-red-500 font-serif">
        Please login first to see this section
      </div>
    );
  }

  return (
    <div>
      <div>
        <select
          className="input input-bordered border-green-500 mb-5 w-full mt-3 bg-white text-black"
          required
          {...register("targeted_class")}
          onChange={handleClassChange}
        >
          <option disabled selected value={""} className="w-full">
            Select your targeted class
          </option>
          <option value={"6"}>Six</option>
          <option value={"7"}>Seven</option>
          <option value={"8"}>Eight</option>
          <option value={"9"}>Nine</option>
          <option value={"10"}>Ten</option>
          <option value={"exam batch"}>Exam Batch</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center">
          <span className="loading loading-ring loading-xs"></span>
          <span className="loading loading-ring loading-sm"></span>
          <span className="loading loading-ring loading-md"></span>
          <span className="loading loading-ring loading-lg"></span>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-bold mt-5">Students List</h2>

          <div className="text-xl my-2">
            Due first
            <input
              type="checkbox"
              className="w-4 h-4 ml-2"
              checked={sortBy === "due_payment"}
              onChange={() =>
                handleSort(
                  sortBy === "due_payment" ? "class_role" : "due_payment"
                )
              }
            />
          </div>

          {sortedStudents && sortedStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <div>
                <h2 className="text-xl font-serif font-bold">
                  Total Due of this class :{" "}
                  {totalDueOnThisClass - totalPaidOnThisClass}
                </h2>
                <h2 className="text-xl font-serif font-bold">
                  Total Paid from this class : {totalPaidOnThisClass}
                </h2>
              </div>
              <table className="table-auto w-full border-collapse border border-green-500">
                <thead>
                  <tr className="bg-green-500 text-white">
                    <th className="border border-green-500 px-4 py-2">Name</th>
                    <th className="border border-green-500 px-4 py-2">
                      Class Role
                    </th>
                    <th className="border border-green-500 px-4 py-2">
                      Due Payment
                    </th>
                    <th className="border border-green-500 px-4 py-2">
                      Details
                    </th>
                    <th className="border border-green-500 px-4 py-2">Push</th>
                    <th className="border border-green-500 px-4 py-2">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-green-100">
                      <td className="border border-green-500 px-1 py-2 text-center">
                        {student.name}
                      </td>
                      <td className="border border-green-500 px-1 py-2 text-center">
                        {student.class_role}
                      </td>
                      <td className="border border-green-500 px-1 py-2 text-center">
                        {(
                          student.due_payment.reduce((acc, curr) => {
                            const amount = parseFloat(curr.amount) || 0;
                            return acc + amount;
                          }, 0) -
                          student.paid_payment.reduce((acc, curr) => {
                            const amount = parseFloat(curr.amount) || 0;
                            return acc + amount;
                          }, 0)
                        ).toFixed(2)}
                      </td>
                      <td className="border border-green-500 px-1 py-2 text-center text-green-600">
                        <button
                          onClick={() => handleUpdateClick(student._id)}
                          className="btn btn-outline text-green-500 px-5"
                        >
                          <FaPen />
                        </button>
                      </td>
                      {["teacher", "principle"].includes(user?.role) && (
                        <>
                          <td className="border border-green-500 px-1 py-2 text-center text-green-600">
                            <button
                              onClick={() => handlePushStudent(student._id)}
                              className="btn btn-outline text-green-500 px-5"
                            >
                              <FaArrowAltCircleUp />
                            </button>

                            {/* Modal */}
                            {isModalOpen && (
                              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="bg-white p-6 rounded-md shadow-lg">
                                  <h3 className="text-lg font-semibold mb-4">
                                    Enter New Class Role
                                  </h3>
                                  <input
                                    type="text"
                                    value={newClassRole}
                                    onChange={(e) =>
                                      setNewClassRole(e.target.value)
                                    }
                                    placeholder="New Class Role"
                                    className="border border-gray-300 p-2 w-full mb-4"
                                  />
                                  <div className="flex justify-end">
                                    <button
                                      onClick={() => setIsModalOpen(false)}
                                      className="bg-gray-300 px-4 py-2 rounded-md mr-2"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={confirmPromotion}
                                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                    >
                                      Confirm
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </td>
                        </>
                      )}
                      {["teacher", "principle"].includes(user?.role) && (
                        <>
                          <td className="border border-green-500 px-1 py-2 text-center text-green-600">
                            <button
                              onClick={() => handleDelete(student._id)}
                              className="btn btn-outline text-green-500 px-5"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No students found for this class.</p>
          )}
        </div>
      )}
    </div>
  );
};

// ... rest of the code
// ... rest of the code

export default Student;

Student.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
