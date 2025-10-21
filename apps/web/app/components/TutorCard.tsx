"use client";

import { Star, MapPin, DollarSign } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import EnrollmentForm from "./EnrollmentForm";

interface Tutor {
  id: string;
  name: string;
  image?: string;
  subjects: string[];
  grades: string[];
  description: string;
  rating?: number;
  location?: string;
  hourlyRate?: number;
}

interface TutorCardProps {
  tutor: Tutor;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  const { user } = useAuth();
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6">
      <div className="flex items-start gap-4 mb-4">
        {tutor.image ? (
          <img 
            src={tutor.image} 
            alt={tutor.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600">
            {tutor.name.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{tutor.name}</h3>
          {tutor.rating && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{tutor.rating}</span>
            </div>
          )}
          {tutor.location && (
            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{tutor.location}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2">
          <span className="text-sm font-medium text-gray-700">Subjects:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {tutor.subjects.map(subject => (
              <span
                key={subject}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mb-3">
          <span className="text-sm font-medium text-gray-700">Grades:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {tutor.grades.map(grade => (
              <span
                key={grade}
                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
              >
                {grade}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {tutor.description}
      </p>

      <div className="flex items-center justify-between">
        {tutor.hourlyRate ? (
          <div className="flex items-center gap-1 text-gray-900 font-semibold">
            <DollarSign className="w-4 h-4" />
            <span>${tutor.hourlyRate}/hr</span>
          </div>
        ) : (
          <div className="text-gray-500 text-sm">Rate not specified</div>
        )}
        {user && user.role === 'student' ? (
          <button 
            onClick={() => setShowEnrollmentForm(true)}
            className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
          >
            Apply to Enroll
          </button>
        ) : (
          <button className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors">
            Learn More
          </button>
        )}
      </div>
      
      {showEnrollmentForm && (
        <EnrollmentForm 
          tutor={tutor} 
          onClose={() => setShowEnrollmentForm(false)} 
        />
      )}
    </div>
  );
}