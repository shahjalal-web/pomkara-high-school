/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Footer = () => {
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);

  const importantLinks = [
    { name: "Admission", href: "#", icon: "🎓" },
    { name: "Academic Calendar", href: "#", icon: "📅" },
    { name: "Results", href: "#", icon: "📊" },
    { name: "Library", href: "#", icon: "📚" },
  ];

  const socialLinks = [
    { name: "Facebook", href: "#", icon: "📘", color: "hover:text-blue-600" },
    { name: "YouTube", href: "#", icon: "📺", color: "hover:text-red-600" },
    { name: "LinkedIn", href: "#", icon: "💼", color: "hover:text-blue-700" },
    { name: "Instagram", href: "#", icon: "📷", color: "hover:text-pink-600" },
  ];

  const contactInfo = [
    { icon: "📍", text: "Pumkara, B-para, cumilla Bangladesh" },
    { icon: "📞", text: "9883066, 9895334, 8837393" },
    { icon: "✉️", text: "info@pumkara.edu.bd" },
  ];

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newsletterEmail) {
      toast.error("Please enter an email address");
      return;
    }
    if (!emailRegex.test(newsletterEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsNewsletterSubmitting(true);

    try {
      console.log("Submitting to Formspree with email:", newsletterEmail); // Debugging
      const response = await fetch("https://formspree.io/f/mblklvdv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      console.log("Formspree response status:", response.status); // Debugging
      if (response.ok) {
        toast.success(
          "Subscribed successfully! Check your email for confirmation."
        );
        setNewsletterEmail("");
      } else {
        const errorData = await response.json();
        console.error("Formspree error response:", errorData); // Debugging
        if (response.status === 404) {
          throw new Error(
            "Form not found. Please verify the Formspree form ID (mblklvdv) in the dashboard."
          );
        } else if (response.status === 403) {
          throw new Error(
            "Form is not active. Please activate it by submitting from your deployed site."
          );
        } else {
          throw new Error(errorData.error || "Newsletter subscription failed");
        }
      }
    } catch (error) {
      console.error("Submission error:", error.message); // Debugging
      toast.error(error.message || "Failed to subscribe. Please try again.");
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };

  const handleNewsletterInputChange = (e) => {
    setNewsletterEmail(e.target.value);
  };

  return (
    <div>
      <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-500/5 rounded-full animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative z-10">
          {/* Main Footer Content */}
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* School Info */}
              <div className="space-y-6 animate-fadeInUp">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center float">
                    <img
                      src="https://i.ibb.co/k6Gz8ZkC/Logo.png"
                      alt="School Logo"
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      Pumkara Chiddikur Rahman & Hakim
                    </h3>
                    <p className="text-blue-200 text-sm">
                      Higher Secondary School
                    </p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Empowering minds, shaping futures. We are committed to
                  providing quality education and nurturing the next generation
                  of leaders.
                </p>

                {/* Social Links */}
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={social.name}
                      href={social.href}
                      className={`w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:bg-white/20 ${social.color}`}
                      onMouseEnter={() => setHoveredIcon(social.name)}
                      onMouseLeave={() => setHoveredIcon(null)}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <span className="text-lg">{social.icon}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Important Links */}
              <div
                className="space-y-6 animate-fadeInUp"
                style={{ animationDelay: "0.2s" }}
              >
                <h4 className="text-xl font-bold text-blue-300 flex items-center space-x-2">
                  <span>🔗</span>
                  <span>Important Links</span>
                </h4>
                <ul className="space-y-3">
                  {importantLinks.map((link, index) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="flex items-center space-x-3 text-gray-300 hover:text-blue-300 transition-all duration-300 transform hover:translate-x-2 group"
                      >
                        <span className="text-lg group-hover:animate-bounce">
                          {link.icon}
                        </span>
                        <span>{link.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Get in Touch */}
              <div
                className="space-y-6 animate-fadeInUp"
                style={{ animationDelay: "0.4s" }}
              >
                <h4 className="text-xl font-bold text-blue-300 flex items-center space-x-2">
                  <span>📞</span>
                  <span>Get in Touch</span>
                </h4>
                <ul className="space-y-4">
                  {contactInfo.map((contact, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 text-gray-300 group"
                    >
                      <span className="text-lg mt-0.5 group-hover:animate-pulse">
                        {contact.icon}
                      </span>
                      <span className="leading-relaxed">{contact.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div
                className="space-y-6 animate-fadeInUp"
                style={{ animationDelay: "0.6s" }}
              >
                <h4 className="text-xl font-bold text-blue-300 flex items-center space-x-2">
                  <span>📧</span>
                  <span>Stay Updated</span>
                </h4>
                <p className="text-gray-300">
                  Subscribe to our newsletter for the latest updates and
                  announcements.
                </p>
                <form
                  onSubmit={handleNewsletterSubmit}
                  action="https://formspree.io/f/mblklvdv"
                  method="POST"
                  className="space-y-3"
                >
                  <input
                    type="email"
                    name="email"
                    value={newsletterEmail}
                    onChange={handleNewsletterInputChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-white/70 text-white transition-all duration-300"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isNewsletterSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg btn-animate disabled:from-blue-400 disabled:to-indigo-400 disabled:transform-none"
                  >
                    {isNewsletterSubmitting ? "Subscribing..." : "Subscribe"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
                <div className="text-gray-300 text-sm animate-fadeInLeft">
                  © 2025 Pomkara Chiddikur Rahman & Hakim High School. All
                  rights reserved.
                </div>
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-300 animate-fadeInRight">
                  <a href="#" className="hover:text-blue-300 transition-colors">
                    Privacy Policy
                  </a>
                  <a href="#" className="hover:text-blue-300 transition-colors">
                    Terms of Service
                  </a>
                  <a href="#" className="hover:text-blue-300 transition-colors">
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Footer;
