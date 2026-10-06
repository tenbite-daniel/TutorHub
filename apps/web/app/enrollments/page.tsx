"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { api, ApiError } from "../lib/api";
import ConfirmationModal from "../components/ConfirmationModal";
import { Clock, CheckCircle, XCircle, User, FileText } from "lucide-react";

interface EnrollmentApplication {
	_id: string;
	studentId: {
		_id: string;
		firstName: string;
		lastName: string;
		email: string;
	};
	tutorId: string;
	subject: string;
	grade: string;
	preferredSchedule: string;
	goals: string;
	experience?: string;
	additionalNotes?: string;
	status: "pending" | "accepted" | "rejected";
	tutorResponse?: string;
	createdAt: string;
	updatedAt: string;
}

export default function EnrollmentsPage() {
	const { user } = useAuth();
	const toast = useToast();
	const [applications, setApplications] = useState<EnrollmentApplication[]>(
		[]
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [actionModal, setActionModal] = useState<{
		isOpen: boolean;
		applicationId: string;
		status: "accepted" | "rejected";
		studentName: string;
	} | null>(null);
	const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

	useEffect(() => {
		if (user) {
			fetchApplications();
		}
	}, [user]);

	const fetchApplications = async () => {
		try {
			setIsLoading(true);
			if (user?.role === "student") {
				const data = await api.enrollments.getByStudent();
				setApplications(data);
			} else if (user?.role === "tutor") {
				const data = await api.enrollments.getByTutor(user.id);
				setApplications(data.applications || data);
			}
		} catch (err) {
			if (err instanceof ApiError) {
				setError(err.message);
			} else {
				setError("Failed to load enrollments");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleStatusUpdate = async (
		applicationId: string,
		status: string,
		response?: string
	) => {
		setIsUpdatingStatus(true);
		try {
			await api.enrollments.update(applicationId, {
				status,
				tutorResponse: response,
			});
			fetchApplications();
			setActionModal(null);
			toast.success(
				status === "accepted"
					? "Application accepted successfully!"
					: "Application rejected."
			);
		} catch (err) {
			if (err instanceof ApiError) {
				toast.error(`Failed to update application: ${err.message}`);
			} else {
				toast.error("Failed to update application");
			}
		} finally {
			setIsUpdatingStatus(false);
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "accepted":
				return <CheckCircle className="w-5 h-5 text-green-500" />;
			case "rejected":
				return <XCircle className="w-5 h-5 text-red-500" />;
			default:
				return <Clock className="w-5 h-5 text-yellow-500" />;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "accepted":
				return "bg-green-50 text-green-700 border-green-200";
			case "rejected":
				return "bg-red-50 text-red-700 border-red-200";
			default:
				return "bg-yellow-50 text-yellow-700 border-yellow-200";
		}
	};

	if (isLoading) {
		return (
			<div className="p-6">
				<div className="animate-pulse space-y-4">
					<div className="h-8 bg-gray-200 rounded w-1/4"></div>
					<div className="space-y-3">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="h-32 bg-gray-200 rounded"
							></div>
						))}
					</div>
				</div>
			</div>
		);
	}

	const totalApplications = applications.length;
	const acceptedApplications = applications.filter(
		(app) => app.status === "accepted"
	).length;
	const rejectedApplications = applications.filter(
		(app) => app.status === "rejected"
	).length;
	const pendingApplications = applications.filter(
		(app) => app.status === "pending"
	).length;

	return (
		<div className="p-6">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900">
					{user?.role === "student"
						? "My Applications"
						: "Student Applications"}
				</h1>
				<p className="text-gray-600 mt-1">
					{user?.role === "student"
						? "Track your tutoring applications"
						: "Manage student enrollment requests"}
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
				<div className="bg-white p-4 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Total
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{totalApplications}
							</p>
						</div>
						<FileText className="w-8 h-8 text-blue-500" />
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Accepted
							</p>
							<p className="text-2xl font-bold text-green-600">
								{acceptedApplications}
							</p>
						</div>
						<CheckCircle className="w-8 h-8 text-green-500" />
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Rejected
							</p>
							<p className="text-2xl font-bold text-red-600">
								{rejectedApplications}
							</p>
						</div>
						<XCircle className="w-8 h-8 text-red-500" />
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Pending
							</p>
							<p className="text-2xl font-bold text-yellow-600">
								{pendingApplications}
							</p>
						</div>
						<Clock className="w-8 h-8 text-yellow-500" />
					</div>
				</div>
			</div>

			{error && (
				<div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
					{error}
				</div>
			)}

			{applications.length === 0 ? (
				<div className="text-center py-12">
					<User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No applications found
					</h3>
					<p className="text-gray-500">
						{user?.role === "student"
							? "You haven't submitted any applications yet."
							: "No students have applied to work with you yet."}
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{applications.map((application) => (
						<div
							key={application._id}
							className="bg-white border border-gray-200 rounded-lg p-6"
						>
							<div className="flex items-start justify-between mb-4">
								<div>
									<h3 className="text-lg font-semibold text-gray-900">
										{application.subject} -{" "}
										{application.grade}
									</h3>
									{user?.role === "tutor" && (
										<p className="text-gray-600">
											Student:{" "}
											{application.studentId.firstName}{" "}
											{application.studentId.lastName}
										</p>
									)}
								</div>
								<div
									className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(application.status)}`}
								>
									{getStatusIcon(application.status)}
									<span className="text-sm font-medium capitalize">
										{application.status}
									</span>
								</div>
							</div>

							<div className="grid md:grid-cols-2 gap-4 mb-4">
								<div>
									<h4 className="font-medium text-gray-900 mb-1">
										Preferred Schedule
									</h4>
									<p className="text-gray-600 text-sm">
										{application.preferredSchedule}
									</p>
								</div>
								<div>
									<h4 className="font-medium text-gray-900 mb-1">
										Learning Goals
									</h4>
									<p className="text-gray-600 text-sm">
										{application.goals}
									</p>
								</div>
							</div>

							{application.experience && (
								<div className="mb-4">
									<h4 className="font-medium text-gray-900 mb-1">
										Experience Level
									</h4>
									<p className="text-gray-600 text-sm">
										{application.experience}
									</p>
								</div>
							)}

							{application.additionalNotes && (
								<div className="mb-4">
									<h4 className="font-medium text-gray-900 mb-1">
										Additional Notes
									</h4>
									<p className="text-gray-600 text-sm">
										{application.additionalNotes}
									</p>
								</div>
							)}

							{application.tutorResponse && (
								<div className="mb-4 bg-gray-50 p-3 rounded">
									<h4 className="font-medium text-gray-900 mb-1">
										Tutor Response
									</h4>
									<p className="text-gray-600 text-sm">
										{application.tutorResponse}
									</p>
								</div>
							)}

							{user?.role === "tutor" &&
								application.status === "pending" && (
									<div className="flex gap-2 pt-4 border-t">
										<button
											onClick={() => {
												setActionModal({
													isOpen: true,
													applicationId: application._id,
													status: "accepted",
													studentName: `${application.studentId?.firstName || ""} ${application.studentId?.lastName || ""}`.trim() || "the student",
												});
											}}
											className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
										>
											Accept
										</button>
										<button
											onClick={() => {
												setActionModal({
													isOpen: true,
													applicationId: application._id,
													status: "rejected",
													studentName: `${application.studentId?.firstName || ""} ${application.studentId?.lastName || ""}`.trim() || "the student",
												});
											}}
											className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
										>
											Reject
										</button>
									</div>
								)}

							<div className="text-xs text-gray-500 mt-4">
								Applied on{" "}
								{new Date(
									application.createdAt
								).toLocaleDateString()}
							</div>
						</div>
					))}
				</div>
			)}

			{actionModal && (
				<ConfirmationModal
					isOpen={actionModal.isOpen}
					title={actionModal.status === "accepted" ? "Accept Application" : "Reject Application"}
					message={
						actionModal.status === "accepted"
							? `Are you sure you want to accept the enrollment application from ${actionModal.studentName}?`
							: `Are you sure you want to decline the enrollment application from ${actionModal.studentName}?`
					}
					confirmText={actionModal.status === "accepted" ? "Accept Application" : "Reject Application"}
					variant={actionModal.status === "accepted" ? "success" : "danger"}
					showInput={true}
					inputLabel="Note for Student (Optional)"
					inputPlaceholder="Add any schedule notes, instructions, or message for the student..."
					isLoading={isUpdatingStatus}
					onCancel={() => setActionModal(null)}
					onConfirm={(responseNote) => {
						handleStatusUpdate(actionModal.applicationId, actionModal.status, responseNote);
					}}
				/>
			)}
		</div>
	);
}
