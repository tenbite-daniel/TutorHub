export default function AdminDashboard() {
	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Users</h2>
						<p className="text-gray-600">Manage students and tutors</p>
					</div>
					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Sessions</h2>
						<p className="text-gray-600">Monitor tutoring sessions</p>
					</div>
					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Reports</h2>
						<p className="text-gray-600">View system analytics</p>
					</div>
					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Settings</h2>
						<p className="text-gray-600">System configuration</p>
					</div>
				</div>
			</div>
		</div>
	);
}