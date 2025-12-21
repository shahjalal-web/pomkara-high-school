import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashboardLayout from "../../DashboardLayout";
import ReactModal from "react-modal";

const StudentDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showDueModal, setShowDueModal] = useState(false);
  const [amount, setAmount] = useState(0);
  const [amountType, setAmountType] = useState("");
  const [examType, setExamType] = useState("");
  const [subject, setSubject] = useState("");
  const [result, setResult] = useState(0);
  const [mark, setFullMark] = useState(0);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    }
  }, []);

  const all_due_payment = student?.due_payment;
  const reversedDuePayments =
    all_due_payment?.length > 0 ? all_due_payment.slice().reverse() : [];

  const all_paid_payment = student?.paid_payment;
  const reversedPaidPayments =
    all_paid_payment?.length > 0 ? all_paid_payment.slice().reverse() : [];

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setAmount(0); // Reset amount after closing modal
    setAmountType("");
    setError(""); // Reset error after closing modal
  };

  const handleOpenResultModal = () => {
    setShowResultModal(true);
  };

  const handleCloseResultModal = () => {
    setShowResultModal(false);
    setAmount(0); // Reset amount after closing modal
    setAmountType("");
    setError(""); // Reset error after closing modal
  };

  const handleDueModalOpen = () => {
    setShowDueModal(true);
  };

  const handleDueModalClose = () => {
    setShowDueModal(false);
    setAmount(0); // Reset amount after closing modal
    setAmountType("");
    setError(""); // Reset error after closing modal
  };

  const handleAddAmount = async (studentId) => {
    setError("");
    const addedBy = {
      name: user.name,
      email: user.email,
    };

    try {
      const response = await fetch(
        `https://pomkara-high-school-server.vercel.app/students/addAmount/${studentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount, amountType, addedBy }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error);
        throw new Error(data.error);
      }

      // Re-fetch student data after successful addition
      const updatedStudentResponse = await fetch(
        `https://pomkara-high-school-server.vercel.app/students/${id}`
      );
      if (!updatedStudentResponse.ok) {
        throw new Error("Failed to fetch updated student details");
      }
      const updatedStudent = await updatedStudentResponse.json();
      setStudent(updatedStudent);

      //console.log("Amount added successfully:", updatedStudent);
      handleDueModalClose();
    } catch (error) {
      setError(error.message);
      console.error("Error adding amount:", error);
    }
  };

  const handleCutAmount = async (studentId) => {
    setError("");
    const cutedBy = {
      name: user.name,
      email: user.email,
    };

    try {
      const response = await fetch(
        `https://pomkara-high-school-server.vercel.app/students/cutAmount/${studentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount, amountType, cutedBy }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error);
        throw new Error(data.error);
      }

      // Re-fetch student data after successful addition
      const updatedStudentResponse = await fetch(
        `https://pomkara-high-school-server.vercel.app/students/${id}`
      );
      if (!updatedStudentResponse.ok) {
        throw new Error("Failed to fetch updated student details");
      }
      const updatedStudent = await updatedStudentResponse.json();
      setStudent(updatedStudent);

      //console.log("Amount cuted successfully:", updatedStudent);
      handleCloseModal();
    } catch (error) {
      setError(error.message);
      console.error("Error adding amount:", error);
    }
  };

  const handleResult = async (studentId) => {
    setError("");
    setLoading(true);
    setSuccess("");
    const addedBy = {
      name: user.name,
      email: user.email,
    };

    try {
      const response = await fetch(
        `https://pomkara-high-school-server.vercel.app/students/addResult/${studentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ examType, subject, result, mark, addedBy }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        setLoading(false);
        setError(data.error);
        throw new Error(data.error);
      }

      // Re-fetch student data after successful addition
      const updatedStudentResponse = await fetch(
        `https://pomkara-high-school-server.vercel.app/students/${id}`
      );
      if (!updatedStudentResponse.ok) {
        setLoading(false);
        throw new Error("Failed to fetch updated student details");
      }
      const updatedStudent = await updatedStudentResponse.json();
      setStudent(updatedStudent);
      setLoading(false);
      setSuccess("Result added successfully");
      //console.log("Result added successfully:", updatedStudent);
    } catch (err) {
      setLoading(false);
      setSuccess("");
      //console.log("error", err);
    }
  };

  const calculateDueTotal = (payments) => {
    return payments.reduce((acc, payment) => acc + Number(payment.amount), 0);
  };

  const calculatePaidTotal = (payments) => {
    return payments.reduce((acc, payment) => acc + Number(payment.amount), 0);
  };

  const totalDueAmount = student?.due_payment
    ? calculateDueTotal(student.due_payment)
    : 0;

  const totalPaidAmount = student?.paid_payment
    ? calculatePaidTotal(student.paid_payment)
    : 0;

  const totalAmount = totalDueAmount - totalPaidAmount;

  useEffect(() => {
    if (id) {
      const fetchStudent = async () => {
        try {
          const response = await fetch(
            `https://pomkara-high-school-server.vercel.app/students/${id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch student details");
          }
          const data = await response.json();
          setStudent(data);
        } catch (error) {
          console.error("Error fetching student details:", error);
        }
      };

      fetchStudent();
    }
  }, [id]);

  if (!student) {
    return (
      <div className="mt-5 text-center">
        <span className="loading loading-spinner text-primary"></span>
        <span className="loading loading-spinner text-secondary"></span>
        <span className="loading loading-spinner text-accent"></span>
        <span className="loading loading-spinner text-neutral"></span>
        <span className="loading loading-spinner text-info"></span>
        <span className="loading loading-spinner text-success"></span>
        <span className="loading loading-spinner text-warning"></span>
        <span className="loading loading-spinner text-error"></span>
      </div>
    );
  }

  if (!["teacher", "principle", "faculty"].includes(user?.role)) {
    return (
      <div className="text-center mt-4 text-2xl text-red-500 font-serif">
        Please login first to see this section
      </div>
    );
  }

  return (
    <div className="space-y-10 p-4 md:p-8">
      {/* ================= Student Card ================= */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
          Student Profile
        </h1>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <p>
            <b>Name:</b> {student.name}
          </p>
          <p>
            <b>Phone:</b> {student.number}
          </p>
          <p>
            <b>Class:</b> {student.class}
          </p>
          <p>
            <b>Class Roll:</b> {student.class_role}
          </p>
          <p>
            <b>Father:</b> {student.fathers_name}
          </p>
          <p>
            <b>Father Phone:</b> {student.fathers_number}
          </p>
          <p>
            <b>Mother:</b> {student.mothers_name}
          </p>
          <p>
            <b>Mother Phone:</b> {student.mothers_number}
          </p>
          <p className="text-red-500 font-bold">
            Total Due: {totalAmount} Taka
          </p>
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        {["teacher", "principle"].includes(user?.role) && (
          <div className="mt-6 grid md:grid-cols-3 gap-3">
            <button
              className="btn bg-blue-500 text-white"
              onClick={() =>
                router.push(
                  `/components/Dashboard/dComponents/student/update/${student._id}`
                )
              }
            >
              Update Student Info
            </button>

            <button
              className="btn bg-green-600 text-white"
              onClick={handleDueModalOpen}
            >
              ➕ Add Due Payment
            </button>

            {totalAmount > 0 && (
              <button
                className="btn bg-yellow-500 text-white"
                onClick={handleOpenModal}
              >
                💰 Receive Payment (Paid)
              </button>
            )}
          </div>
        )}
      </div>

      {/* ================= ADD RESULT ================= */}
      {["teacher", "principle"].includes(user?.role) && (
        <div className="max-w-xl mx-auto">
          <button
            className="btn w-full bg-indigo-600 text-white"
            onClick={handleOpenResultModal}
          >
            📘 Add Exam Result
          </button>
        </div>
      )}

      {/* ================= DUE PAYMENT TABLE ================= */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md p-4">
        <h2 className="text-xl font-bold text-red-500 mb-3">
          Due Payment Details
        </h2>
        <table className="table w-full">
          <thead className="bg-green-500 text-white">
            <tr>
              <th>Amount</th>
              <th>For</th>
              <th>Added By</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reversedDuePayments
              .filter((p) => !p.isPaid)
              .map((p, i) => (
                <tr key={i}>
                  <td>{p.amount}</td>
                  <td>{p.amountType}</td>
                  <td>{p.addedBy?.name}</td>
                  <td>{new Date(p.date).toLocaleDateString()}</td>
                  <td className="text-yellow-500 font-bold">Due</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAID PAYMENT TABLE ================= */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md p-4">
        <h2 className="text-xl font-bold text-green-500 mb-3">
          Paid Payment History
        </h2>
        <table className="table w-full">
          <thead className="bg-green-600 text-white">
            <tr>
              <th>Date</th>
              <th>For</th>
              <th>Amount</th>
              <th>Accepted By</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reversedPaidPayments
              .filter((p) => p.isPaid)
              .map((p, i) => (
                <tr key={i}>
                  <td>{new Date(p.date).toLocaleDateString()}</td>
                  <td>{p.amountType}</td>
                  <td>{p.amount}</td>
                  <td>{p.addedBy?.name}</td>
                  <td className="text-green-500 font-bold">Paid</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ================= RESULT TABLE ================= */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md p-4">
        <h2 className="text-xl font-bold text-indigo-600 mb-3">Exam Results</h2>
        <table className="table w-full">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th>Exam</th>
              <th>Subject</th>
              <th>Marks</th>
              <th>Date</th>
              <th>Uploaded By</th>
            </tr>
          </thead>
          <tbody>
            {student?.result
              ?.slice()
              .reverse()
              .map((r, i) => (
                <tr key={i}>
                  <td>{r.examType}</td>
                  <td>{r.subject}</td>
                  <td>
                    {r.result} / {r.mark}
                  </td>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                  <td>{r.addedBy?.name}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ================= ADD DUE MODAL ================= */}
      <ReactModal
        isOpen={showDueModal}
        onRequestClose={handleDueModalClose}
        className="max-w-md mx-auto mt-40 bg-white p-6 rounded-xl shadow-2xl"
        overlayClassName="fixed inset-0 bg-black/50 z-50"
      >
        <h2 className="text-xl font-bold mb-4 text-green-600">
          Add Due Payment
        </h2>

        <select
          className="select select-bordered bg-white text-black w-full mb-3"
          onChange={(e) => setAmountType(e.target.value)}
        >
          <option disabled selected>
            Select Fee Type
          </option>
          <option value="monthly_fee">Monthly Fee</option>
          <option value="exam_fee">Exam Fee</option>
          <option value="session_fee">Session Fee</option>
          <option value="fine">Fine</option>
        </select>

        <input
          type="number"
          placeholder="Enter amount"
          className="input input-bordered bg-white text-black w-full mb-3"
          onChange={(e) => setAmount(e.target.value)}
        />

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="flex justify-end gap-2">
          <button className="btn" onClick={handleDueModalClose}>
            Cancel
          </button>
          <button
            className="btn bg-green-600 text-white"
            onClick={() => handleAddAmount(student._id)}
          >
            Add Due
          </button>
        </div>
      </ReactModal>

      {/* ================= RECEIVE PAYMENT MODAL ================= */}
      <ReactModal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        className="max-w-md mx-auto mt-40 bg-white p-6 rounded-xl shadow-2xl"
        overlayClassName="fixed inset-0 bg-black/50 z-50"
      >
        <h2 className="text-xl font-bold mb-4 text-yellow-600">
          Receive Payment
        </h2>

        <select
          className="select select-bordered bg-white text-black w-full mb-3"
          onChange={(e) => setAmountType(e.target.value)}
        >
          <option disabled selected>
            Select Payment Type
          </option>
          <option value="monthly_fee">Monthly Fee</option>
          <option value="exam_fee">Exam Fee</option>
          <option value="fine">Fine</option>
        </select>

        <input
          type="number"
          placeholder="Paid amount"
          className="input input-bordered bg-white text-black w-full mb-3"
          onChange={(e) => setAmount(e.target.value)}
        />

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="flex justify-end gap-2">
          <button className="btn" onClick={handleCloseModal}>
            Cancel
          </button>
          <button
            className="btn bg-yellow-500 text-white"
            onClick={() => handleCutAmount(student._id)}
          >
            Confirm Payment
          </button>
        </div>
      </ReactModal>

      {/* ================= ADD RESULT MODAL ================= */}
      <ReactModal
        isOpen={showResultModal}
        onRequestClose={handleCloseResultModal}
        className="max-w-lg mx-auto mt-20 bg-white p-6 rounded-xl shadow-2xl"
        overlayClassName="fixed inset-0 bg-black/50 z-50"
      >
        <h2 className="text-xl font-bold mb-4 text-indigo-600">
          Add Exam Result
        </h2>

        <input
          className="input input-bordered bg-white text-black w-full mb-2"
          placeholder="Exam Type"
          onChange={(e) => setExamType(e.target.value)}
        />

        <input
          className="input input-bordered bg-white text-black w-full mb-2"
          placeholder="Subject"
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          type="number"
          className="input input-bordered bg-white text-black w-full mb-2"
          placeholder="Obtained Marks"
          onChange={(e) => setResult(e.target.value)}
        />

        <input
          type="number"
          className="input input-bordered bg-white text-black w-full mb-4"
          placeholder="Full Marks"
          onChange={(e) => setFullMark(e.target.value)}
        />

        {success && <p className="text-green-600 mb-2">{success}</p>}
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="flex justify-end gap-2">
          <button className="btn" onClick={handleCloseResultModal}>
            Cancel
          </button>
          <button
            className="btn bg-indigo-600 text-white"
            onClick={() => handleResult(student._id)}
          >
            {loading ? "Saving..." : "Add Result"}
          </button>
        </div>
      </ReactModal>
    </div>
  );
};

export default StudentDetails;

StudentDetails.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
