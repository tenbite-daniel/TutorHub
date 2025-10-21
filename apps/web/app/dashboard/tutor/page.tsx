"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export default function TutorDashboard() {
	const router = useRouter();
	const [hasProfile, setHasProfile] = useState<boolean | null>(null);
	const [stats, setStats] = useState({
		totalStudents: 0,
		appointmentsReceived: 0,
		totalReviews: 0,
	});

	useEffect(() => {
		const checkProfile = async () => {
			try {
				await api.tutorProfile.get();
				setHasProfile(true);
			} catch (error) {
				setHasProfile(false);
			}
		};
		checkProfile();

		// Mock data - replace with actual API calls
		setStats({
			totalStudents: 0,
			appointmentsReceived: 0,
			totalReviews: 0,
		});
	}, []);

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-7xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						Tutor Dashboard
					</h1>
					{hasProfile === false && (
						<button
							onClick={() =>
								router.push("/dashboard/tutor/profile")
							}
							className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
						>
							Complete Profile
						</button>
					)}
					{hasProfile === true && (
						<button
							onClick={() =>
								router.push("/dashboard/tutor/profile")
							}
							className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
						>
							View Profile
						</button>
					)}
				</div>

				{hasProfile === false && (
					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
						<p className="text-yellow-800">
							⚠️ Please complete your profile to start receiving
							student applications.
						</p>
					</div>
				)}

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-white p-6 rounded-lg shadow">
						<div className="flex items-center">
							<div className="p-3 rounded-full bg-blue-100 text-blue-600">
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
									/>
								</svg>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">
									Total Students
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{stats.totalStudents}
								</p>
							</div>
						</div>
					</div>
					<div className="bg-white p-6 rounded-lg shadow">
						<div className="flex items-center">
							<div className="p-3 rounded-full bg-green-100 text-green-600">
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">
									Appointments Received
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{stats.appointmentsReceived}
								</p>
							</div>
						</div>
					</div>
					<div className="bg-white p-6 rounded-lg shadow">
						<div className="flex items-center">
							<div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
									/>
								</svg>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">
									Total Reviews
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{stats.totalReviews}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Quick Links */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<Link
						href="/dashboard/tutor/students"
						className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
					>
						<h2 className="text-xl font-semibold mb-4 text-blue-600">
							My Students
						</h2>
						<p className="text-gray-600">
							Manage your student roster
						</p>
					</Link>
					<Link
						href="/dashboard/tutor/appointments"
						className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
					>
						<h2 className="text-xl font-semibold mb-4 text-orange-600">
							Appointments
						</h2>
						<p className="text-gray-600">
							Manage student appointment requests
						</p>
					</Link>
					<Link
						href="/dashboard/tutor/profile"
						className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
					>
						<h2 className="text-xl font-semibold mb-4 text-indigo-600">
							My Profile
						</h2>
						<p className="text-gray-600">
							Update your tutor profile
						</p>
					</Link>
					<Link
						href="/dashboard/tutor/reviews"
						className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
					>
						<h2 className="text-xl font-semibold mb-4 text-yellow-600">
							Reviews
						</h2>
						<p className="text-gray-600">
							View student reviews and feedback
						</p>
					</Link>
				</div>
			</div>
		</div>
	);
}
