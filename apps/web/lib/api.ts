const API_BASE_URL =
	process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

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
	},
};
