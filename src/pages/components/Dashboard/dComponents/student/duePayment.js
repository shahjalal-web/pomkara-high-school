"use client";
import React from "react";

const DuePaymentsSection = ({ payments = [] }) => {
  const reversedDuePayments =
    payments?.length > 0 ? payments.slice().reverse() : [];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
      <h3 className="text-center text-xl font-bold text-yellow-500 p-4">
        Due Payments
      </h3>

      <table className="table w-full">
        <thead className="bg-yellow-400 text-white">
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
  );
};

export default DuePaymentsSection;
