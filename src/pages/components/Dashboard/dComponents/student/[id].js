"use client";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../../DashboardLayout";
import ReactModal from "react-modal";

import ResultSection from "./result";
import DuePaymentsSection from "./duePayment";
import PaidPaymentsSection from "./paidPayment";
import AttendanceSummary from "@/pages/components/AttendanceSummary";

const PASS_PERCENT = 33;

const isPass = (obtained, full) =>
  (Number(obtained) / Number(full)) * 100 >= PASS_PERCENT;

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

  // ⭐ NEW FILTER STATES
  const [examFilter, setExamFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [passFilter, setPassFilter] = useState("");

  const resetFilter = () => {
    setExamFilter("");
    setYearFilter("");
    setSubjectFilter("");
    setPassFilter("");
  };

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

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setAmount(0);
    setAmountType("");
    setError("");
  };

  const handleOpenResultModal = () => setShowResultModal(true);
  const handleCloseResultModal = () => {
    setShowResultModal(false);
    setError("");
  };

  const handleDueModalOpen = () => setShowDueModal(true);
  const handleDueModalClose = () => {
    setShowDueModal(false);
    setAmount(0);
    setAmountType("");
    setError("");
  };

  const handleAddAmount = async (studentId) => {
    setError("");
    const addedBy = { name: user.name, email: user.email };

    try {
      const response = await fetch(
        `https://pomkara-high-school-server.vercel.app/students/addAmount/${studentId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, amountType, addedBy }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error);
        throw new Error(data.error);
      }

      const updatedStudentResponse = await fetch(
        `https://pomkara-high-school-server.vercel.app/students/${id}`
      );
      const updatedStudent = await updatedStudentResponse.json();
      setStudent(updatedStudent);
      handleDueModalClose();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCutAmount = async (studentId) => {
    setError("");
    const cutedBy = { name: user.name, email: user.email };

    try {
      const response = await fetch(
        `https://pomkara-high-school-server.vercel.app/students/cutAmount/${studentId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, amountType, cutedBy }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error);
        throw new Error(data.error);
      }

      const updatedStudentResponse = await fetch(
        `https://pomkara-high-school-server.vercel.app/students/${id}`
      );

      const updatedStudent = await updatedStudentResponse.json();
      setStudent(updatedStudent);
      handleCloseModal();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleResult = async (studentId) => {
    setError("");
    setLoading(true);
    setSuccess("");
    const addedBy = { name: user.name, email: user.email };

    try {
      const response = await fetch(
        `https://pomkara-high-school-server.vercel.app/students/addResult/${studentId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ examType, subject, result, mark, addedBy }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setLoading(false);
        setError(data.error);
        throw new Error(data.error);
      }

      const updatedStudentResponse = await fetch(
        `https://pomkara-high-school-server.vercel.app/students/${id}`
      );

      const updatedStudent = await updatedStudentResponse.json();
      setStudent(updatedStudent);
      setLoading(false);
      setSuccess("Result added successfully");
    } catch {
      setLoading(false);
      setSuccess("");
    }
  };

  const calculateDueTotal = (payments) =>
    payments.reduce((acc, payment) => acc + Number(payment.amount), 0);

  const calculatePaidTotal = (payments) =>
    payments.reduce((acc, payment) => acc + Number(payment.amount), 0);

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
          const res = await fetch(
            `https://pomkara-high-school-server.vercel.app/students/${id}`
          );
          const data = await res.json();
          setStudent(data);
        } catch {}
      };
      fetchStudent();
    }
  }, [id]);

  // ⭐⭐⭐ FILTERED RESULTS ⭐⭐⭐
  const filteredResults = useMemo(() => {
    return student?.result
      ?.slice()
      .reverse()
      .filter(
        (r) =>
          (!examFilter || r.examType === examFilter) &&
          (!yearFilter ||
            new Date(r.date).getFullYear().toString() === yearFilter) &&
          (!subjectFilter || r.subject === subjectFilter) &&
          (!passFilter ||
            (passFilter === "pass" && isPass(r.result, r.mark)) ||
            (passFilter === "fail" && !isPass(r.result, r.mark)))
      );
  }, [student, examFilter, yearFilter, subjectFilter, passFilter]);

  if (!student)
    return (
      <div className="mt-5 text-center">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );

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

      <AttendanceSummary attendance={student?.attendance || []} />

      {/* ================= RESULT TABLE (WITH FILTER) ================= */}
      <ResultSection results={student?.result || []} />
      {/* Due Payments */}
      <DuePaymentsSection payments={reversedDuePayments} />

      {/* Paid Payments */}

      <PaidPaymentsSection payments={reversedPaidPayments} />

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
          <option value="admission_fee">Admission Fee</option>
          <option value="tuition_fee">Tuition / Monthly Fee</option>
          <option value="exam_fee">Exam Fee</option>
          <option value="registration_fee">Registration Fee</option>
          <option value="library_fee">Library Fee</option>
          <option value="transport_fee">Transport / Bus Fee</option>
          <option value="hostel_fee">Hostel Fee</option>
          <option value="lab_fee">Laboratory Fee</option>
          <option value="sports_fee">Sports Fee</option>
          <option value="computer_fee">Computer Fee</option>
          <option value="activity_fee">Co-curricular / Activity Fee</option>
          <option value="id_card_fee">ID Card / Replacement Fee</option>
          <option value="certificate_fee">Certificate Fee</option>
          <option value="uniform_fee">Uniform Fee</option>
          <option value="book_fee">Books & Stationery</option>
          <option value="maintenance_fee">Maintenance / Development Fee</option>
          <option value="late_fee">Late Fee</option>
          <option value="fine">Fine / Penalty</option>
          <option value="others">Others</option>
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

          <option value="admission_fee">Admission Fee</option>
          <option value="tuition_fee">Tuition / Monthly Fee</option>
          <option value="exam_fee">Exam Fee</option>
          <option value="registration_fee">Registration Fee</option>
          <option value="library_fee">Library Fee</option>
          <option value="transport_fee">Transport / Bus Fee</option>
          <option value="hostel_fee">Hostel Fee</option>
          <option value="lab_fee">Laboratory Fee</option>
          <option value="sports_fee">Sports Fee</option>
          <option value="computer_fee">Computer Fee</option>
          <option value="activity_fee">Co-curricular / Activity Fee</option>
          <option value="id_card_fee">ID Card / Replacement Fee</option>
          <option value="certificate_fee">Certificate Fee</option>
          <option value="uniform_fee">Uniform Fee</option>
          <option value="book_fee">Books & Stationery</option>
          <option value="maintenance_fee">Maintenance / Development Fee</option>
          <option value="late_fee">Late Fee</option>
          <option value="fine">Fine / Penalty</option>
          <option value="others">Others</option>
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

        {/* Exam Type Dropdown */}
        <select
          className="select select-bordered bg-white text-black w-full mb-2"
          onChange={(e) => setExamType(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Select Exam Type
          </option>
          <option value="monthly">Monthly Test</option>
          <option value="terminal">Terminal Exam</option>
          <option value="midterm">Mid Term</option>
          <option value="final">Final Exam</option>
          <option value="retest">Re-test</option>
        </select>

        {/* Subject Dropdown */}
        <select
          className="select select-bordered bg-white text-black w-full mb-2"
          onChange={(e) => setSubject(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Select Subject
          </option>

          {/* Class 6–8 (Common) */}
          <optgroup label="Class 6–8">
            <option value="bangla">Bangla</option>
            <option value="english">English</option>
            <option value="math">Mathematics</option>
            <option value="science">General Science</option>
            <option value="social_science">Social Science</option>
            <option value="religion">Religion Studies</option>
            <option value="bangladesh_studies">
              Bangladesh & Global Studies
            </option>
            <option value="ict">ICT</option>
            <option value="agriculture">Agriculture</option>
            <option value="home_science">Home Science</option>
            <option value="drawing">Drawing</option>
            <option value="physical_education">Physical Education</option>
          </optgroup>

          {/* Class 9–10 : Science */}
          <optgroup label="Class 9–10 — Science">
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="biology">Biology</option>
            <option value="higher_math">Higher Mathematics</option>
            <option value="general_math">General Mathematics</option>
            <option value="ict_9_10">ICT</option>
            <option value="bangla_9_10">Bangla</option>
            <option value="english_9_10">English</option>
            <option value="bangladesh_global">
              Bangladesh & Global Studies
            </option>
            <option value="religion_9_10">Religion Studies</option>
            <option value="physical_education_9_10">Physical Education</option>
          </optgroup>

          {/* Class 9–10 : Commerce */}
          <optgroup label="Class 9–10 — Commerce">
            <option value="accounting">Accounting</option>
            <option value="business_entrepreneurship">
              Business Entrepreneurship
            </option>
            <option value="finance_banking">Finance & Banking</option>
            <option value="general_math_commerce">General Mathematics</option>
            <option value="ict_commerce">ICT</option>
            <option value="bangla_commerce">Bangla</option>
            <option value="english_commerce">English</option>
            <option value="bangladesh_global_commerce">
              Bangladesh & Global Studies
            </option>
            <option value="religion_commerce">Religion Studies</option>
          </optgroup>

          {/* Class 9–10 : Arts */}
          <optgroup label="Class 9–10 — Arts">
            <option value="civics">Civics</option>
            <option value="geography">Geography & Environment</option>
            <option value="history">
              History of Bangladesh & World Civilization
            </option>
            <option value="economics">Economics</option>
            <option value="agriculture_arts">Agriculture</option>
            <option value="ict_arts">ICT</option>
            <option value="bangla_arts">Bangla</option>
            <option value="english_arts">English</option>
            <option value="religion_arts">Religion Studies</option>
          </optgroup>

          <option value="others">Others</option>
        </select>

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
