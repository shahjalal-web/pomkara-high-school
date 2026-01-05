  import React, { useContext, useEffect, useState } from "react";
  import { FaBars, FaTimes } from "react-icons/fa";
  import Image from "next/image";
  import Link from "next/link";
  import { AuthContext } from "@/pages/Authentication";
  import { useDispatch, useSelector } from "react-redux";
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
      router.push("/components/studentLogin");
    };

    const handleTeacherLogout = () => {
      signOutUser();
      setUserFromDb(null);
      router.push("/");
    };

useEffect(() => {
  if (typeof window !== "undefined") {
    setUserFromDb(JSON.parse(localStorage.getItem("user")));
    setStudentFromDb(JSON.parse(localStorage.getItem("student")));
  }
}, [router.asPath]);


    const navItems = [
      { label: "Home", href: "/" },
      { label: "About", href: "/components/about" },
      { label: "Gallery", href: "/components/gallary" },
      { label: "Teacher", href: "/components/teacher" },
      { label: "Notice", href: "/components/notice" },
      // { label: "Result", href: "/components/result" },
      { label: "Contact", href: "/components/contact" },
    ];

    return (
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-[1500px] mx-auto px-4">
          <div className="h-20 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="School Logo"
                width={70}
                height={40}
                className="rounded-xl"
              />
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 rounded-md text-sm font-semibold uppercase text-gray-700 hover:bg-green-100 hover:text-green-700 transition"
                >
                  {item.label}
                </Link>
              ))}

              {studentFromDb ? (
                <>
                  <Link
                    href="/components/profile"
                    className="btn btn-sm bg-green-600 text-white"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleStudentLogout}
                    className="btn btn-sm bg-red-500 text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/components/studentLogin"
                  className="btn btn-sm bg-green-600 text-white"
                >
                  Student Login
                </Link>
              )}

              {userFromDb?.isApprove && (
                <Link
                  href="/components/Dashboard"
                  className="btn btn-sm bg-green-700 text-white"
                >
                  Dashboard
                </Link>
              )}

              {user?.uid ? (
                <button
                  onClick={handleTeacherLogout}
                  className="btn btn-sm bg-green-500 text-white"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/components/login"
                  className="btn btn-sm bg-green-500 text-white"
                >
                  Teacher Login
                </Link>
              )}
            </nav>

            {/* Mobile Toggle */}
            <button onClick={toggleMenu} className="md:hidden">
              {menuOpen ? (
                <FaTimes className="text-2xl text-green-700" />
              ) : (
                <FaBars className="text-2xl text-green-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={toggleMenu}
                className="block w-full text-center py-2 rounded-md bg-gray-100 hover:bg-green-100"
              >
                {item.label}
              </Link>
            ))}

            {studentFromDb ? (
              <>
                <Link
                  href="/components/profile"
                  onClick={toggleMenu}
                  className="block text-center py-2 rounded-md bg-green-600 text-white"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleStudentLogout();
                    toggleMenu();
                  }}
                  className="block w-full py-2 rounded-md bg-red-500 text-white"
                >
                  Logout Student
                </button>
              </>
            ) : (
              <Link
                href="/components/studentLogin"
                onClick={toggleMenu}
                className="block text-center py-2 rounded-md bg-green-600 text-white"
              >
                Student Login
              </Link>
            )}

            {userFromDb?.isApprove && (
              <Link
                href="/components/Dashboard"
                onClick={toggleMenu}
                className="block text-center py-2 rounded-md bg-green-700 text-white"
              >
                Dashboard
              </Link>
            )}

            {user?.uid ? (
              <button
                onClick={() => {
                  handleTeacherLogout();
                  toggleMenu();
                }}
                className="block w-full py-2 rounded-md bg-green-500 text-white"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/components/login"
                onClick={toggleMenu}
                className="block text-center py-2 rounded-md bg-green-500 text-white"
              >
                Teacher Login
              </Link>
            )}
          </div>
        )}
      </header>
    );
  };

  export default Navbar;
