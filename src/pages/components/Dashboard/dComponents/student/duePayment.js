"use client";
import React, { useMemo, useState } from "react";

const DuePaymentsSection = ({ payments = [] }) => {
  const [showAll, setShowAll] = useState(false);

  // Reverse + filter only due payments
  const duePayments = useMemo(() => {
    const reversed = payments?.length > 0 ? payments.slice().reverse() : [];
    return reversed.filter((p) => !p.isPaid);
  }, [payments]);

  const shouldShowButton = duePayments.length > 5;

  const displayedPayments = showAll ? duePayments : duePayments.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <h3 className="text-center text-xl font-bold text-yellow-500 p-4 border-b">
        Due Payments
      </h3>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-yellow-400 text-white">
            <tr>
              <th>Amount</th>
              <th>For</th>
              <th>Added By</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {displayedPayments.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No due payments found
                </td>
              </tr>
            ) : (
              displayedPayments.map((p, i) => (
                <tr key={i}>
                  <td>{p.amount}</td>
                  <td>{p.amountType}</td>
                  <td>{p.addedBy?.name}</td>
                  <td>{new Date(p.date).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Show More Button */}
      {shouldShowButton && (
        <div className="p-4 flex justify-center">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="px-6 py-2 rounded-full bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition"
          >
            {showAll ? "Show Less" : `Show More (${duePayments.length - 5} more)`}
          </button>
        </div>
      )}
    </div>
  );
};

export default DuePaymentsSection;
