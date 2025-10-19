export default function StudentDashboard() {
	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">My Courses</h2>
						<p className="text-gray-600">View and manage your enrolled courses</p>
					</div>
					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Find Tutors</h2>
						<p className="text-gray-600">Search for tutors in your subjects</p>
					</div>
					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">My Sessions</h2>
						<p className="text-gray-600">View upcoming tutoring sessions</p>
					</div>
				</div>
			</div>
		</div>
	);
}