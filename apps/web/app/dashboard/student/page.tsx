"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../lib/api";

export default function StudentDashboard() {
	const { user } = useAuth();
	const [stats, setStats] = useState({
		totalTutors: 0,
		appointmentsSubmitted: 0,
		acceptedApplications: 0
	});
	const [loading, setLoading] = useState(true);

	const fetchDashboardData = async () => {
		if (!user?.id) return;
		
		setLoading(true);
		try {
			const applications = await api.enrollments.getByStudent() as any[];
			
			const acceptedApplications = applications.filter(
				(app: any) => app.status === 'accepted'
			);
			
			const uniqueTutors = new Set(applications.map((app: any) => app.tutorId));
			
			setStats({
				totalTutors: uniqueTutors.size,
				appointmentsSubmitted: applications.length,
				acceptedApplications: acceptedApplications.length
			});
		} catch (error) {
			console.error('Error fetching dashboard data:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDashboardData();
	}, [user]);

	// Listen for focus events to refresh when returning to the page
	useEffect(() => {
		const handleFocus = () => {
			fetchDashboardData();
		};
		window.addEventListener('focus', handleFocus);
		return () => window.removeEventListener('focus', handleFocus);
	}, [user]);

	// Auto-refresh stats every 30 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			fetchDashboardData();
		}, 30000);
		
		return () => clearInterval(interval);
	}, [user]);

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>
				
				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					{loading ? (
						<div className="col-span-3 text-center py-8">
							<div className="text-gray-500">Loading...</div>
						</div>
					) : (
						<>
							<div className="bg-white p-6 rounded-lg shadow">
								<div className="flex items-center">
									<div className="p-3 rounded-full bg-blue-100 text-blue-600">
										<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
										</svg>
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">Active Tutors</p>
										<p className="text-2xl font-bold text-gray-900">{stats.totalTutors}</p>
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
										<p className="text-sm font-medium text-gray-600">Accepted Applications</p>
										<p className="text-2xl font-bold text-gray-900">{stats.acceptedApplications}</p>
									</div>
								</div>
							</div>
						</>
					)}
				</div>

				{/* Quick Links */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<Link href="/find-tutors" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
						<h2 className="text-xl font-semibold mb-4 text-blue-600">Find Tutors</h2>
						<p className="text-gray-600">Search for tutors in your subjects</p>
					</Link>
					<Link href="/profile/change-password" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
						<h2 className="text-xl font-semibold mb-4 text-green-600">Change Password</h2>
						<p className="text-gray-600">Update your account password</p>
					</Link>
					<Link href="/profile" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
						<h2 className="text-xl font-semibold mb-4 text-indigo-600">My Profile</h2>
						<p className="text-gray-600">Update your personal information</p>
					</Link>

				</div>
			</div>
		</div>
	);
}