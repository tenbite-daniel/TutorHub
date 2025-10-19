"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center">
                T
              </div>
              <span className="font-bold text-xl">TutorHub</span>
            </div>
            <p className="text-gray-400 text-sm">
              Connecting students with qualified tutors for personalized learning experiences.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-orange-500 cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-orange-500 cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-orange-500 cursor-pointer" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-orange-500 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-orange-500">Home</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-orange-500">About</Link></li>
              <li><Link href="/find-tutors" className="text-gray-400 hover:text-orange-500">Find Tutors</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-orange-500">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">Online Tutoring</li>
              <li className="text-gray-400">In-Person Sessions</li>
              <li className="text-gray-400">Group Classes</li>
              <li className="text-gray-400">Test Preparation</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500" />
                <span className="text-gray-400">info@tutorhub.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span className="text-gray-400">123 Education St, Learning City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 TutorHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}