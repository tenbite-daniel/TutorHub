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
						Sign in with Google
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