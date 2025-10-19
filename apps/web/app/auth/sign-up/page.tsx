"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "../../../lib/api";

export default function SignUpPage() {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phoneNumber: "",
		password: "",
		confirmPassword: "",
		userType: "student",
		age: ""
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setFormData(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		
		if (formData.password !== formData.confirmPassword) {
			setError("Passwords don't match");
			return;
		}
		
		setIsLoading(true);
		
		try {
			if (formData.userType === "student") {
				await api.auth.registerStudent({
					firstName: formData.firstName,
					lastName: formData.lastName,
					email: formData.email,
					phoneNumber: formData.phoneNumber,
					password: formData.password,
					confirmPassword: formData.confirmPassword,
					age: parseInt(formData.age)
				});
			} else {
				await api.auth.registerTutor({
					firstName: formData.firstName,
					lastName: formData.lastName,
					email: formData.email,
					phoneNumber: formData.phoneNumber,
					password: formData.password,
					confirmPassword: formData.confirmPassword
				});
			}
			router.push("/dashboard");
		} catch (err) {
			if (err instanceof ApiError) {
				setError(err.message);
			} else {
				setError("An unexpected error occurred");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
			<div className="max-w-md w-full space-y-8">
				<div>
					<div className="mx-auto h-12 w-12 bg-orange-500 text-white rounded-lg flex items-center justify-center">
						<span className="text-xl font-bold">T</span>
					</div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Create your account
					</h2>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
							{error}
						</div>
					)}
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<input
								name="firstName"
								type="text"
								required
								value={formData.firstName}
								onChange={handleChange}
								placeholder="First Name"
								className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
							/>
							<input
								name="lastName"
								type="text"
								required
								value={formData.lastName}
								onChange={handleChange}
								placeholder="Last Name"
								className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
							/>
						</div>
						
						<input
							name="email"
							type="email"
							required
							value={formData.email}
							onChange={handleChange}
							placeholder="Email address"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
						/>

						<input
							name="phoneNumber"
							type="tel"
							required
							value={formData.phoneNumber}
							onChange={handleChange}
							placeholder="Phone number"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
						/>

						<select
							name="userType"
							value={formData.userType}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
						>
							<option value="student">Student</option>
							<option value="tutor">Tutor</option>
						</select>

						{formData.userType === "student" && (
							<input
								name="age"
								type="number"
								required
								min="5"
								max="100"
								value={formData.age}
								onChange={handleChange}
								placeholder="Age"
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
							/>
						)}

						<input
							name="password"
							type="password"
							required
							value={formData.password}
							onChange={handleChange}
							placeholder="Password"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
						/>

						<input
							name="confirmPassword"
							type="password"
							required
							value={formData.confirmPassword}
							onChange={handleChange}
							placeholder="Confirm Password"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
						/>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full py-2 px-4 text-white bg-orange-600 hover:bg-orange-700 rounded-md disabled:opacity-50"
					>
						{isLoading ? "Creating..." : "Create account"}
					</button>

					<div className="text-center">
						<Link href="/auth/login" className="text-orange-600 hover:text-orange-500">
							Already have an account? Sign in
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}