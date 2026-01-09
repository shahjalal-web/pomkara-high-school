import Link from "next/link";
import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaChalkboardTeacher,
  FaUsers,
  FaUserGraduate,
  FaCalendarCheck,
  FaEdit,
  FaUserPlus,
  FaBullhorn,
  FaMoneyBillWave,
  FaChevronLeft,
  FaChevronRight,
  FaImages,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import { useRouter } from "next/router";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // PC Sidebar Toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile Dropdown
  const router = useRouter();
  const currentPath = router.pathname;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const menuItems = [
    {
      name: "Teacher",
      link: "/components/Dashboard/dComponents/teacher",
      icon: <FaChalkboardTeacher />,
    },
    {
      name: "Management",
      link: "/components/Dashboard/dComponents/faculty",
      icon: <FaUsers />,
    },
    {
      name: "All Students",
      link: "/components/Dashboard/dComponents/student",
      icon: <FaUserGraduate />,
    },
    {
      name: "Attendance",
      link: "/components/Dashboard/dComponents/present",
      icon: <FaCalendarCheck />,
    },
    {
      name: "Corrections",
      link: "/components/Dashboard/dComponents/present/currections",
      icon: <FaEdit />,
    },
    {
      name: "Add Student",
      link: "/components/Dashboard/dComponents/student/addStudent",
      icon: <FaUserPlus />,
    },
    {
      name: "Notice",
      link: "/components/Dashboard/dComponents/notice",
      icon: <FaBullhorn />,
    },
    {
      name: "Add Money",
      link: "/components/Dashboard/dComponents/addMoney",
      icon: <FaMoneyBillWave />,
    },
  {
    name: "Gallery",
    link: "/components/Dashboard/dComponents/gallery",
    icon: <FaImages />,
  },
  {
    name: "Messages",
    link: "/components/Dashboard/dComponents/messages",
    icon: <FaEnvelopeOpenText />,
  },
  ];

  return (
    <div className="bg-white w-full h-screen overflow-hidden">
      <div className="h-full bg-gray-100 flex max-w-[1500px] mx-auto overflow-hidden">
        {/* --- DESKTOP SIDEBAR --- */}
        <aside
          className={`hidden md:flex flex-col bg-slate-100 shadow-2xl transition-all duration-300 border-r relative h-full
          ${isSidebarOpen ? "w-72" : "w-20"}`}
        >
          {/* Toggle Button for PC */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-10 bg-green-600 text-white p-1.5 rounded-full shadow-lg z-50 hover:bg-green-700 transition"
          >
            {isSidebarOpen ? <FaChevronLeft size={12} /> : <FaChevronRight size={12} />}
          </button>

          <div className="p-6 border-b flex items-center gap-3 overflow-hidden whitespace-nowrap shrink-0">
            <div
              className="bg-green-600 p-2 rounded-lg text-white shrink-0 cursor-pointer"
              onClick={toggleSidebar}
            >
              {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </div>
            <Link href="/components/Dashboard">
              {isSidebarOpen && (
                <span className="font-bold text-xl text-gray-800">Dashboard</span>
              )}
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-2 mt-4 custom-scrollbar">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-semibold transition-all group overflow-hidden whitespace-nowrap
                ${
                  currentPath === item.link
                    ? "bg-green-600 text-white shadow-md"
                    : "text-black hover:bg-green-50 hover:text-green-700"
                }`}
              >
                <span className="text-xl shrink-0">{item.icon}</span>
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </aside>

        {/* --- MAIN CONTENT & MOBILE HEADER --- */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Mobile Header */}
          <header className="md:hidden w-full bg-white shadow-md z-50 px-4 py-3 shrink-0">
            <div className="flex items-center justify-between">
              <button
                onClick={toggleMobileMenu}
                className="text-green-700 p-2 bg-green-50 rounded-lg"
              >
                {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
              </button>
              <Link href="/components/Dashboard">
                <h2 className="font-bold text-green-700 text-lg">Dashboard</h2>
              </Link>
            </div>

            {/* Mobile Dropdown Menu */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                mobileMenuOpen ? "max-h-[500px] mt-4" : "max-h-0"
              }`}
            >
              <ul className="bg-gray-50 rounded-xl p-2 space-y-1 border">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.link}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                        currentPath === item.link ? "bg-green-600 text-white" : "text-gray-700"
                      }`}
                    >
                      {item.icon} {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </header>

          {/* Scrollable Content Area */}
          <main className="flex-1 overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-100">
            <div className="max-w-6xl mx-auto p-4 md:p-10">
              {children}
            </div>
          </main>
        </div>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }
        `}</style>
      </div>
    </div>
  );
};

export default DashboardLayout;