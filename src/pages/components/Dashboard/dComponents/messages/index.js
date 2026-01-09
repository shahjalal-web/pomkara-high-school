"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../DashboardLayout";

const MessagesDashboard = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 PROTECTION
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/components/login");
      return;
    }

    const user = JSON.parse(storedUser);
    const { role, email } = user || {};

    if (
      !email ||
      !role ||
      !["principle", "teacher", "faculty", "management"].includes(role)
    ) {
      router.push("/components/login");
    }
  }, [router]);

  // 📥 FETCH MESSAGES
  const fetchMessages = async () => {
    try {
      const res = await fetch("https://pomkara-high-school-server.vercel.app/message");
      const data = await res.json();
      console.log(data);
      setMessages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // 🗑️ DELETE MESSAGE
  const deleteMessage = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      await fetch(`https://pomkara-high-school-server.vercel.app/message/${id}`, {
        method: "DELETE",
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📩 Contact Messages</h1>

        {messages.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {messages?.map((msg) => (
                <div
                  key={msg._id}
                  className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg p-6 relative hover:scale-[1.02] transition-transform duration-300"
                >
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold">
                      {msg.firstName} {msg.lastName}
                    </h3>
                    <p className="text-sm text-indigo-100 break-all">
                      {msg.phone}
                    </p>
                  </div>

                  {/* Subject */}
                  <div className="mb-3">
                    <span className="inline-block text-xs bg-white/20 px-3 py-1 rounded-full">
                      {msg.subject}
                    </span>
                  </div>

                  {/* Message */}
                  <p className="text-sm text-indigo-50 leading-relaxed mb-6">
                    {msg.message}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-indigo-200">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>

                    <button
                      onClick={() => deleteMessage(msg._id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-sm font-medium rounded-lg shadow transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MessagesDashboard;

MessagesDashboard.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
