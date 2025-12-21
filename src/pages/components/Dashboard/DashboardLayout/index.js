import Link from "next/link";
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const DashboardLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const offMenu = () => setMenuOpen(false);

  const menuItems = [
    { name: "Teacher", link: "/components/Dashboard/dComponents/teacher" },
    { name: "Faculty", link: "/components/Dashboard/dComponents/faculty" },
    { name: "All Students", link: "/components/Dashboard/dComponents/student" },
    {
      name: "Add Student",
      link: "/components/Dashboard/dComponents/student/addStudent",
    },
    { name: "Notice", link: "/components/Dashboard/dComponents/notice" },
    { name: "Result", link: "/components/Dashboard/dComponents/result" },
    { name: "Add Money", link: "/components/Dashboard/dComponents/addMoney" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto flex min-w-0">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white shadow-xl min-h-screen sticky top-0 flex-shrink-0">
          <div className="p-6 bg-green-600 text-white text-center font-bold text-xl">
            <Link href="/components/Dashboard">Dashboard</Link>
          </div>

          <ul className="p-4 space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.link}
                  className="block px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-green-100 hover:text-green-700 transition"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden w-full bg-white shadow-md fixed mt-3 left-0 z-50">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="font-bold text-green-700 text-lg">
              <Link href="/components/Dashboard">Dashboard</Link>
            </h2>
            <button onClick={toggleMenu}>
              {menuOpen ? (
                <FaTimes className="text-2xl text-green-700" />
              ) : (
                <FaBars className="text-2xl text-green-700" />
              )}
            </button>
          </div>

          {menuOpen && (
            <div className="bg-white shadow-lg border-t">
              <ul className="p-4 space-y-2">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.link}
                      onClick={offMenu}
                      className="block px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-green-100 hover:text-green-700 transition"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* CONTENT AREA */}
        <main className="flex-1 min-w-0 p-4 md:p-8 mt-16 md:mt-0 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
