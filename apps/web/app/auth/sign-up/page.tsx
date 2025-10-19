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

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
						</div>
					</div>
					
					<button
						type="button"
						onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/auth/google`}
						className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
					>
						<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
							<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
							<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
							<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
							<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
						</svg>
						Sign up with Google
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