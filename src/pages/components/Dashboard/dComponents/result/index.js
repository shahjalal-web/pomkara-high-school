"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../DashboardLayout";

const BASE_SUBJECTS = [
  { key: "bangla_1st", label: "বাংলা ১ম" },
  { key: "bangla_2nd", label: "বাংলা ২য়" },
  { key: "english_1st", label: "English 1st" },
  { key: "english_2nd", label: "English 2nd" },
  { key: "math", label: "Math" },
  { key: "science", label: "Science" },
  { key: "bgs", label: "BGS" },
  { key: "religion", label: "Religion" },
  { key: "ict", label: "ICT" },
];

const GROUP_SUBJECTS = {
  science: [
    { key: "physics", label: "Physics" },
    { key: "chemistry", label: "Chemistry" },
    { key: "biology", label: "Biology" },
    { key: "higher_math", label: "Higher Math" },
  ],
  business: [
    { key: "accounting", label: "Accounting" },
    { key: "finance", label: "Finance & Banking" },
    { key: "business_entrepreneur", label: "Business Entrepreneurship" },
  ],
  humanities: [
    { key: "history", label: "History" },
    { key: "civics", label: "Civics" },
    { key: "economics", label: "Economics" },
    { key: "geography", label: "Geography" },
  ],
};

const EXAM_TYPES = ["weekly", "monthly", "half_yearly", "yearly", "test"];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKS = ["1st", "2nd", "3rd", "4th"];

function markToGPA(mark) {
  const m = Number(mark || 0);
  if (m >= 80) return { grade: "A+", gpa: 5.0 };
  if (m >= 70) return { grade: "A", gpa: 4.0 };
  if (m >= 60) return { grade: "A-", gpa: 3.5 };
  if (m >= 50) return { grade: "B", gpa: 3.0 };
  if (m >= 40) return { grade: "C", gpa: 2.0 };
  if (m >= 33) return { grade: "D", gpa: 1.0 };
  return { grade: "F", gpa: 0.0 };
}

function calcStudentGPA(studentMarkObj, subjectClosedMap, fullMark = 100) {
  if (!studentMarkObj) return { gpa: 0, grade: "F" };

  const subjects = Object.keys(studentMarkObj);
  if (!subjects.length) return { gpa: 0, grade: "F" };

  let totalGPA = 0;
  let count = 0;
  let hasFail = false;

  subjects.forEach((k) => {
    if (subjectClosedMap?.[k]) return;

    const row = studentMarkObj?.[k];
    const isAbsent = row?.absent;

    if (isAbsent) {
      hasFail = true;
      totalGPA += 0;
      count += 1;
      return;
    }

    const cq = Number(row?.cq || 0);
    const mcq = Number(row?.mcq || 0);
    if (cq === 0 && mcq === 0) return;

    const total = Number(row?.total || 0);

    // ✅ percent base on teacher entered mark
    const percent = fullMark ? (total / fullMark) * 100 : 0;

    const { gpa } = markToGPA(percent);
    if (gpa === 0) hasFail = true;

    totalGPA += gpa;
    count += 1;
  });

  if (hasFail) return { gpa: 0, grade: "F" };
  if (!count) return { gpa: 0, grade: "-" };

  const avg = totalGPA / count;

  let finalGrade = "F";
  if (avg === 5) finalGrade = "A+";
  else if (avg >= 4) finalGrade = "A";
  else if (avg >= 3.5) finalGrade = "A-";
  else if (avg >= 3) finalGrade = "B";
  else if (avg >= 2) finalGrade = "C";
  else if (avg >= 1) finalGrade = "D";

  return { gpa: Number(avg.toFixed(2)), grade: finalGrade };
}

