"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function StudentDashboard() {
	const [stats, setStats] = useState({
		totalCourses: 0,
		appointmentsSubmitted: 0,
		completedSessions: 0
	});

	useEffect(() => {
		// Mock data - replace with actual API calls
		setStats({
			totalCourses: 5,
			appointmentsSubmitted: 12,
			completedSessions: 8
		});
	}, []);

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>
				
				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-white p-6 rounded-lg shadow">
						<div className="flex items-center">
							<div className="p-3 rounded-full bg-blue-100 text-blue-600">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
								</svg>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Total Courses</p>
								<p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
							</div>
						</div>
					</div>
					<div className="bg-white p-6 rounded-lg shadow">
						<div className="flex items-center">
							<div className="p-3 rounded-full bg-green-100 text-green-600">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Appointments Submitted</p>
								<p className="text-2xl font-bold text-gray-900">{stats.appointmentsSubmitted}</p>
							</div>
						</div>
					</div>
					<div className="bg-white p-6 rounded-lg shadow">
						<div className="flex items-center">
							<div className="p-3 rounded-full bg-purple-100 text-purple-600">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Completed Sessions</p>
								<p className="text-2xl font-bold text-gray-900">{stats.completedSessions}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Quick Links */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<Link href="/courses" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
						<h2 className="text-xl font-semibold mb-4 text-blue-600">My Courses</h2>
						<p className="text-gray-600">View and manage your enrolled courses</p>
					</Link>
					<Link href="/tutors" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
						<h2 className="text-xl font-semibold mb-4 text-green-600">Find Tutors</h2>
						<p className="text-gray-600">Search for tutors in your subjects</p>
					</Link>
					<Link href="/sessions" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
						<h2 className="text-xl font-semibold mb-4 text-purple-600">My Sessions</h2>
						<p className="text-gray-600">View upcoming tutoring sessions</p>
					</Link>
					<Link href="/appointments" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
						<h2 className="text-xl font-semibold mb-4 text-orange-600">My Appointments</h2>
						<p className="text-gray-600">Manage your appointment requests</p>
					</Link>
					<Link href="/profile" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
						<h2 className="text-xl font-semibold mb-4 text-indigo-600">My Profile</h2>
						<p className="text-gray-600">Update your personal information</p>
					</Link>
					<Link href="/settings" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
						<h2 className="text-xl font-semibold mb-4 text-gray-600">Settings</h2>
						<p className="text-gray-600">Manage your account settings</p>
					</Link>
				</div>
			</div>
		</div>
	);
}