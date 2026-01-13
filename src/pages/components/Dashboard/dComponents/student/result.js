/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useMemo, useRef } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { IoReloadOutline, IoPrintOutline } from "react-icons/io5";

const PASS_PERCENT = 33;

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const weekNames = ["1st", "2nd", "3rd", "4th"];

const isPass = (obtained, full) =>
  (Number(obtained) / Number(full)) * 100 >= PASS_PERCENT;

function markToGPA(markPercent) {
  const m = Number(markPercent || 0);
  if (m >= 80) return { grade: "A+", gpa: 5.0 };
  if (m >= 70) return { grade: "A", gpa: 4.0 };
  if (m >= 60) return { grade: "A-", gpa: 3.5 };
  if (m >= 50) return { grade: "B", gpa: 3.0 };
  if (m >= 40) return { grade: "C", gpa: 2.0 };
  if (m >= 33) return { grade: "D", gpa: 1.0 };
  return { grade: "F", gpa: 0.0 };
}

function overallFromGpas(list) {
  if (!list?.length) return { gpa: 0, grade: "-" };
  const hasFail = list.some((x) => x.gpa === 0);
  if (hasFail) return { gpa: 0, grade: "F" };

  const avg = list.reduce((s, x) => s + x.gpa, 0) / list.length;

  let grade = "F";
  if (avg === 5) grade = "A+";
  else if (avg >= 4) grade = "A";
  else if (avg >= 3.5) grade = "A-";
  else if (avg >= 3) grade = "B";
  else if (avg >= 2) grade = "C";
  else if (avg >= 1) grade = "D";

  return { gpa: Number(avg.toFixed(2)), grade };
}

// PIE LABEL
const RADIAN = Math.PI / 180;
const renderLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  subject,
  avgPercent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#000"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
    >
      {`${subject} (${Math.round(avgPercent)}%)`}
    </text>
  );
};

