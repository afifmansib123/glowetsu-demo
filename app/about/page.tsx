"use client";

import { useState, useEffect } from "react";
import { Users, Award, Globe, Heart } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
}

interface AboutUsData {
  heroTitle: string;
  heroSubtitle: string;
  storyTitle: string;
  storyParagraphs: string[];
  storyImage: string;
  teamMembers: TeamMember[];
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutUsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch("/api/content/about-us");
        if (response.ok) {
          const data = await response.json();
          setAboutData(data);
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const stats = [
    { icon: Users, label: "Happy Travelers", value: "50,000+" },
    { icon: Globe, label: "Destinations", value: "120+" },
    { icon: Award, label: "Awards Won", value: "25+" },
    { icon: Heart, label: "Years Experience", value: "15+" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* ADD THE STYLE TAG HERE - RIGHT AFTER THE OPENING <> */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap");

        * {
          font-family: "Orbitron", sans-serif !important;
        }

        .glowetsu-font {
          font-family: "Orbitron", sans-serif;
          letter-spacing: 0.3em;
          font-weight: 700;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          letter-spacing: 0.2em;
        }

        p,
        span,
        div {
          letter-spacing: 0.05em;
        }

        button {
          letter-spacing: 0.15em;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Hero Section */}
        <section className="relative h-[60vh] bg-black">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=1200)",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-70" />
          </div>
          <div className="relative h-full flex items-center justify-center text-center text-white">
            <div className="max-w-4xl px-4">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                {aboutData?.heroTitle || "About glowetsu"}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200">
                {aboutData?.heroSubtitle ||
                  "Creating unforgettable memories through authentic travel experiences since 2008"}
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  {aboutData?.storyTitle || "Our Story"}
                </h2>
                <div className="space-y-4 text-gray-300">
                  {aboutData?.storyParagraphs &&
                  aboutData.storyParagraphs.length > 0 ? (
                    aboutData.storyParagraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))
                  ) : (
                    <>
                      <p>
                        Founded in 2008 by a group of passionate travelers,
                        glowetsu was born from a simple belief: travel should
                        transform lives, not just provide vacations.
                      </p>
                      <p>
                        We started as a small team organizing adventure trips
                        for friends and family. Word spread quickly about our
                        attention to detail, authentic experiences, and
                        commitment to sustainable tourism.
                      </p>
                      <p>
                        Today, we're proud to have guided over 50,000 travelers
                        to more than 120 destinations worldwide, while
                        maintaining our core values of authenticity,
                        sustainability, and creating meaningful connections
                        between travelers and local communities.
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="relative">
                <img
                  src={
                    aboutData?.storyImage ||
                    "https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=600"
                  }
                  alt="Travel adventure"
                  className="rounded-lg shadow-xl hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </section>


        {/* Team Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-300">
                The passionate people behind your adventures
              </p>
            </div>

            {aboutData?.teamMembers && aboutData.teamMembers.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-8">
                {aboutData.teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="text-center bg-black/40 backdrop-blur-md p-8 rounded-xl border border-gray-600/30 hover:border-orange-300/50 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="relative w-48 h-48 mx-auto mb-4">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full border-4 border-orange-500/30"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {member.name}
                    </h3>
                    <p className="text-orange-400 font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-300">{member.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <p>No team members added yet.</p>
              </div>
            )}
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r text-white">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl mb-8">
              Join thousands of travelers who have discovered the world with us
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <a
                href="/tours"
                className="px-6 py-3 bg-orange-600 text-white hover:bg-orange-700 rounded-md transition-all duration-200 font-medium"
              >
                Browse Tours
              </a>
              <a
                href="/contact"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
