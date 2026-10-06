"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { api } from "../../lib/api";

export default function ChangePasswordPage() {
	const [formData, setFormData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");

		try {
			await api.auth.changePassword(formData);
			setMessage("Password changed successfully");
			setFormData({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
		} catch (error: any) {
			setMessage(error.message || "Failed to change password");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
			<h1 className="text-2xl font-bold mb-6">Change Password</h1>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium mb-1">
						Current Password
					</label>
					<div className="relative">
						<input
							type={showCurrentPassword ? "text" : "password"}
							value={formData.currentPassword}
							onChange={(e) =>
								setFormData({
									...formData,
									currentPassword: e.target.value,
								})
							}
							className="w-full p-2 pr-10 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							required
						/>
						<button
							type="button"
							onClick={() => setShowCurrentPassword(!showCurrentPassword)}
							className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
							aria-label={showCurrentPassword ? "Hide password" : "Show password"}
						>
							{showCurrentPassword ? (
								<EyeOff className="w-5 h-5" />
							) : (
								<Eye className="w-5 h-5" />
							)}
						</button>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">
						New Password
					</label>
					<div className="relative">
						<input
							type={showNewPassword ? "text" : "password"}
							value={formData.newPassword}
							onChange={(e) =>
								setFormData({
									...formData,
									newPassword: e.target.value,
								})
							}
							className="w-full p-2 pr-10 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							required
							minLength={8}
						/>
						<button
							type="button"
							onClick={() => setShowNewPassword(!showNewPassword)}
							className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
							aria-label={showNewPassword ? "Hide password" : "Show password"}
						>
							{showNewPassword ? (
								<EyeOff className="w-5 h-5" />
							) : (
								<Eye className="w-5 h-5" />
							)}
						</button>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">
						Confirm New Password
					</label>
					<div className="relative">
						<input
							type={showConfirmPassword ? "text" : "password"}
							value={formData.confirmPassword}
							onChange={(e) =>
								setFormData({
									...formData,
									confirmPassword: e.target.value,
								})
							}
							className="w-full p-2 pr-10 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							required
							minLength={8}
						/>
						<button
							type="button"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
							aria-label={showConfirmPassword ? "Hide password" : "Show password"}
						>
							{showConfirmPassword ? (
								<EyeOff className="w-5 h-5" />
							) : (
								<Eye className="w-5 h-5" />
							)}
						</button>
					</div>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
				>
					{loading ? "Changing..." : "Change Password"}
				</button>
			</form>

			{message && (
				<div
					className={`mt-4 p-3 rounded-md ${message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
				>
					{message}
				</div>
			)}
		</div>
	);
}
