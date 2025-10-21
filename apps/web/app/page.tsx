"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, BookOpen, Users, Clock, CheckCircle, Plus, Minus } from "lucide-react";

const tutors = [
  { id: 1, name: "Sarah Johnson", subject: "Mathematics", rating: 4.9, image: "/api/placeholder/150/150", experience: "5+ years" },
  { id: 2, name: "Michael Chen", subject: "Physics", rating: 4.8, image: "/api/placeholder/150/150", experience: "7+ years" },
  { id: 3, name: "Emily Davis", subject: "Chemistry", rating: 4.9, image: "/api/placeholder/150/150", experience: "4+ years" },
  { id: 4, name: "David Wilson", subject: "Biology", rating: 4.7, image: "/api/placeholder/150/150", experience: "6+ years" },
];

const faqs = [
  { question: "How do I find the right tutor?", answer: "Use our search filters to find tutors by subject, experience, rating, and availability. You can also read reviews from other students." },
  { question: "What are the session rates?", answer: "Rates vary by tutor and subject. Most sessions range from $25-75 per hour. You can see each tutor's rate on their profile." },
  { question: "Can I have a trial session?", answer: "Yes! Many tutors offer a discounted first session so you can see if they're a good fit before committing." },
  { question: "Are sessions online or in-person?", answer: "We offer both! You can choose online sessions via video call or arrange in-person meetings with local tutors." },
];

export default function Home() {
  const [currentTutor, setCurrentTutor] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const nextTutor = () => setCurrentTutor((prev) => (prev + 1) % tutors.length);
  const prevTutor = () => setCurrentTutor((prev) => (prev - 1 + tutors.length) % tutors.length);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-orange-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find Your Perfect <span className="text-orange-500">Tutor</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with qualified tutors for personalized learning experiences. 
            Boost your grades and confidence with expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/find-tutors">
              <button className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
                Find Tutors
              </button>
            </Link>
            <Link href="/auth/sign-up">
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                Become a Tutor
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose TutorHub?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We connect students with the best tutors to help achieve academic success
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Tutors</h3>
              <p className="text-gray-600">Qualified professionals with proven track records in their subjects</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
              <p className="text-gray-600">Customized lessons tailored to your learning style and pace</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">Book sessions that fit your schedule, online or in-person</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
              <h3 className="font-semibold mb-2">Online Tutoring</h3>
              <p className="text-gray-600 text-sm">Interactive video sessions from anywhere</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
              <h3 className="font-semibold mb-2">In-Person Sessions</h3>
              <p className="text-gray-600 text-sm">Face-to-face learning with local tutors</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
              <h3 className="font-semibold mb-2">Group Classes</h3>
              <p className="text-gray-600 text-sm">Learn with peers in small groups</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
              <h3 className="font-semibold mb-2">Test Preparation</h3>
              <p className="text-gray-600 text-sm">Specialized prep for exams and tests</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tutors Slider */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Tutors</h2>
            <p className="text-gray-600">Meet some of our top-rated tutors</p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center justify-center">
              <button onClick={prevTutor} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 mr-4">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                {[0, 1, 2].map((offset) => {
                  const tutorIndex = (currentTutor + offset) % tutors.length;
                  const tutor = tutors[tutorIndex];
                  if (!tutor) return null;
                  return (
                    <div key={tutor.id} className="bg-white border rounded-lg p-6 text-center">
                      <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                      <h3 className="font-semibold text-lg">{tutor.name}</h3>
                      <p className="text-orange-500 font-medium">{tutor.subject}</p>
                      <div className="flex items-center justify-center mt-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm">{tutor.rating}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{tutor.experience}</p>
                    </div>
                  );
                })}
              </div>
              <button onClick={nextTutor} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 ml-4">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full bg-white p-4 rounded-lg shadow-sm flex items-center justify-between text-left hover:shadow-md transition"
                >
                  <span className="font-semibold">{faq.question}</span>
                  {openFaq === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
                {openFaq === index && (
                  <div className="bg-white px-4 pb-4 rounded-b-lg shadow-sm">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