const ResultsEntryPage = () => {
  const [className, setClassName] = useState("");
  const [examType, setExamType] = useState("");
  const [group, setGroup] = useState("");
  const [mark, setMark] = useState(100);

  // ✅ exam meta
  const [examYear, setExamYear] = useState("");
  const [examMonth, setExamMonth] = useState(""); // 01..12
  const [examWeek, setExamWeek] = useState(""); // 1st..4th

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [marks, setMarks] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [closedSubjects, setClosedSubjects] = useState({});

  const [addedBy, setAddedBy] = useState({ name: "", email: "" });

  useEffect(() => {
    try {
      const raw =
        localStorage.getItem("user") ||
        localStorage.getItem("authUser") ||
        localStorage.getItem("teacher");

      if (raw) {
        const u = JSON.parse(raw);
        setAddedBy({
          name: u?.name || u?.user?.name || "",
          email: u?.email || u?.user?.email || "",
        });
      }
    } catch (e) {}
  }, []);

  const isNineTen = className === "9" || className === "10";

  // ✅ requirements based on examType
  const requireYear =
    examType === "weekly" ||
    examType === "monthly" ||
    examType === "half_yearly" ||
    examType === "yearly";
  const requireMonth = examType === "weekly" || examType === "monthly";
  const requireWeek = examType === "weekly";

  // ✅ subject list
  const SUBJECTS = useMemo(() => {
    if (!isNineTen) return BASE_SUBJECTS;
    if (!group) return BASE_SUBJECTS;
    return [...BASE_SUBJECTS, ...(GROUP_SUBJECTS[group] || [])];
  }, [group, isNineTen]);

  // ✅ load requirements
  const canLoad =
    className &&
    examType &&
    (!isNineTen || group) &&
    (!requireYear || examYear) &&
    (!requireMonth || examMonth) &&
    (!requireWeek || examWeek);

  async function loadStudents() {
    if (!canLoad) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://pomkara-high-school-server.vercel.app/api/students_for_result?className=${className}`
      );

      const list = res.data.students || [];
      setStudents(list);

      const init = {};
      list.forEach((s) => {
        init[s._id] = {};
        SUBJECTS.forEach((sub) => {
          init[s._id][sub.key] = { cq: "", mcq: "", total: 0, absent: false };
        });
      });
      setMarks(init);

      const closeInit = {};
      SUBJECTS.forEach((sub) => (closeInit[sub.key] = false));
      setClosedSubjects(closeInit);
    } catch (err) {
      alert("Failed to load students");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
    // eslint-disable-next-line
  }, [className, examType, group, examYear, examMonth, examWeek]);

  const handleChange = (studentId, subjectKey, field, value) => {
    const prevSub = marks?.[studentId]?.[subjectKey];

    const cq = field === "cq" ? Number(value || 0) : Number(prevSub?.cq || 0);
    const mcq =
      field === "mcq" ? Number(value || 0) : Number(prevSub?.mcq || 0);

    const total = cq + mcq;

    setMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subjectKey]: {
          ...prev?.[studentId]?.[subjectKey],
          [field]: value,
          total,
        },
      },
    }));
  };

  const toggleAbsent = (studentId, subjectKey) => {
    setMarks((prev) => {
      const current = prev?.[studentId]?.[subjectKey];
      const newAbsent = !current?.absent;

      return {
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [subjectKey]: {
            ...current,
            absent: newAbsent,
            cq: newAbsent ? "" : current?.cq,
            mcq: newAbsent ? "" : current?.mcq,
            total: newAbsent ? 0 : Number(current?.total || 0),
          },
        },
      };
    });
  };

  const toggleSubjectClose = (subjectKey) => {
    setClosedSubjects((prev) => ({
      ...prev,
      [subjectKey]: !prev?.[subjectKey],
    }));
  };

  const handleSubmit = async () => {
    if (!canLoad) return alert("সব required field select করুন!");
    if (!students.length) return alert("No students found!");

    const data = students
      .map((s) => {
        const subjectResults = {};

        SUBJECTS.forEach((sub) => {
          if (closedSubjects?.[sub.key]) return;

          const subData = marks?.[s._id]?.[sub.key];
          const absent = Boolean(subData?.absent);

          const cq = absent ? 0 : Number(subData?.cq || 0);
          const mcq = absent ? 0 : Number(subData?.mcq || 0);
          const total = cq + mcq;

          if (!absent && cq === 0 && mcq === 0) return;

          subjectResults[sub.key] = { cq, mcq, total, absent };
        });

        if (!Object.keys(subjectResults).length) return null;
        return { studentId: s._id, results: subjectResults };
      })
      .filter(Boolean);

    if (!data.length)
      return alert("কোনো mark / absent দেওয়া হয়নি। Submit হবে না.");

    setSubmitting(true);
    try {
      await axios.post("https://pomkara-high-school-server.vercel.app/api/students/results/bulk", {
        examType,
        mark,
        group: isNineTen ? group : "",
        examYear: requireYear ? examYear : "",
        examMonth: requireMonth ? examMonth : "",
        examWeek: requireWeek ? examWeek : "",
        data,
        addedBy,
      });

      alert("✅ Result submitted successfully!");
    } catch (err) {
      alert("❌ Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto p-4 md:p-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Result Entry (Teacher Panel)
        </h1>

        {/* Controls */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-8 gap-3">
          <select
            className="border rounded-lg p-2 bg-white"
            value={className}
            onChange={(e) => {
              setClassName(e.target.value);
              setGroup("");
            }}
          >
            <option value="">Select Class</option>
            {["6", "7", "8", "9", "10"].map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>

          <select
            className="border rounded-lg p-2 ml-2 bg-white"
            value={examType}
            onChange={(e) => {
              setExamType(e.target.value);
              setExamYear("");
              setExamMonth("");
              setExamWeek("");
            }}
          >
            <option value="">Select Exam Type</option>
            {EXAM_TYPES.map((x) => (
              <option key={x} value={x}>
                {x.toUpperCase()}
              </option>
            ))}
          </select>

          {/* ✅ Exam Meta Fields */}
          <select
            className={`border rounded-lg p-2 ml-2 bg-white ${
              requireYear && !examYear ? "border-red-400" : ""
            }`}
            value={examYear}
            onChange={(e) => setExamYear(e.target.value)}
            disabled={!requireYear}
          >
            <option value="">{requireYear ? "Select Year *" : "Year"}</option>

            {Array.from(
              { length: 21 },
              (_, i) => new Date().getFullYear() + i
            ).map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>

          <select
            className={`border rounded-lg p-2 ml-2 bg-white ${
              requireMonth && !examMonth ? "border-red-400" : ""
            }`}
            value={examMonth}
            onChange={(e) => setExamMonth(e.target.value)}
            disabled={!requireMonth}
          >
            <option value="">
              {requireMonth ? "Select Month *" : "Month"}
            </option>
            {MONTHS.map((m, idx) => (
              <option key={m} value={String(idx + 1).padStart(2, "0")}>
                {m}
              </option>
            ))}
          </select>

          <select
            className={`border rounded-lg p-2 ml-2 bg-white ${
              requireWeek && !examWeek ? "border-red-400" : ""
            }`}
            value={examWeek}
            onChange={(e) => setExamWeek(e.target.value)}
            disabled={!requireWeek}
          >
            <option value="">{requireWeek ? "Select Week *" : "Week"}</option>
            {WEEKS.map((w) => (
              <option key={w} value={w}>
                {w} Week
              </option>
            ))}
          </select>

          {isNineTen ? (
            <select
              className="border rounded-lg p-2 ml-2 bg-white"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            >
              <option value="">Select Group</option>
              <option value="science">Science</option>
              <option value="business">Business</option>
              <option value="humanities">Humanities</option>
            </select>
          ) : (
            <div className="hidden md:block" />
          )}

          <input
            className="border rounded-lg p-2 ml-2 bg-white"
            type="number"
            value={mark}
            onChange={(e) => setMark(Number(e.target.value))}
            placeholder="Total Mark (e.g. 100)"
          />

          <button
            onClick={loadStudents}
            disabled={!canLoad || loading}
            className="rounded-lg p-2 ml-2 bg-black text-white disabled:bg-gray-400"
          >
            {loading ? "Loading..." : "Load Students"}
          </button>
        </div>

        {/* Info */}
        <div className="mt-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <p className="text-sm text-gray-600">
            Total Students: <b>{students.length}</b>
          </p>

          <button
            onClick={handleSubmit}
            disabled={submitting || !students.length || !canLoad}
            className="rounded-lg px-5 py-2 bg-green-600 text-white font-semibold disabled:bg-gray-400 w-full md:w-auto"
          >
            {submitting ? "Submitting..." : "Submit Result"}
          </button>
        </div>

        {/* ✅ Subject Close Controls */}
        {students.length > 0 && (
          <div className="mt-5 bg-white p-4 rounded-xl shadow">
            <p className="font-semibold text-gray-700 mb-3">
              ✅ Subject Close (Exam হয়নি)
            </p>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => toggleSubjectClose(s.key)}
                  className={`px-3 py-2 rounded-lg border text-sm font-semibold ${
                    closedSubjects?.[s.key]
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-gray-50 text-gray-700"
                  }`}
                >
                  {closedSubjects?.[s.key] ? "Closed" : "Open"} — {s.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Closed করা subject সব student এর জন্য disable হবে এবং submit এ
              যাবে না।
            </p>
          </div>
        )}

        {/* ✅ BOTH SCROLLING */}
        <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">
          <div className="h-[70vh] overflow-auto">
            <div className="min-w-[2100px]">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 sticky top-0 z-20">
                  <tr>
                    <th className="p-3 text-left border w-[80px] md:sticky left-0 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white z-30 shadow-md">
                      Roll
                    </th>

                    <th className="p-3 text-left border w-[240px] md:sticky left-[40px] bg-gradient-to-r from-indigo-500 to-indigo-400 text-white z-30 shadow-md">
                      Name
                    </th>

                    {SUBJECTS.map((s) => (
                      <th key={s.key} className="p-3 text-left border">
                        <div className="font-semibold">{s.label}</div>
                        <div className="text-xs text-gray-500">
                          CQ / MCQ / Total / Absent
                        </div>
                      </th>
                    ))}

                    <th className="p-3 text-left border w-[120px] md:sticky right-[70px] bg-gray-100 z-30">
                      GPA
                    </th>
                    <th className="p-3 text-left border w-[120px] md:sticky right-0 bg-gray-100 z-30">
                      Grade
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((st) => {
                    const { gpa, grade } = calcStudentGPA(
                      marks?.[st._id],
                      closedSubjects,
                      mark
                    );

                    return (
                      <tr key={st._id} className="hover:bg-gray-50">
                        <td className="p-3 border font-bold md:sticky left-0 bg-indigo-50 text-indigo-900 z-10 shadow-sm">
                          {st.class_role}
                        </td>

                        <td className="p-3 border md:sticky left-[40px] bg-indigo-50 text-gray-900 z-10 shadow-sm">
                          {st.name}
                        </td>

                        {SUBJECTS.map((sub) => {
                          const subData = marks?.[st._id]?.[sub.key];
                          const cq = subData?.cq ?? "";
                          const mcq = subData?.mcq ?? "";
                          const total = subData?.total ?? 0;
                          const absent = Boolean(subData?.absent);

                          const isClosed = Boolean(closedSubjects?.[sub.key]);

                          return (
                            <td key={sub.key} className="p-2 border">
                              <div className="ml-5 mr-5 grid grid-cols-3 gap-2 min-w-[330px]">
                                <input
                                  className="w-full border rounded-md px-3 py-2 text-base bg-white text-black disabled:bg-gray-200"
                                  type="text"
                                  disabled={absent || isClosed}
                                  value={cq}
                                  onChange={(e) =>
                                    handleChange(
                                      st._id,
                                      sub.key,
                                      "cq",
                                      e.target.value
                                    )
                                  }
                                  placeholder="CQ"
                                />
                                <input
                                  className="w-full border rounded-md px-3 py-2 text-base bg-white text-black disabled:bg-gray-200"
                                  type="text"
                                  disabled={absent || isClosed}
                                  value={mcq}
                                  onChange={(e) =>
                                    handleChange(
                                      st._id,
                                      sub.key,
                                      "mcq",
                                      e.target.value
                                    )
                                  }
                                  placeholder="MCQ"
                                />
                                <div className="flex flex-col gap-2">
                                  <input
                                    className="w-full border rounded-md px-3 py-2 text-base bg-gray-100 text-black font-semibold"
                                    type="text"
                                    value={
                                      isClosed ? "-" : absent ? "AB" : total
                                    }
                                    readOnly
                                  />
                                  <label className="flex items-center gap-2 text-sm font-semibold text-red-600">
                                    <input
                                      type="checkbox"
                                      checked={absent}
                                      disabled={isClosed}
                                      onChange={() =>
                                        toggleAbsent(st._id, sub.key)
                                      }
                                    />
                                    Absent
                                  </label>
                                </div>
                              </div>
                            </td>
                          );
                        })}

                        <td className="p-3 border font-bold text-blue-700 md:sticky right-[70px] bg-white z-10">
                          {gpa}
                        </td>
                        <td className="p-3 border font-bold text-purple-700 md:sticky right-0 bg-white z-10">
                          {grade}
                        </td>
                      </tr>
                    );
                  })}

                  {!students.length && (
                    <tr>
                      <td
                        colSpan={2 + SUBJECTS.length + 2}
                        className="p-6 text-center text-gray-500"
                      >
                        No students loaded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          ✅ Weekly → Year+Month+Week লাগবে | Monthly → Year+Month লাগবে |
          Yearly/Half-yearly → Year লাগবে | Test → কিছু লাগবে না
        </p>
      </div>
    </div>
  );
};

export default ResultsEntryPage;

ResultsEntryPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
