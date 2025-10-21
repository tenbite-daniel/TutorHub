'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';

export default function TutorDashboard() {
	const router = useRouter();
	const [hasProfile, setHasProfile] = useState<boolean | null>(null);

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
	}, []);

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-7xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Tutor Dashboard</h1>
					{hasProfile === false && (
						<button
							onClick={() => router.push('/dashboard/tutor/profile')}
							className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
						>
							Complete Profile
						</button>
					)}
					{hasProfile === true && (
						<button
							onClick={() => router.push('/dashboard/tutor/profile')}
							className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
						>
							View Profile
						</button>
					)}
				</div>
				
				{hasProfile === false && (
					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
						<p className="text-yellow-800">
							⚠️ Please complete your profile to start receiving student applications.
						</p>
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">My Students</h2>
						<p className="text-gray-600">Manage your student roster</p>
					</div>
					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Schedule</h2>
						<p className="text-gray-600">View and manage your tutoring schedule</p>
					</div>
					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Earnings</h2>
						<p className="text-gray-600">Track your tutoring earnings</p>
					</div>
				</div>
			</div>
		</div>
	);
}