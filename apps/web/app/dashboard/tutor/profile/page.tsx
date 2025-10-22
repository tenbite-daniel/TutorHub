"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";

interface TutorProfile {
	fullName: string;
	bio: string;
	experience: string;
	profileImage?: string;
	subjects: string[];
	grades: string[];
	certificates?: { subject: string; certificateUrl: string }[];
	availability?: string[];
	phoneNumber?: string;
	location?: string;
}

export default function TutorProfilePage() {
	const router = useRouter();
	const [profile, setProfile] = useState<TutorProfile | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [formData, setFormData] = useState<TutorProfile>({
		fullName: "",
		bio: "",
		experience: "",
		subjects: [],
		grades: [],
		certificates: [],
		availability: [],
		phoneNumber: "",
		location: "",
	});

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const data = await api.tutorProfile.get() as TutorProfile;
				setProfile(data);
				setFormData(data);
				setIsEditing(false);
			} catch (error) {
				setIsEditing(true);
			} finally {
				setLoading(false);
			}
		};
		fetchProfile();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		try {
			if (profile) {
				await api.tutorProfile.update(formData);
			} else {
				await api.tutorProfile.create(formData);
			}
			setProfile(formData);
			setIsEditing(false);
			alert("Profile saved successfully!");
			// Navigate back to dashboard after a short delay
			setTimeout(() => {
				router.push('/dashboard/tutor');
			}, 1500);
		} catch (error: any) {
			alert("Error saving profile: " + error.message);
		} finally {
			setSaving(false);
		}
	};

	const handleArrayInput = (
		field: "subjects" | "grades" | "availability",
		value: string
	) => {
		const items = value
			.split(",")
			.map((item) => item.trim())
			.filter((item) => item);
		setFormData((prev) => ({ ...prev, [field]: items }));
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-xl">Loading...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						{profile ? "My Profile" : "Complete Your Profile"}
					</h1>
					<div className="space-x-4">
						<button
							onClick={() => router.back()}
							className="px-4 py-2 text-gray-600 hover:text-gray-800"
						>
							Back
						</button>
						{profile && !isEditing && (
							<button
								onClick={() => setIsEditing(true)}
								className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
							>
								Edit Profile
							</button>
						)}
					</div>
				</div>

				{!isEditing && profile ? (
					<div className="bg-white rounded-lg shadow p-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div>
								<h3 className="text-lg font-semibold mb-4">
									Personal Information
								</h3>
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Full Name
										</label>
										<p className="mt-1 text-gray-900">
											{profile.fullName}
										</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Phone Number
										</label>
										<p className="mt-1 text-gray-900">
											{profile.phoneNumber ||
												"Not provided"}
										</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Location
										</label>
										<p className="mt-1 text-gray-900">
											{profile.location || "Not provided"}
										</p>
									</div>

								</div>
							</div>

							<div>
								<h3 className="text-lg font-semibold mb-4">
									Teaching Information
								</h3>
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Subjects
										</label>
										<p className="mt-1 text-gray-900">
											{profile.subjects.join(", ")}
										</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Grades
										</label>
										<p className="mt-1 text-gray-900">
											{profile.grades.join(", ")}
										</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Availability
										</label>
										<p className="mt-1 text-gray-900">
											{profile.availability?.join(", ") ||
												"Not set"}
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="mt-8">
							<h3 className="text-lg font-semibold mb-4">Bio</h3>
							<p className="text-gray-900 whitespace-pre-wrap">
								{profile.bio}
							</p>
						</div>

						<div className="mt-8">
							<h3 className="text-lg font-semibold mb-4">
								Experience
							</h3>
							<p className="text-gray-900 whitespace-pre-wrap">
								{profile.experience}
							</p>
						</div>
					</div>
				) : (
					<form
						onSubmit={handleSubmit}
						className="bg-white rounded-lg shadow p-8"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="space-y-6">
								<h3 className="text-lg font-semibold">
									Personal Information
								</h3>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Full Name *
									</label>
									<input
										type="text"
										required
										value={formData.fullName}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												fullName: e.target.value,
											}))
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Phone Number
									</label>
									<input
										type="tel"
										value={formData.phoneNumber || ""}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												phoneNumber: e.target.value,
											}))
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Location
									</label>
									<input
										type="text"
										value={formData.location || ""}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												location: e.target.value,
											}))
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>


							</div>

							<div className="space-y-6">
								<h3 className="text-lg font-semibold">
									Teaching Information
								</h3>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Subjects * (comma-separated)
									</label>
									<input
										type="text"
										required
										value={formData.subjects.join(", ")}
										onChange={(e) =>
											handleArrayInput(
												"subjects",
												e.target.value
											)
										}
										placeholder="Math, Science, English"
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Grades * (comma-separated)
									</label>
									<input
										type="text"
										required
										value={formData.grades.join(", ")}
										onChange={(e) =>
											handleArrayInput(
												"grades",
												e.target.value
											)
										}
										placeholder="K-12, College, Adult"
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Availability (comma-separated)
									</label>
									<input
										type="text"
										value={
											formData.availability?.join(", ") ||
											""
										}
										onChange={(e) =>
											handleArrayInput(
												"availability",
												e.target.value
											)
										}
										placeholder="Monday 9-5, Tuesday 10-6"
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
							</div>
						</div>

						<div className="mt-8 space-y-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Bio *
								</label>
								<textarea
									required
									rows={4}
									value={formData.bio}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											bio: e.target.value,
										}))
									}
									placeholder="Tell students about yourself, your teaching style, and what makes you a great tutor..."
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Experience *
								</label>
								<textarea
									required
									rows={4}
									value={formData.experience}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											experience: e.target.value,
										}))
									}
									placeholder="Describe your teaching experience, qualifications, and achievements..."
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>

						<div className="mt-8 flex justify-end space-x-4">
							{profile && (
								<button
									type="button"
									onClick={() => {
										setIsEditing(false);
										setFormData(profile);
									}}
									className="px-6 py-2 text-gray-600 hover:text-gray-800"
								>
									Cancel
								</button>
							)}
							<button
								type="submit"
								disabled={saving}
								className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
							>
								{saving
									? "Saving..."
									: profile
										? "Update Profile"
										: "Create Profile"}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
