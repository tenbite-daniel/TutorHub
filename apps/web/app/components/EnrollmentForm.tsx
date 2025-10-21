"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api, ApiError } from "../lib/api";

interface Tutor {
  id: string;
  name: string;
  subjects: string[];
  grades: string[];
  hourlyRate?: number;
}

interface EnrollmentFormProps {
  tutor: Tutor;
  onClose: () => void;
}

export default function EnrollmentForm({ tutor, onClose }: EnrollmentFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: "",
    grade: "",
    preferredSchedule: "",
    goals: "",
    experience: "",
    additionalNotes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.enrollments.create({
        tutorId: tutor.id,
        studentId: user?.id || '',
        ...formData
      });
      alert('Application submitted successfully! The tutor will review your request.');
      onClose();
    } catch (error) {
      if (error instanceof ApiError) {
        alert(`Failed to submit application: ${error.message}`);
      } else {
        alert('An error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Apply to Enroll with {tutor.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <select
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Select a subject</option>
              {tutor.subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade Level *
            </label>
            <select
              required
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Select your grade</option>
              {tutor.grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Schedule *
            </label>
            <textarea
              required
              value={formData.preferredSchedule}
              onChange={(e) => setFormData({ ...formData, preferredSchedule: e.target.value })}
              placeholder="e.g., Weekdays after 4 PM, Weekends mornings"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learning Goals *
            </label>
            <textarea
              required
              value={formData.goals}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              placeholder="What do you hope to achieve with tutoring?"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Experience Level
            </label>
            <textarea
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              placeholder="Describe your current level in this subject"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              placeholder="Any additional information you'd like to share"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}