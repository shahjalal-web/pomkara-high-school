"use client";
import React, { useMemo, useState } from "react";

const PaidPaymentsSection = ({ payments = [] }) => {
  const [showAll, setShowAll] = useState(false);

  // Reverse + filter only paid payments
  const paidPayments = useMemo(() => {
    const reversed = payments?.length > 0 ? payments.slice().reverse() : [];
    return reversed.filter((p) => p.isPaid);
  }, [payments]);

  const shouldShowButton = paidPayments.length > 5;

  const displayedPayments = showAll ? paidPayments : paidPayments.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <h3 className="text-center text-xl font-bold text-green-500 p-4 border-b">
        Paid Payments
      </h3>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-green-500 text-white">
            <tr>
              <th>Date</th>
              <th>For</th>
              <th>Amount</th>
              <th>Accepted By</th>
            </tr>
          </thead>

          <tbody>
            {displayedPayments.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No paid payments found
                </td>
              </tr>
            ) : (
              displayedPayments.map((p, i) => (
                <tr key={i}>
                  <td>{new Date(p.date).toLocaleDateString()}</td>
                  <td>{p.amountType}</td>
                  <td>{p.amount}</td>
                  <td>{p.addedBy?.name}</td>
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
            className="px-6 py-2 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition"
          >
            {showAll ? "Show Less" : `Show More (${paidPayments.length - 5} more)`}
          </button>
        </div>
      )}
    </div>
  );
};

export default PaidPaymentsSection;
