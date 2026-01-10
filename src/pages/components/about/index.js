// pages/about.js
import Head from "next/head";
import ElectricBorder from "./ElectricBorder";

export default function About() {
  const stats = [
    { number: "59+", label: "Years of Excellence" },
    { number: "2000+", label: "Students" },
    { number: "100+", label: "Faculty Members" },
    { number: "95%", label: "Success Rate" },
  ];

  const features = [
    {
      icon: "🎓",
      title: "Quality Education",
      description:
        "Comprehensive curriculum designed to foster academic excellence and personal growth.",
    },
    {
      icon: "🏫",
      title: "Modern Infrastructure",
      description:
        "State-of-the-art facilities including smart classrooms, laboratories, and library.",
    },
    {
      icon: "👨‍🏫",
      title: "Expert Faculty",
      description:
        "Highly qualified and experienced teachers dedicated to student success.",
    },
    {
      icon: "🌟",
      title: "Holistic Development",
      description:
        "Focus on academic, cultural, and sports activities for well-rounded development.",
    },
  ];

  return (
    <>
      <Head>
        <title>About Us | Pomkara Siddikur Rahman & Hakim High School</title>
        <meta
          name="description"
          content="Learn more about Pomkara Siddikur Rahman & Hakim High School, our mission, and our values."
        />
      </Head>
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              About Our <span className="text-blue-600">Institution</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Located in the Pumkara, B-para, Cumilla. our institution has been
              a beacon of educational excellence, nurturing young minds and
              shaping future leaders for over five decades.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl transform hover:scale-105 transition-all duration-300 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-700 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Mission & Vision */}
          <div className="mt-20 grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <ElectricBorder
              color="#2563EB"
              speed={1.2}
              chaos={0.12}
              borderRadius={24}
              className="p-1"
            >
              <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-8 text-white">
                <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
                <p className="text-lg leading-relaxed text-blue-100">
                  To provide quality education that empowers students with
                  knowledge, skills, and values necessary to become responsible
                  citizens and leaders of tomorrow, while fostering creativity,
                  critical thinking, and moral character.
                </p>
              </div>
            </ElectricBorder>

            {/* Vision */}
            <ElectricBorder
              color="#EC4899"
              speed={1.2}
              chaos={0.14}
              borderRadius={24}
              className="p-1"
            >
              <div className="bg-gradient-to-br from-purple-900 via-fuchsia-800 to-pink-900 rounded-2xl p-8 text-white">
                <h3 className="text-3xl font-bold mb-6">Our Vision</h3>
                <p className="text-lg leading-relaxed text-pink-100">
                  To be a leading educational institution that nurtures
                  excellence, innovation, and integrity, preparing students to
                  excel in a rapidly changing global society while maintaining
                  strong cultural values and social responsibility.
                </p>
              </div>
            </ElectricBorder>
          </div>
        </div>
      </section>
    </>
  );
}
