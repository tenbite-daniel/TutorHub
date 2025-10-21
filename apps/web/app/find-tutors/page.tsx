"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Filter, BookOpen } from "lucide-react";
import TutorCard from "../components/TutorCard";
import { api } from "../../lib/api";

type TutorProfile = {
	_id: string;
	userId: string;
	fullName: string;
	bio: string;
	experience: string;
	profileImage?: string;
	subjects: string[];
	grades: string[];
	certificates?: { subject: string; certificateUrl: string }[];
	hourlyRate?: number;
	availability?: string[];
	phoneNumber?: string;
	location?: string;
	isVerified: boolean;
	createdAt: string;
	updatedAt: string;
};

interface TutorCardProps {
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

export default function FindTutorsPage() {
	const [tutors, setTutors] = useState<TutorProfile[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedSubject, setSelectedSubject] = useState("");
	const [selectedGrade, setSelectedGrade] = useState("");
	const [showFilters, setShowFilters] = useState(false);

	useEffect(() => {
		const fetchTutors = async () => {
			try {
				setLoading(true);
				const data = await api.tutorProfile.getAll();
				setTutors(data);
			} catch (err) {
				setError("Failed to load tutors");
				console.error("Error fetching tutors:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchTutors();
	}, []);

	const allSubjects = useMemo(() => {
		return Array.from(
			new Set(tutors.flatMap((tutor) => tutor.subjects))
		).sort();
	}, [tutors]);

	const allGrades = useMemo(() => {
		return Array.from(
			new Set(tutors.flatMap((tutor) => tutor.grades))
		).sort();
	}, [tutors]);

	const filteredTutors = useMemo(() => {
		return tutors.filter((tutor) => {
			const matchesSearch =
				tutor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				tutor.subjects.some((subject) =>
					subject.toLowerCase().includes(searchTerm.toLowerCase())
				);

			const matchesSubject =
				!selectedSubject || tutor.subjects.includes(selectedSubject);
			const matchesGrade =
				!selectedGrade || tutor.grades.includes(selectedGrade);

			return matchesSearch && matchesSubject && matchesGrade;
		});
	}, [tutors, searchTerm, selectedSubject, selectedGrade]);

	const transformedTutors: TutorCardProps[] = filteredTutors.map((tutor) => ({
		id: tutor._id,
		name: tutor.fullName,
		image: tutor.profileImage || "/api/placeholder/150/150",
		subjects: tutor.subjects,
		grades: tutor.grades,
		description: tutor.bio,
		location: tutor.location,
		hourlyRate: tutor.hourlyRate,
	}));

	const clearFilters = () => {
		setSearchTerm("");
		setSelectedSubject("");
		setSelectedGrade("");
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Find Your Perfect Tutor
					</h1>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						Connect with qualified tutors who can help you achieve
						your academic goals
					</p>
				</div>

				<div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
					<div className="relative mb-4">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
						<input
							type="text"
							placeholder="Search by tutor name or subject..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
						/>
					</div>

					<button
						onClick={() => setShowFilters(!showFilters)}
						className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
					>
						<Filter className="w-4 h-4" />
						<span>Filters</span>
					</button>

					{showFilters && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Subject
								</label>
								<select
									value={selectedSubject}
									onChange={(e) =>
										setSelectedSubject(e.target.value)
									}
									className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
								>
									<option value="">All Subjects</option>
									{allSubjects.map((subject) => (
										<option key={subject} value={subject}>
											{subject}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Grade Level
								</label>
								<select
									value={selectedGrade}
									onChange={(e) =>
										setSelectedGrade(e.target.value)
									}
									className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
								>
									<option value="">All Grades</option>
									{allGrades.map((grade) => (
										<option key={grade} value={grade}>
											{grade}
										</option>
									))}
								</select>
							</div>

							<div className="flex items-end">
								<button
									onClick={clearFilters}
									className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
								>
									Clear Filters
								</button>
							</div>
						</div>
					)}
				</div>

				<div className="mb-6">
					{loading ? (
						<p className="text-gray-600">Loading tutors...</p>
					) : error ? (
						<p className="text-red-600">{error}</p>
					) : (
						<p className="text-gray-600">
							Showing {transformedTutors.length} tutor
							{transformedTutors.length !== 1 ? "s" : ""}
						</p>
					)}
				</div>

				{loading ? (
					<div className="text-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
						<p className="mt-4 text-gray-600">Loading tutors...</p>
					</div>
				) : error ? (
					<div className="text-center py-12">
						<BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							Error loading tutors
						</h3>
						<p className="text-gray-600 mb-4">{error}</p>
						<button
							onClick={() => window.location.reload()}
							className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
						>
							Retry
						</button>
					</div>
				) : transformedTutors.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{transformedTutors.map((tutor) => (
							<TutorCard key={tutor.id} tutor={tutor} />
						))}
					</div>
				) : (
					<div className="text-center py-12">
						<BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							No tutors found
						</h3>
						<p className="text-gray-600 mb-4">
							Try adjusting your search criteria
						</p>
						<button
							onClick={clearFilters}
							className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
						>
							Clear All Filters
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
