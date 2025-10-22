const API_BASE_URL =
	process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface TutorProfile {
	_id: string;
	userId: string;
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
	isVerified: boolean;
	createdAt: string;
	updatedAt: string;
}

interface EnrollmentApplication {
	_id: string;
	studentId: {
		_id: string;
		firstName: string;
		lastName: string;
		email: string;
	};
	tutorId: number;
	subject: string;
	grade: string;
	preferredSchedule: string;
	goals: string;
	experience?: string;
	additionalNotes?: string;
	status: 'pending' | 'accepted' | 'rejected';
	tutorResponse?: string;
	createdAt: string;
	updatedAt: string;
}

interface PaginatedEnrollments {
	applications: EnrollmentApplication[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export class ApiError extends Error {
	constructor(
		public status: number,
		message: string
	) {
		super(message);
		this.name = "ApiError";
	}
}

async function apiRequest<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const url = `${API_BASE_URL}${endpoint}`;

	const config: RequestInit = {
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
		credentials: "include",
		...options,
	};

	const response = await fetch(url, config);

	if (!response.ok) {
		const errorData = await response
			.json()
			.catch(() => ({ message: "An error occurred" }));
		throw new ApiError(
			response.status,
			errorData.message || "Request failed"
		);
	}

	return response.json();
}

export const api = {
	auth: {
		registerStudent: (data: {
			firstName: string;
			lastName: string;
			email: string;
			phoneNumber: string;
			password: string;
			confirmPassword: string;
			age: number;
		}) =>
			apiRequest("/auth/register/student", {
				method: "POST",
				body: JSON.stringify(data),
			}),

		registerTutor: (data: {
			firstName: string;
			lastName: string;
			email: string;
			phoneNumber: string;
			password: string;
			confirmPassword: string;
		}) =>
			apiRequest("/auth/register/tutor", {
				method: "POST",
				body: JSON.stringify(data),
			}),

		login: (data: { email: string; password: string }) =>
			apiRequest("/auth/login", {
				method: "POST",
				body: JSON.stringify(data),
			}),

		changePassword: (data: {
			currentPassword: string;
			newPassword: string;
			confirmPassword: string;
		}) =>
			apiRequest("/auth/change-password", {
				method: "POST",
				body: JSON.stringify(data),
			}),

		forgotPassword: (data: { email: string }) =>
			apiRequest("/auth/forgot-password", {
				method: "POST",
				body: JSON.stringify(data),
			}),

		verifyOtp: (data: { email: string; otp: string }) =>
			apiRequest("/auth/verify-otp", {
				method: "POST",
				body: JSON.stringify(data),
			}),

		resetPassword: (data: { email: string; password: string; confirmPassword: string }) =>
			apiRequest("/auth/reset-password", {
				method: "POST",
				body: JSON.stringify(data),
			}),
	},

	enrollments: {
		getByTutor: (tutorId: string, params?: {
			page?: number;
			limit?: number;
			status?: string;
		}) => {
			const searchParams = new URLSearchParams();
			if (params?.page) searchParams.set('page', params.page.toString());
			if (params?.limit) searchParams.set('limit', params.limit.toString());
			if (params?.status) searchParams.set('status', params.status);
			
			const query = searchParams.toString();
			return apiRequest(`/enrollment-applications/tutor/${tutorId}${query ? `?${query}` : ''}`);
		},

		create: (data: {
			tutorId: string;
			studentId: string;
			subject: string;
			grade: string;
			preferredSchedule: string;
			goals: string;
			experience?: string;
			additionalNotes?: string;
		}) =>
			apiRequest("/enrollment-applications", {
				method: "POST",
				body: JSON.stringify(data),
			}),

		update: (id: string, data: { status?: string; tutorResponse?: string }) =>
			apiRequest(`/enrollment-applications/${id}`, {
				method: "PATCH",
				body: JSON.stringify(data),
			}),
	},

	tutorProfile: {
		get: () => apiRequest('/tutor-profile'),
		getAll: (): Promise<TutorProfile[]> => apiRequest('/tutor-profile/all'),
		create: (data: any) =>
			apiRequest('/tutor-profile', {
				method: 'POST',
				body: JSON.stringify(data),
			}),
		update: (data: any) =>
			apiRequest('/tutor-profile', {
				method: 'PATCH',
				body: JSON.stringify(data),
			}),
	},
};
