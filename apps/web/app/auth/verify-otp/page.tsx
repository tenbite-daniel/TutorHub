"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOtpPage() {
	const [otp, setOtp] = useState("");
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const emailParam = searchParams.get("email");
		if (emailParam) {
			setEmail(emailParam);
		}
	}, [searchParams]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");
		setMessage("");

		try {
			const response = await fetch("http://localhost:3001/auth/verify-otp", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, otp }),
			});

			const data = await response.json();

			if (response.ok) {
				setMessage(data.message);
				setTimeout(() => {
					router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
				}, 1500);
			} else {
				setError(data.message || "Invalid OTP");
			}
		} catch (err) {
			setError("Network error. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleResendOtp = async () => {
		if (!email) return;
		
		try {
			const response = await fetch("http://localhost:3001/auth/forgot-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			const data = await response.json();
			if (response.ok) {
				setMessage("New OTP sent to your email");
				setError("");
			} else {
				setError(data.message || "Failed to resend OTP");
			}
		} catch (err) {
			setError("Network error. Please try again.");
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
						Verify OTP
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Enter the 6-digit code sent to {email}
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="otp" className="block text-sm font-medium text-gray-700">
							OTP Code
						</label>
						<input
							id="otp"
							name="otp"
							type="text"
							required
							maxLength={6}
							value={otp}
							onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
							className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-center text-2xl tracking-widest"
							placeholder="000000"
						/>
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
							disabled={isLoading || otp.length !== 6}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
						>
							{isLoading ? "Verifying..." : "Verify OTP"}
						</button>
					</div>

					<div className="text-center space-y-2">
						<button
							type="button"
							onClick={handleResendOtp}
							className="text-sm text-orange-600 hover:text-orange-500"
						>
							Resend OTP
						</button>
						<div>
							<Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-500">
								Back to login
							</Link>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}