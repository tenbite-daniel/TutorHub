"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const emailParam = searchParams.get("email");
		if (emailParam) {
			setEmail(emailParam);
		}
	}, [searchParams]);

	const validatePassword = (password: string) => {
		const minLength = password.length >= 8;
		const hasUpperCase = /[A-Z]/.test(password);
		const hasLowerCase = /[a-z]/.test(password);
		const hasNumbers = /\d/.test(password);
		const hasSpecialChar = /[@$!%*?&]/.test(password);
		
		return minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");
		setMessage("");

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			setIsLoading(false);
			return;
		}

		if (!validatePassword(password)) {
			setError("Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character");
			setIsLoading(false);
			return;
		}

		try {
			const response = await fetch("http://localhost:3001/auth/reset-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password, confirmPassword }),
			});

			const data = await response.json();

			if (response.ok) {
				setMessage(data.message);
				setTimeout(() => {
					router.push("/auth/login");
				}, 2000);
			} else {
				setError(data.message || "Failed to reset password");
			}
		} catch (err) {
			setError("Network error. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<div className="mx-auto h-12 w-12 bg-orange-500 text-white rounded-lg flex items-center justify-center">
						<span className="text-xl font-bold">T</span>
					</div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Reset Password
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Enter your new password for {email}
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">
							New Password
						</label>
						<div className="mt-1 relative">
							<input
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
								placeholder="Enter new password"
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 pr-3 flex items-center"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? "👁️" : "👁️‍🗨️"}
							</button>
						</div>
					</div>

					<div>
						<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
							Confirm Password
						</label>
						<div className="mt-1 relative">
							<input
								id="confirmPassword"
								name="confirmPassword"
								type={showConfirmPassword ? "text" : "password"}
								required
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
								placeholder="Confirm new password"
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 pr-3 flex items-center"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							>
								{showConfirmPassword ? "👁️" : "👁️‍🗨️"}
							</button>
						</div>
					</div>

					<div className="text-xs text-gray-600">
						Password must contain:
						<ul className="list-disc list-inside mt-1">
							<li>At least 8 characters</li>
							<li>1 uppercase letter</li>
							<li>1 lowercase letter</li>
							<li>1 number</li>
							<li>1 special character (@$!%*?&)</li>
						</ul>
					</div>

					{error && (
						<div className="text-red-600 text-sm text-center">{error}</div>
					)}

					{message && (
						<div className="text-green-600 text-sm text-center">{message}</div>
					)}

					<div>
						<button
							type="submit"
							disabled={isLoading}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
						>
							{isLoading ? "Resetting..." : "Reset Password"}
						</button>
					</div>

					<div className="text-center">
						<Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-500">
							Back to login
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}