import React, { useContext, useEffect, useState } from "react";
import { FaBars, FaTimes, FaHome, FaInfoCircle, FaImages, FaChalkboardTeacher, FaBullhorn, FaPhoneAlt, FaUserCircle, FaSignOutAlt, FaThLarge, FaUser } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { AuthContext } from "@/pages/Authentication";
import { useDispatch } from "react-redux";
import { logout } from "../../../../Redux/features/authSlice";
import { useRouter } from "next/router";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userFromDb, setUserFromDb] = useState(null);
    const [studentFromDb, setStudentFromDb] = useState(null);

    const { user, signOutUser } = useContext(AuthContext);
    const dispatch = useDispatch();
    const router = useRouter();

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleStudentLogout = () => {
        dispatch(logout());
        localStorage.removeItem("student");
        setMenuOpen(false);
        router.push("/components/studentLogin");
    };

    const handleTeacherLogout = () => {
        signOutUser();
        setUserFromDb(null);
        setMenuOpen(false);
        router.push("/");
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            setUserFromDb(JSON.parse(localStorage.getItem("user")));
            setStudentFromDb(JSON.parse(localStorage.getItem("student")));
        }
    }, [router.asPath]);

    const navItems = [
        { label: "Home", href: "/", icon: <FaHome /> },
        { label: "About", href: "/components/about", icon: <FaInfoCircle /> },
        { label: "Gallery", href: "/components/gallary", icon: <FaImages /> },
        { label: "Teacher", href: "/components/teacher", icon: <FaChalkboardTeacher /> },
        { label: "Notice", href: "/components/notice", icon: <FaBullhorn /> },
        { label: "Contact", href: "/components/contact", icon: <FaPhoneAlt /> },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white shadow-lg">
            <div className="max-w-[1500px] mx-auto px-6">
                <div className="h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 transform transition hover:scale-105">
                        <Image
                            src="/logo.png"
                            alt="School Logo"
                            width={60}
                            height={40}
                            className="rounded-lg shadow-sm"
                        />
                        <span className="font-bold text-xl text-green-700 hidden sm:block">MySchool</span>
                    </Link>

                    {/* Desktop & Mobile Menu Toggle */}
                    <button 
                        onClick={toggleMenu} 
                        className="p-2 rounded-full hover:bg-green-50 transition-colors text-green-700"
                    >
                        {menuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
                    </button>
                </div>
            </div>

            {/* --- Side Drawer Menu (Common for Desktop and Mobile) --- */}
            <div className={`fixed inset-0 z-[60] transition-opacity duration-300 ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                {/* Backdrop overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={toggleMenu}></div>
                
                {/* Drawer Content */}
                <div className={`absolute right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
                    <div className="p-6 flex flex-col h-full">
                        {/* Drawer Header */}
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold text-green-700">Menu</h2>
                            <button onClick={toggleMenu} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-red-50 hover:text-red-500 transition">
                                <FaTimes />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex-1 space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={toggleMenu}
                                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-green-50 hover:text-green-700 transition"
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}

                            <hr className="my-4 border-gray-100" />

                            {/* Conditional Links (Dashboard, Profile, Login/Logout) */}
                            <div className="space-y-3 pt-2">
                                {studentFromDb ? (
                                    <>
                                        <Link href="/components/profile" onClick={toggleMenu} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-semibold transition hover:bg-blue-100">
                                            <FaUserCircle className="text-lg" /> Profile
                                        </Link>
                                        <button onClick={handleStudentLogout} className="flex items-center gap-4 w-full px-4 py-3 rounded-xl bg-red-50 text-red-600 font-semibold transition hover:bg-red-100">
                                            <FaSignOutAlt className="text-lg" /> Student Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link href="/components/studentLogin" onClick={toggleMenu} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-green-600 text-white font-semibold transition hover:bg-green-700">
                                        <FaUser className="text-lg" /> Student Login
                                    </Link>
                                )}

                                {userFromDb?.isApprove && (
                                    <Link href="/components/Dashboard" onClick={toggleMenu} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-purple-50 text-purple-700 font-semibold transition hover:bg-purple-100">
                                        <FaThLarge className="text-lg" /> Dashboard
                                    </Link>
                                )}

                                {user?.uid ? (
                                    <button onClick={handleTeacherLogout} className="flex items-center gap-4 w-full px-4 py-3 rounded-xl bg-orange-50 text-orange-600 font-semibold transition hover:bg-orange-100">
                                        <FaSignOutAlt className="text-lg" /> Teacher Sign Out
                                    </button>
                                ) : (
                                    <Link href="/components/login" onClick={toggleMenu} className="flex items-center gap-4 px-4 py-3 rounded-xl border-2 border-green-600 text-green-700 font-semibold text-center justify-center hover:bg-green-600 hover:text-white transition">
                                        Teacher Login
                                    </Link>
                                )}
                            </div>
                        </nav>
                        
                        {/* Footer in Drawer */}
                        <div className="mt-auto text-center text-sm text-gray-400">
                            © 2024 MySchool Management
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;