const ResultSection = ({
  results = [],
  student = { name: "Student", class: "", class_role: "" },
  school = { name: "School Name", address: "" },
}) => {
  const [examFilter, setExamFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState(""); // 01..12
  const [weekFilter, setWeekFilter] = useState(""); // 1st..4th
  const [subjectFilter, setSubjectFilter] = useState("");
  const [passFilter, setPassFilter] = useState("");
  const [showAllResults, setShowAllResults] = useState(false);

  const [chartType, setChartType] = useState("bar");

  const printRef = useRef(null);

  const resetFilter = () => {
    setExamFilter("");
    setYearFilter("");
    setMonthFilter("");
    setWeekFilter("");
    setSubjectFilter("");
    setPassFilter("");
  };

  const yearOptions = useMemo(() => {
    return [
      ...new Set(results?.map((r) => new Date(r.date).getFullYear())),
    ].sort((a, b) => b - a);
  }, [results]);

  // ✅ requirements
  const requireYear = Boolean(examFilter);
  const requireMonth = examFilter === "monthly" || examFilter === "weekly";
  const requireWeek = examFilter === "weekly";

  const filterReady = useMemo(() => {
    if (!examFilter) return true;
    if (requireYear && !yearFilter) return false;
    if (requireMonth && !monthFilter) return false;
    if (requireWeek && !weekFilter) return false;
    return true;
  }, [
    examFilter,
    yearFilter,
    monthFilter,
    weekFilter,
    requireYear,
    requireMonth,
    requireWeek,
  ]);

  // ✅ FILTERED RESULTS
  const filteredResults = useMemo(() => {
    const arr = results?.slice().reverse();

    return arr.filter((r) => {
      const d = new Date(r.date);
      const y = d.getFullYear().toString();
      const m = (d.getMonth() + 1).toString().padStart(2, "0");

      // backend may store week/month/year
      const examMonth = r.examMonth || m;
      const examWeek = r.examWeek || "";

      const okExam = !examFilter || r.examType === examFilter;

      // ✅ year must when exam selected
      const okYear = !examFilter || (yearFilter ? y === yearFilter : false);

      // ✅ month must for monthly + weekly
      const okMonth =
        !requireMonth || (monthFilter ? examMonth === monthFilter : false);

      // ✅ week must for weekly
      const okWeek =
        !requireWeek || (weekFilter ? examWeek === weekFilter : false);

      const okSubject = !subjectFilter || r.subject === subjectFilter;

      const okPass =
        !passFilter ||
        (passFilter === "pass" && isPass(r.result, r.mark)) ||
        (passFilter === "fail" && !isPass(r.result, r.mark));

      if (examFilter && !filterReady) return false;

      return okExam && okYear && okMonth && okWeek && okSubject && okPass;
    });
  }, [
    results,
    examFilter,
    yearFilter,
    monthFilter,
    weekFilter,
    subjectFilter,
    passFilter,
    filterReady,
    requireMonth,
    requireWeek,
  ]);

  const marksheetSubjects = useMemo(() => {
    const map = {};
    filteredResults.forEach((r) => {
      if (!map[r.subject]) map[r.subject] = r;
    });
    return Object.values(map);
  }, [filteredResults]);

  const marksheetRows = useMemo(() => {
    return marksheetSubjects.map((r) => {
      const percent = (Number(r.result) / Number(r.mark)) * 100;
      const { grade, gpa } = markToGPA(percent);

      return {
        subject: r.subject,
        marks: `${r.result} / ${r.mark}`,
        percent: Math.round(percent),
        grade,
        gpa,
        date: r.date,
        examType: r.examType,
      };
    });
  }, [marksheetSubjects]);

  const overall = useMemo(() => {
    const list = marksheetRows.map((x) => ({ gpa: x.gpa }));
    return overallFromGpas(list);
  }, [marksheetRows]);

  const chartData = useMemo(() => {
    const map = {};
    filteredResults.forEach((r) => {
      const percent = (Number(r.result) / Number(r.mark)) * 100;
      if (!map[r.subject]) {
        map[r.subject] = { subject: r.subject, totalPercent: 0, count: 0 };
      }
      map[r.subject].totalPercent += percent;
      map[r.subject].count += 1;
    });

    return Object.values(map).map((item) => ({
      subject: item.subject,
      avgPercent: Math.round(item.totalPercent / item.count),
    }));
  }, [filteredResults]);

  // ✅ PRINT
  const handlePrint = () => {
    if (!marksheetRows.length) return alert("No marksheet data found!");
    const html = printRef.current?.innerHTML || "";
    const w = window.open("", "PRINT", "height=700,width=1000");

    w.document.write(`
      <html>
        <head>
          <title>Marksheet</title>
          <style>
            *{box-sizing:border-box;font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto;}
            body{padding:24px;}
            .sheet{max-width: 900px;margin: 0 auto;border:1px solid #e5e7eb;border-radius:16px; padding:22px;}
            .head{text-align:center;border-bottom:1px dashed #cbd5e1;padding-bottom:14px;margin-bottom:16px;}
            .school{font-size:22px;font-weight:800;color:#111827;}
            .addr{font-size:12px;color:#6b7280;margin-top:4px;}
            .title{margin-top:8px;font-size:16px;font-weight:700;color:#1d4ed8;text-align:center;}
            .meta{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0 18px;}
            .meta div{padding:10px 12px;border:1px solid #e5e7eb;border-radius:12px;font-size:13px;}
            table{width:100%;border-collapse:collapse;margin-top:6px;}
            th,td{border:1px solid #e5e7eb;padding:10px 12px;font-size:13px;}
            th{background:#1e40af;color:white;text-align:left;}
            .badge{display:inline-block;padding:2px 8px;border-radius:999px;font-weight:700;font-size:12px;}
            .pass{background:#dcfce7;color:#166534;}
            .fail{background:#fee2e2;color:#991b1b;}
            .overall{display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding:12px;border-radius:12px;border:1px solid #e5e7eb;background:#f8fafc;}
            .footer{margin-top:20px;display:flex;justify-content:space-between;gap:20px;}
            .sign{flex:1;border-top:1px solid #94a3b8;padding-top:6px;text-align:center;font-size:12px;color:#334155;}
            @media print{
              body{padding:0;}
              .sheet{border:none;}
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `);

    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  const showMarksheet = Boolean(examFilter) && filterReady;

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-bold text-indigo-600 mb-3">Exam Results</h2>

      {/* FILTERS */}
      <div className="grid md:grid-cols-7 gap-3 mb-4">
        <select
          className="select select-bordered bg-white"
          value={examFilter}
          onChange={(e) => {
            const val = e.target.value;
            setExamFilter(val);
            setYearFilter("");
            setMonthFilter("");
            setWeekFilter("");
          }}
        >
          <option value="">All Exams</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="half_yearly">Half Yearly</option>
          <option value="yearly">Yearly</option>
          <option value="test">Test</option>
        </select>

        <select
          className={`select select-bordered bg-white ${
            examFilter && !yearFilter ? "border-red-400" : ""
          }`}
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          disabled={!examFilter}
        >
          <option value="">{examFilter ? "Select Year *" : "All Years"}</option>
          {yearOptions.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>

        {/* ✅ Month works for monthly + weekly */}
        <select
          className={`select select-bordered bg-white ${
            requireMonth && !monthFilter ? "border-red-400" : ""
          }`}
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          disabled={!requireMonth}
        >
          <option value="">{requireMonth ? "Select Month *" : "Month"}</option>
          {monthNames.map((m, idx) => {
            const val = String(idx + 1).padStart(2, "0");
            return (
              <option key={val} value={val}>
                {m}
              </option>
            );
          })}
        </select>

        {/* ✅ Week works for weekly */}
        <select
          className={`select select-bordered bg-white ${
            requireWeek && !weekFilter ? "border-red-400" : ""
          }`}
          value={weekFilter}
          onChange={(e) => setWeekFilter(e.target.value)}
          disabled={!requireWeek}
        >
          <option value="">{requireWeek ? "Select Week *" : "Week"}</option>
          {weekNames.map((w) => (
            <option key={w} value={w}>
              {w} Week
            </option>
          ))}
        </select>

        <select
          className="select select-bordered bg-white"
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
        >
          <option value="">All Subjects</option>
          {[...new Set(results?.map((r) => r.subject))].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered bg-white"
          value={passFilter}
          onChange={(e) => setPassFilter(e.target.value)}
        >
          <option value="">Pass + Fail</option>
          <option value="pass">Pass</option>
          <option value="fail">Fail</option>
        </select>

        <button
          onClick={resetFilter}
          className="inline-flex items-center gap-2 justify-center px-4 py-2 
          bg-indigo-50 text-indigo-700 font-semibold 
          rounded-full shadow-sm border border-indigo-200
          hover:bg-indigo-100 hover:shadow-md hover:-translate-y-0.5
          active:translate-y-0 transition-all duration-200"
        >
          Reset
          <IoReloadOutline className="text-lg" />
        </button>
      </div>

      {examFilter && !filterReady && (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          {examFilter === "weekly"
            ? "Weekly report দেখতে হলে Year, Month এবং Week select করা লাগবে।"
            : examFilter === "monthly"
            ? "Monthly report দেখতে হলে Year এবং Month select করা লাগবে।"
            : "Report দেখতে হলে Year select করা লাগবে।"}
        </div>
      )}

      {/* MARKSHEET */}
      {showMarksheet && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-indigo-600">Marksheet (Filtered)</h3>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              <IoPrintOutline className="text-lg" />
              Print Marksheet
            </button>
          </div>

          {/* Print Area */}
          <div ref={printRef} className="bg-white hidden">
            <div className="sheet">
              <div className="head">
                <div className="school">{school?.name}</div>
                {school?.address ? <div className="addr">{school.address}</div> : null}
                <div className="title">
                  Marksheet — {examFilter.toUpperCase()} Exam{" "}
                  {examFilter === "monthly" || examFilter === "weekly"
                    ? monthFilter
                      ? `(${monthNames[Number(monthFilter) - 1]})`
                      : ""
                    : ""}
                  {examFilter === "weekly" && weekFilter ? ` (${weekFilter} Week)` : ""}
                  {yearFilter ? ` ${yearFilter}` : ""}
                </div>
              </div>

              <div className="meta">
                <div>
                  <b>Student Name:</b> {student?.name}
                  <br />
                  <b>Class:</b> {student?.class} <br />
                  <b>Roll:</b> {student?.class_role}
                </div>
                <div>
                  <b>Total Subjects:</b> {marksheetRows.length}
                  <br />
                  <b>Overall GPA:</b> {overall.gpa} <br />
                  <b>Overall Grade:</b> {overall.grade}
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th style={{ width: "40%" }}>Subject</th>
                    <th>Marks</th>
                    <th>Percent</th>
                    <th>GPA</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {marksheetRows.map((r) => (
                    <tr key={r.subject}>
                      <td style={{ fontWeight: 700 }}>{r.subject}</td>
                      <td>{r.marks}</td>
                      <td>
                        <span className={`badge ${r.gpa === 0 ? "fail" : "pass"}`}>
                          {r.percent}%
                        </span>
                      </td>
                      <td style={{ fontWeight: 800 }}>{r.gpa}</td>
                      <td style={{ fontWeight: 800 }}>{r.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="overall">
                <div style={{ fontWeight: 800 }}>
                  Final Result:{" "}
                  <span className={`badge ${overall.gpa === 0 ? "fail" : "pass"}`}>
                    {overall.gpa === 0 ? "FAIL" : "PASS"}
                  </span>
                </div>
                <div style={{ fontWeight: 800 }}>
                  Overall GPA: {overall.gpa} | Grade: {overall.grade}
                </div>
              </div>

              <div className="footer">
                <div className="sign">Class Teacher</div>
                <div className="sign">Guardian</div>
                <div className="sign">Head Teacher</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="w-full overflow-x-auto">
        <table className="table w-full min-w-[950px]">
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
            {(showAllResults ? filteredResults : filteredResults?.slice(0, 6))?.map(
              (r, i) => (
                <tr key={i} className="whitespace-nowrap">
                  <td>{r.examType}</td>
                  <td>{r.subject}</td>
                  <td>
                    {r.result} / {r.mark}{" "}
                    {isPass(r.result, r.mark) ? (
                      <span className="text-green-600 ml-1 text-sm">(Pass)</span>
                    ) : (
                      <span className="text-red-500 ml-1 text-sm">(Fail)</span>
                    )}
                  </td>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                  <td>{r.addedBy?.name}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {filteredResults?.length > 8 && (
        <div className="mt-3 text-center">
          <button
            className="text-indigo-600 w-28"
            onClick={() => setShowAllResults((prev) => !prev)}
          >
            {showAllResults ? "Show Less" : "Show More"}
          </button>
        </div>
      )}

      {/* CHART SECTION */}
      <div className="bg-white rounded-xl shadow-md p-4 mt-6">
        <h3 className="font-bold text-indigo-600 mb-3">Performance Chart</h3>

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setChartType("bar")}
            className={`px-4 py-2 rounded-lg border ${
              chartType === "bar"
                ? "bg-indigo-600 text-white"
                : "bg-indigo-50 text-indigo-700"
            }`}
          >
            Bar Chart
          </button>

          <button
            onClick={() => setChartType("pie")}
            className={`px-4 py-2 rounded-lg border ${
              chartType === "pie"
                ? "bg-indigo-600 text-white"
                : "bg-indigo-50 text-indigo-700"
            }`}
          >
            Pie Chart
          </button>
        </div>

        {chartType === "bar" && (
          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px] md:min-w-full">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" interval={0} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgPercent">
                    {chartData.map((d, i) => {
                      let color = "#22c55e";
                      if (d.avgPercent <= 33) color = "#ef4444";
                      else if (d.avgPercent <= 60) color = "#facc15";
                      else if (d.avgPercent <= 80) color = "#84cc16";
                      else color = "#16a34a";
                      return <Cell key={i} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {chartType === "pie" && (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="avgPercent"
                nameKey="subject"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={110}
                labelLine={false}
                label={renderLabel}
              >
                {chartData.map((d, i) => {
                  let color = "#22c55e";
                  if (d.avgPercent <= 33) color = "#ef4444";
                  else if (d.avgPercent <= 60) color = "#facc15";
                  else if (d.avgPercent <= 80) color = "#84cc16";
                  else color = "#16a34a";
                  return <Cell key={i} fill={color} />;
                })}
              </Pie>

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ResultSection;
