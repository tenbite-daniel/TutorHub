"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		
		try {
			const response = await api.auth.login({
				email,
				password,
			});
			
			const { user } = response;
			login(user);
			
			if (user.role === 'student') {
				router.push('/dashboard/student');
			} else if (user.role === 'tutor') {
				router.push('/dashboard/tutor');
			} else if (user.role === 'admin') {
				router.push('/dashboard/admin');
			} else {
				router.push('/dashboard');
			}
		} catch (error: any) {
			alert(error.response?.data?.message || 'Login failed');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="text-center text-3xl font-bold text-gray-900">
						Sign in to your account
					</h2>
				</div>
				<form className="space-y-6" onSubmit={handleSubmit}>
					<div>
						<input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md"
							placeholder="Email"
						/>
					</div>
					<div>
						<input
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md"
							placeholder="Password"
						/>
					</div>
					<button
						type="submit"
						disabled={isLoading}
						className="w-full py-2 px-4 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
					>
						{isLoading ? "Signing in..." : "Sign in"}
					</button>
					<div className="text-center">
						<Link href="/auth/sign-up" className="text-orange-600 hover:text-orange-500">
							Don't have an account? Sign up
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}