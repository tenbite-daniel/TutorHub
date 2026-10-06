"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { api, API_BASE_URL } from "../lib/api";
import { User, Edit2, Save, X, BookOpen, KeyRound } from "lucide-react";

interface ProfileData {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	age?: number;
}

interface TutorProfileData {
	fullName: string;
	bio: string;
	experience: string;
	subjects: string[];
	grades: string[];
	availability?: string[];
	phoneNumber?: string;
	location?: string;
}

export default function ProfilePage() {
	const { user, login, isLoading: authLoading } = useAuth();
	const toast = useToast();
	const router = useRouter();

	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [tutorProfile, setTutorProfile] = useState<TutorProfileData | null>(null);

	const [profileData, setProfileData] = useState<ProfileData>({
		firstName: "",
		lastName: "",
		email: "",
		phoneNumber: "",
		age: undefined,
	});

	const [tutorData, setTutorData] = useState<TutorProfileData>({
		fullName: "",
		bio: "",
		experience: "",
		subjects: [],
		grades: [],
		availability: [],
		phoneNumber: "",
		location: "",
	});

	const [rawInputs, setRawInputs] = useState({
		subjects: "",
		grades: "",
		availability: "",
	});

	useEffect(() => {
		if (authLoading) return;

		if (!user) {
			router.push("/auth/login");
			return;
		}

		setProfileData({
			firstName: user.firstName || "",
			lastName: user.lastName || "",
			email: user.email || "",
			phoneNumber: (user as any).phoneNumber || "",
			age: (user as any).age,
		});

		// If user is a tutor, fetch their tutor profile
		if (user.role === "tutor") {
			const fetchTutorProfile = async () => {
				try {
					const data = (await api.tutorProfile.get()) as TutorProfileData;
					if (data) {
						setTutorProfile(data);
						setTutorData({
							fullName: data.fullName || `${user.firstName} ${user.lastName}`.trim(),
							bio: data.bio || "",
							experience: data.experience || "",
							subjects: data.subjects || [],
							grades: data.grades || [],
							availability: data.availability || [],
							phoneNumber: data.phoneNumber || (user as any).phoneNumber || "",
							location: data.location || "",
						});
						setRawInputs({
							subjects: data.subjects?.join(", ") || "",
							grades: data.grades?.join(", ") || "",
							availability: data.availability?.join(", ") || "",
						});
					} else {
						// No profile yet, initialize defaults
						setTutorData({
							fullName: `${user.firstName} ${user.lastName}`.trim(),
							bio: "",
							experience: "",
							subjects: [],
							grades: [],
							availability: [],
							phoneNumber: (user as any).phoneNumber || "",
							location: "",
						});
					}
				} catch (error) {
					// Tutor profile not yet created
					setTutorData({
						fullName: `${user.firstName} ${user.lastName}`.trim(),
						bio: "",
						experience: "",
						subjects: [],
						grades: [],
						availability: [],
						phoneNumber: (user as any).phoneNumber || "",
						location: "",
					});
				}
			};
			fetchTutorProfile();
		}
	}, [user, router, authLoading]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		if (name in profileData) {
			setProfileData((prev) => ({
				...prev,
				[name]: name === "age" ? (value ? parseInt(value) : undefined) : value,
			}));
		}
		if (name in tutorData) {
			setTutorData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const handleRawInputChange = (
		field: "subjects" | "grades" | "availability",
		value: string
	) => {
		setRawInputs((prev) => ({ ...prev, [field]: value }));
	};

	const handleSave = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		setIsLoading(true);

		try {
			// 1. Save base user account info
			const userRes = await fetch(`${API_BASE_URL}/auth/profile`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(profileData),
			});

			if (!userRes.ok) {
				const errorData = await userRes.json().catch(() => ({}));
				throw new Error(errorData.message || "Failed to update user profile");
			}

			const userData = await userRes.json();
			if (userData?.user) {
				login(userData.user);
			}

			// 2. If tutor, save tutor-specific profile info
			if (user?.role === "tutor") {
				const subjects = rawInputs.subjects
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean);
				const grades = rawInputs.grades
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean);
				const availability = rawInputs.availability
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean);

				if (subjects.length === 0) {
					toast.error("Please enter at least one subject");
					setIsLoading(false);
					return;
				}

				if (grades.length === 0) {
					toast.error("Please enter at least one grade");
					setIsLoading(false);
					return;
				}

				const tutorPayload: TutorProfileData = {
					fullName: `${profileData.firstName} ${profileData.lastName}`.trim(),
					bio: tutorData.bio || "",
					experience: tutorData.experience || "",
					subjects,
					grades,
					availability,
					phoneNumber: profileData.phoneNumber,
					location: tutorData.location || "",
				};

				if (tutorProfile) {
					await api.tutorProfile.update(tutorPayload);
				} else {
					await api.tutorProfile.create(tutorPayload);
				}

				setTutorProfile(tutorPayload);
				setTutorData(tutorPayload);
			}

			setIsEditing(false);
			toast.success("Profile updated successfully!");
		} catch (error: any) {
			console.error("Error updating profile:", error);
			toast.error(error.message || "Failed to update profile");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		if (user) {
			setProfileData({
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				email: user.email || "",
				phoneNumber: (user as any).phoneNumber || "",
				age: (user as any).age,
			});
		}
		if (tutorProfile) {
			setTutorData(tutorProfile);
			setRawInputs({
				subjects: tutorProfile.subjects?.join(", ") || "",
				grades: tutorProfile.grades?.join(", ") || "",
				availability: tutorProfile.availability?.join(", ") || "",
			});
		}
	};

	if (authLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-xl text-gray-500">Loading...</div>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	const isTutor = user.role === "tutor";

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				{/* Top bar */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-sm">
							<User className="w-6 h-6" />
						</div>
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
								My Profile
							</h1>
							<p className="text-sm text-gray-500 capitalize flex items-center gap-1.5">
								<span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
								{user.role} Account
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={() => router.push("/profile/change-password")}
							className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-xs"
						>
							<KeyRound className="w-4 h-4 text-gray-500" />
							Change Password
						</button>

						{!isEditing ? (
							<button
								type="button"
								onClick={() => {
									setIsEditing(true);
									if (tutorProfile) {
										setRawInputs({
											subjects: tutorProfile.subjects?.join(", ") || "",
											grades: tutorProfile.grades?.join(", ") || "",
											availability: tutorProfile.availability?.join(", ") || "",
										});
									}
								}}
								className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
							>
								<Edit2 className="w-4 h-4" />
								Edit Profile
							</button>
						) : (
							<div className="flex items-center gap-2">
								<button
									type="button"
									onClick={handleCancel}
									className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
								>
									<X className="w-4 h-4" />
									Cancel
								</button>
								<button
									type="button"
									onClick={() => handleSave()}
									disabled={isLoading}
									className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-xs"
								>
									<Save className="w-4 h-4" />
									{isLoading ? "Saving..." : "Save"}
								</button>
							</div>
						)}
					</div>
				</div>

				{/* Main Profile Card */}
				{!isEditing ? (
					<div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 sm:p-8 space-y-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{/* Personal Information */}
							<div>
								<h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
									Personal Information
								</h3>
								<dl className="space-y-4">
									<div>
										<dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
											Full Name
										</dt>
										<dd className="mt-1 text-base text-gray-900 font-medium">
											{`${profileData.firstName} ${profileData.lastName}`.trim() || "Not set"}
										</dd>
									</div>
									<div>
										<dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
											Email
										</dt>
										<dd className="mt-1 text-base text-gray-900 font-medium">
											{profileData.email}
										</dd>
									</div>
									<div>
										<dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
											Phone Number
										</dt>
										<dd className="mt-1 text-base text-gray-900 font-medium">
											{profileData.phoneNumber || "Not provided"}
										</dd>
									</div>
									{isTutor && (
										<div>
											<dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
												Location
											</dt>
											<dd className="mt-1 text-base text-gray-900 font-medium">
												{tutorData.location || "Not provided"}
											</dd>
										</div>
									)}
									{!isTutor && profileData.age !== undefined && (
										<div>
											<dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
												Age
											</dt>
											<dd className="mt-1 text-base text-gray-900 font-medium">
												{profileData.age}
											</dd>
										</div>
									)}
								</dl>
							</div>

							{/* Teaching Information (for Tutors) */}
							{isTutor && (
								<div>
									<h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
										<BookOpen className="w-5 h-5 text-orange-500" />
										Teaching Information
									</h3>
									<dl className="space-y-4">
										<div>
											<dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
												Subjects
											</dt>
											<dd className="mt-1 text-base text-gray-900 font-medium">
												{tutorProfile?.subjects && tutorProfile.subjects.length > 0
													? tutorProfile.subjects.join(", ")
													: "Not set"}
											</dd>
										</div>
										<div>
											<dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
												Grades
											</dt>
											<dd className="mt-1 text-base text-gray-900 font-medium">
												{tutorProfile?.grades && tutorProfile.grades.length > 0
													? tutorProfile.grades.join(", ")
													: "Not set"}
											</dd>
										</div>
										<div>
											<dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
												Availability
											</dt>
											<dd className="mt-1 text-base text-gray-900 font-medium">
												{tutorProfile?.availability && tutorProfile.availability.length > 0
													? tutorProfile.availability.join(", ")
													: "Not set"}
											</dd>
										</div>
									</dl>
								</div>
							)}
						</div>

						{/* Bio and Experience (for Tutors) */}
						{isTutor && (
							<div className="space-y-6 pt-4 border-t border-gray-100">
								<div>
									<h3 className="text-lg font-bold text-gray-900 mb-2">Bio</h3>
									<p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
										{tutorProfile?.bio || "No bio added yet. Click 'Edit Profile' to add one."}
									</p>
								</div>
								<div>
									<h3 className="text-lg font-bold text-gray-900 mb-2">Experience</h3>
									<p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
										{tutorProfile?.experience || "No experience details added yet."}
									</p>
								</div>
							</div>
						)}
					</div>
				) : (
					/* Edit Mode Form */
					<form
						onSubmit={handleSave}
						className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 sm:p-8 space-y-8"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{/* Personal Info Edit */}
							<div className="space-y-5">
								<h3 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">
									Personal Information
								</h3>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-xs font-medium text-gray-700 mb-1">
											First Name *
										</label>
										<input
											type="text"
											name="firstName"
											required
											value={profileData.firstName}
											onChange={handleInputChange}
											className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label className="block text-xs font-medium text-gray-700 mb-1">
											Last Name *
										</label>
										<input
											type="text"
											name="lastName"
											required
											value={profileData.lastName}
											onChange={handleInputChange}
											className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
								</div>

								<div>
									<label className="block text-xs font-medium text-gray-700 mb-1">
										Email
									</label>
									<input
										type="email"
										name="email"
										disabled
										value={profileData.email}
										className="w-full px-3 py-2 text-sm border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
									/>
									<span className="text-xs text-gray-400 mt-1 block">
										Email cannot be changed directly
									</span>
								</div>

								<div>
									<label className="block text-xs font-medium text-gray-700 mb-1">
										Phone Number
									</label>
									<input
										type="tel"
										name="phoneNumber"
										value={profileData.phoneNumber}
										onChange={handleInputChange}
										placeholder="+251..."
										className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								{isTutor && (
									<div>
										<label className="block text-xs font-medium text-gray-700 mb-1">
											Location
										</label>
										<input
											type="text"
											name="location"
											value={tutorData.location || ""}
											onChange={handleInputChange}
											placeholder="e.g. Addis Ababa, Bole"
											className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
								)}

								{!isTutor && (
									<div>
										<label className="block text-xs font-medium text-gray-700 mb-1">
											Age
										</label>
										<input
											type="number"
											name="age"
											min="1"
											max="120"
											value={profileData.age || ""}
											onChange={handleInputChange}
											className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
								)}
							</div>

							{/* Teaching Info Edit (for Tutors) */}
							{isTutor && (
								<div className="space-y-5">
									<h3 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
										<BookOpen className="w-5 h-5 text-orange-500" />
										Teaching Information
									</h3>

									<div>
										<label className="block text-xs font-medium text-gray-700 mb-1">
											Subjects * (comma-separated)
										</label>
										<input
											type="text"
											required
											value={rawInputs.subjects}
											onChange={(e) => handleRawInputChange("subjects", e.target.value)}
											placeholder="e.g. Math, Physics, English"
											className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>

									<div>
										<label className="block text-xs font-medium text-gray-700 mb-1">
											Grades * (comma-separated)
										</label>
										<input
											type="text"
											required
											value={rawInputs.grades}
											onChange={(e) => handleRawInputChange("grades", e.target.value)}
											placeholder="e.g. Grade 9-12, College, Adult"
											className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>

									<div>
										<label className="block text-xs font-medium text-gray-700 mb-1">
											Availability (comma-separated)
										</label>
										<input
											type="text"
											value={rawInputs.availability}
											onChange={(e) => handleRawInputChange("availability", e.target.value)}
											placeholder="e.g. Weekdays 4-7 PM, Saturday"
											className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
								</div>
							)}
						</div>

						{/* Bio and Experience Edit (for Tutors) */}
						{isTutor && (
							<div className="space-y-5 pt-4 border-t border-gray-100">
								<div>
									<label className="block text-xs font-medium text-gray-700 mb-1">
										Bio *
									</label>
									<textarea
										name="bio"
										rows={4}
										value={tutorData.bio}
										onChange={handleInputChange}
										placeholder="Tell students about yourself, your passion for teaching, and your teaching style..."
										className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
									/>
								</div>

								<div>
									<label className="block text-xs font-medium text-gray-700 mb-1">
										Teaching Experience *
									</label>
									<textarea
										name="experience"
										rows={4}
										value={tutorData.experience}
										onChange={handleInputChange}
										placeholder="Describe your background, years of experience, degrees, and past successes..."
										className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
									/>
								</div>
							</div>
						)}

						{/* Form Actions */}
						<div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
							<button
								type="button"
								onClick={handleCancel}
								className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isLoading}
								className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 shadow-xs"
							>
								{isLoading ? "Saving..." : "Save Profile"}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
