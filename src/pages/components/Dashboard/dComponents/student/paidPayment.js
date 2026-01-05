"use client";
import React from "react";

const PaidPaymentsSection = ({ payments = [] }) => {
  const reversedPaidPayments =
    payments?.length > 0 ? payments.slice().reverse() : [];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
      <h3 className="text-center text-xl font-bold text-green-500 p-4">
        Paid Payments
      </h3>

      <table className="table w-full">
        <thead className="bg-green-500 text-white">
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
  );
};

export default PaidPaymentsSection;
