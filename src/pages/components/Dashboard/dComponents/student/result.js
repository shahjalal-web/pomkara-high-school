"use client";
import { useState, useMemo } from "react";
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
import { IoReloadOutline } from "react-icons/io5";

const PASS_PERCENT = 33;

const isPass = (obtained, full) =>
  (Number(obtained) / Number(full)) * 100 >= PASS_PERCENT;

// ---------- PIE LABEL FIX ----------
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
  const RADIAN = Math.PI / 180;
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

const ResultSection = ({ results = [] }) => {
  // filters
  const [examFilter, setExamFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [passFilter, setPassFilter] = useState("");
  const [showAllResults, setShowAllResults] = useState(false);

  // chart toggle
  const [chartType, setChartType] = useState("bar");

  const resetFilter = () => {
    setExamFilter("");
    setYearFilter("");
    setSubjectFilter("");
    setPassFilter("");
  };

  // FILTERED RESULTS
  const filteredResults = useMemo(() => {
    return results
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
  }, [results, examFilter, yearFilter, subjectFilter, passFilter]);

  // CHART DATA — average percentage per subject
  const chartData = useMemo(() => {
    const map = {};

    filteredResults.forEach((r) => {
      const percent = (Number(r.result) / Number(r.mark)) * 100;

      if (!map[r.subject]) {
        map[r.subject] = {
          subject: r.subject,
          totalPercent: 0,
          count: 0,
        };
      }

      map[r.subject].totalPercent += percent;
      map[r.subject].count += 1;
    });

    return Object.values(map).map((item) => ({
      subject: item.subject,
      avgPercent: Math.round(item.totalPercent / item.count),
    }));
  }, [filteredResults]);

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-bold text-indigo-600 mb-3">Exam Results</h2>

      {/* FILTERS */}
      <div className="grid md:grid-cols-5 gap-3 mb-4">
        <select
          className="select select-bordered bg-white"
          value={examFilter}
          onChange={(e) => setExamFilter(e.target.value)}
        >
          <option value="">All Exams</option>
          <option value="monthly">Monthly</option>
          <option value="terminal">Terminal</option>
          <option value="midterm">Mid Term</option>
          <option value="final">Final</option>
          <option value="retest">Re-test</option>
        </select>

        <select
          className="select select-bordered bg-white"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        >
          <option value="">All Years</option>
          {[
            ...new Set(results?.map((r) => new Date(r.date).getFullYear())),
          ].map((y) => (
            <option key={y} value={y}>
              {y}
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

      {/* TABLE */}
      <div className="w-full overflow-x-auto">
  <table className="table w-full min-w-[850px]">
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
      {(showAllResults ? filteredResults : filteredResults?.slice(0, 4))?.map(
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


      {filteredResults?.length > 6 && (
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

        {/* TOGGLE */}
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

        {/* BAR */}
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

        {/* PIE */}
        {chartType === "pie" && (
          <ResponsiveContainer width="100%" height={330}>
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
