import Head from "next/head";
import React, { useEffect, useState } from "react";
import ElectricBorder from "../about/ElectricBorder";

const TopSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Excellence in Education",
      subtitle: "Nurturing minds, building futures",
      image: "https://i.ibb.co/svnK4Gc3/Slide-02.jpg",
    },
    {
      title: "Modern Learning Environment",
      subtitle: "State-of-the-art facilities for holistic development",
      image: "https://i.ibb.co/qGq2QjC/Slide-03.jpg",
    },
    {
      title: "Dedicated Faculty",
      subtitle: "Experienced teachers committed to student success",
      image: "https://i.ibb.co/MkLLxW1h/Slide-04.jpg",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

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

  const programs = [
    {
      level: "Primary",
      grades: "Class I - V",
      description:
        "Foundation building with focus on basic literacy, numeracy, and character development.",
      subjects: [
        "English",
        "Bangla",
        "Mathematics",
        "Science",
        "Social Studies",
      ],
      color: "from-green-400 to-blue-500",
    },
    {
      level: "Secondary",
      grades: "Class VI - X",
      description:
        "Comprehensive education preparing students for higher secondary studies.",
      subjects: [
        "Physics",
        "Chemistry",
        "Biology",
        "Mathematics",
        "English",
        "Bangla",
      ],
      color: "from-blue-400 to-purple-500",
    },
    {
      level: "Higher Secondary",
      grades: "Class XI - XII",
      description:
        "Specialized streams preparing students for university admission.",
      subjects: ["Science", "Commerce", "Arts", "Business Studies"],
      color: "from-purple-400 to-pink-500",
    },
  ];

  const facilities = [
    {
      icon: "🔬",
      name: "Science Labs",
      description: "Well-equipped physics, chemistry, and biology laboratories",
    },
    {
      icon: "💻",
      name: "Computer Lab",
      description: "Modern computer lab with high-speed internet connectivity",
    },
    {
      icon: "📚",
      name: "Library",
      description:
        "Extensive collection of books, journals, and digital resources",
    },
    {
      icon: "🎨",
      name: "Art Studio",
      description: "Creative space for art, craft, and cultural activities",
    },
    {
      icon: "⚽",
      name: "Sports Complex",
      description:
        "Indoor and outdoor sports facilities for physical development",
    },
    {
      icon: "🎭",
      name: "Auditorium",
      description:
        "Modern auditorium for events, seminars, and cultural programs",
    },
  ];

  return (
    <div>
      <Head>
        <title>Home | Pomkara Siddikur Rahman & Hakim High School</title>
        <meta
          name="description"
          content="Pomkara Siddikur Rahman & Hakim High School offers a comprehensive education with a focus on academic excellence and personal development. Learn more about our programs, faculty, and student life."
        />
        <meta
          name="keywords"
          content="school, education, academic excellence, Pomkara Siddikur Rahman & Hakim High School, faculty, student life"
        />
        <meta
          property="og:title"
          content="Pomkara Siddikur Rahman & Hakim High School - Home"
        />
        <meta
          property="og:description"
          content="Pomkara Siddikur Rahman & Hakim High School provides an engaging learning environment with dedicated faculty and a variety of programs. Discover more about our school."
        />
        <meta
          property="og:image"
          content="[URL to an image representing your school]"
        />
        <meta
          property="og:url"
          content="https://pomkara-high-school.netlify.app/components/faculty"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Pomkara Siddikur Rahman & Hakim High School - Home"
        />
        <meta
          name="twitter:description"
          content="Pomkara Siddikur Rahman & Hakim High School offers a dynamic education experience with a focus on student success and community involvement."
        />
        <meta
          name="twitter:image"
          content="[URL to an image representing your school]"
        />
      </Head>
      <div className="bg-gray-100">
        {/* Hero Section */}
        <section id="home" className="relative h-screen overflow-hidden">
          {/* Background Slides */}
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))}

          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
            <div className="max-w-4xl mx-auto px-4">
              <div className="animate-fadeInUp">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Pumkara Chiddikur Rahman & Hakim
                  </span>
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                  Higher Secondary School
                </h2>
                <p className="text-xl md:text-2xl mb-8 text-gray-200">
                  {slides[currentSlide].subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() =>
                      document
                        .getElementById("about")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Learn More
                  </button>
                  <button
                    onClick={() =>
                      document
                        .getElementById("contact")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="px-8 py-4 border-2 border-white hover:bg-white hover:text-gray-900 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>

          {/* Floating Animation Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-float" />
            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-float-delayed" />
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-pink-400 rounded-full animate-float" />
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-16 animate-fadeInUp">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                About Our <span className="text-blue-600">Institution</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Located in the Pumkara, B-para, Cumilla. our institution has
                been a beacon of educational excellence, nurturing young minds
                and shaping future leaders for over five decades.
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
                    knowledge, skills, and values necessary to become
                    responsible citizens and leaders of tomorrow, while
                    fostering creativity, critical thinking, and moral
                    character.
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

        {/* Features/Programs Section */}
        <section
          id="academics"
          className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
        >
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-16 animate-fadeInUp">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Academic <span className="text-blue-600">Programs</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our comprehensive academic programs are designed to provide
                students with a strong foundation and prepare them for future
                success.
              </p>
            </div>

            {/* Programs */}
            <div className="grid lg:grid-cols-3 gap-8 mb-20">
              {programs.map((program, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`h-2 bg-gradient-to-r ${program.color}`} />
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {program.level}
                    </h3>
                    <p className="text-blue-600 font-semibold mb-4">
                      {program.grades}
                    </p>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {program.description}
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800">
                        Key Subjects:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {program.subjects.map((subject, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Facilities */}
            <div>
              <h3 className="text-3xl font-bold text-center text-gray-800 mb-12 animate-fadeInUp">
                World-Class <span className="text-blue-600">Facilities</span>
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {facilities.map((facility, index) => (
                  <div
                    key={index}
                    className="group p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {facility.icon}
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      {facility.name}
                    </h4>
                    <p className="text-gray-600">{facility.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TopSection;
