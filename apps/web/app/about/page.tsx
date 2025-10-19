import { Users, BookOpen, Award, Target } from "lucide-react";

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Section */}
			<section className="bg-gradient-to-r from-blue-600 to-orange-500 text-white py-20">
				<div className="container mx-auto px-4 text-center">
					<h1 className="text-4xl md:text-6xl font-bold mb-6">
						About TutorHub
					</h1>
					<p className="text-xl md:text-2xl max-w-3xl mx-auto">
						Connecting passionate learners with expert tutors to unlock academic potential
					</p>
				</div>
			</section>

			{/* Mission Section */}
			<section className="py-16">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-3xl font-bold mb-8">Our Mission</h2>
						<p className="text-lg text-gray-700 leading-relaxed">
							TutorHub is dedicated to making quality education accessible to everyone. 
							We believe that every student deserves personalized learning support, 
							and every expert deserves a platform to share their knowledge.
						</p>
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section className="py-16 bg-white">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center mb-12">Why Choose TutorHub?</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						<div className="text-center">
							<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<Users className="w-8 h-8 text-blue-600" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Expert Tutors</h3>
							<p className="text-gray-600">Qualified professionals ready to help you succeed</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<BookOpen className="w-8 h-8 text-orange-600" />
							</div>
							<h3 className="text-xl font-semibold mb-2">All Subjects</h3>
							<p className="text-gray-600">From math to languages, find help in any subject</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<Award className="w-8 h-8 text-green-600" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Proven Results</h3>
							<p className="text-gray-600">Track record of helping students achieve their goals</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<Target className="w-8 h-8 text-purple-600" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Personalized</h3>
							<p className="text-gray-600">Tailored learning experiences for every student</p>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 bg-gray-100">
				<div className="container mx-auto px-4">
					<div className="grid md:grid-cols-3 gap-8 text-center">
						<div>
							<div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
							<div className="text-gray-700">Active Tutors</div>
						</div>
						<div>
							<div className="text-4xl font-bold text-orange-500 mb-2">5000+</div>
							<div className="text-gray-700">Students Helped</div>
						</div>
						<div>
							<div className="text-4xl font-bold text-green-600 mb-2">50+</div>
							<div className="text-gray-700">Subjects Covered</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}