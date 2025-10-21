"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, LogOut, Menu, X, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";

export default function Header() {
	const { user, logout, isLoading } = useAuth();
	const { toggle: toggleSidebar } = useSidebar();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const router = useRouter();

	const handleLogout = () => {
		logout();
		router.push("/");
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const query = formData.get("search");
		router.push(`/find-tutors?search=${query}`);
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-black backdrop-blur supports-[backdrop-filter]:bg-white/60">
			<div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
				<div className="flex items-center gap-3">
					{/* Hamburger Menu - Only show when logged in */}
					{user && (
						<button
							onClick={toggleSidebar}
							className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<Menu className="w-5 h-5" />
						</button>
					)}
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center gap-2 font-bold text-xl"
					>
						<div className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center">
							T
						</div>
						<span className="hidden sm:inline text-blue-700">
							TutorHub
						</span>
					</Link>
				</div>

				{/* Desktop Nav */}
				<nav className="hidden md:flex items-center gap-6">
					<Link
						href="/"
						className="text-sm font-medium hover:text-orange-500 transition-colors"
					>
						Home
					</Link>
					<Link
						href="/about"
						className="text-sm font-medium hover:text-orange-500 transition-colors"
					>
						About
					</Link>
					<Link
						href="/find-tutors"
						className="text-sm font-medium hover:text-orange-500 transition-colors"
					>
						Find Tutors
					</Link>
					<Link
						href="/contact"
						className="text-sm font-medium hover:text-orange-500 transition-colors"
					>
						Contact
					</Link>
				</nav>

				{/* Search Bar */}
				<form
					onSubmit={handleSearch}
					className="hidden lg:flex items-center gap-2 flex-1 max-w-xs mx-6"
				>
					<input
						type="text"
						name="search"
						placeholder="Search tutors..."
						className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
					/>
					<button
						type="submit"
						className="p-2 rounded-md hover:bg-gray-100 transition"
					>
						<Search className="w-4 h-4 text-gray-600" />
					</button>
				</form>

				{/* Auth Buttons */}
				<div className="flex items-center gap-3">
					{isLoading ? (
						<div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
					) : user ? (
						<>
							<div className="flex items-center gap-2">
								<div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center">
									<User className="w-4 h-4" />
								</div>
								<span className="hidden sm:inline text-sm font-medium">
									{user.firstName}
								</span>
							</div>
							<button
								onClick={handleLogout}
								className="text-sm px-3 py-1.5 rounded-md hover:bg-gray-100 transition"
							>
								Logout
							</button>
						</>
					) : (
						<>
							<Link
								href="/auth/login"
								className="hidden sm:inline"
							>
								<button className="border border-gray-300 text-sm px-3 py-1.5 rounded-md hover:bg-gray-100">
									Sign In
								</button>
							</Link>
							<Link href="/auth/sign-up">
								<button className="bg-orange-500 text-white text-sm px-3 py-1.5 rounded-md hover:bg-orange-600">
									Register
								</button>
							</Link>
						</>
					)}

					{/* Mobile Menu Button */}
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
					>
						{isMenuOpen ? (
							<X className="w-5 h-5" />
						) : (
							<Menu className="w-5 h-5" />
						)}
					</button>
				</div>
			</div>

			{/* Mobile Nav */}
			{isMenuOpen && (
				<div className="md:hidden border-t bg-white">
					<nav className="flex flex-col gap-2 p-4">
						<Link
							href="/"
							className="px-3 py-2 rounded-lg hover:bg-gray-100"
						>
							Home
						</Link>
						<Link
							href="/about"
							className="px-3 py-2 rounded-lg hover:bg-gray-100"
						>
							About
						</Link>
						<Link
							href="/find-tutors"
							className="px-3 py-2 rounded-lg hover:bg-gray-100"
						>
							Find Tutors
						</Link>
						<Link
							href="/contact"
							className="px-3 py-2 rounded-lg hover:bg-gray-100"
						>
							Contact
						</Link>
						{!user && (
							<Link
								href="/auth/login"
								className="px-3 py-2 rounded-lg hover:bg-gray-100"
							>
								Sign In
							</Link>
						)}
						{user && (
							<button
								onClick={handleLogout}
								className="px-3 py-2 rounded-lg hover:bg-gray-100 text-left"
							>
								Logout
							</button>
						)}
					</nav>
				</div>
			)}
		</header>
	);
}
