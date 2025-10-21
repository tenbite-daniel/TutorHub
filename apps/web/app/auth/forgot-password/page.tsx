"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "../../lib/api";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");
		setMessage("");

		try {
			const data = await api.auth.forgotPassword({ email });
			setMessage(data.message || "OTP sent to your email");
			setTimeout(() => {
				router.push(
					`/auth/verify-otp?email=${encodeURIComponent(email)}`
				);
			}, 2000);
		} catch (err) {
			if (err instanceof ApiError) {
				setError(err.message);
			} else {
				setError("Network error. Please try again.");
			}
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
						Forgot your password?
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Enter your email address and we'll send you an OTP to
						reset your password.
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							Email address
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
							placeholder="Enter your email"
						/>
					</div>

					{error && (
						<div className="text-red-600 text-sm text-center">
							{error}
						</div>
					)}

					{message && (
						<div className="text-green-600 text-sm text-center">
							{message}
						</div>
					)}

					<div>
						<button
							type="submit"
							disabled={isLoading}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
						>
							{isLoading ? "Sending..." : "Send OTP"}
						</button>
					</div>

					<div className="text-center">
						<Link
							href="/auth/login"
							className="text-sm text-orange-600 hover:text-orange-500"
						>
							Back to login
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
