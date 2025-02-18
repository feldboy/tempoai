import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { ArrowRight, Users, Clock, BarChart2, Zap, Check } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      title: "Real-time Collaboration",
      description:
        "Collaborate with your team in real-time during planning sessions",
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-500" />,
      title: "Efficient Estimation",
      description:
        "Streamline your story point estimation process with intuitive tools",
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-blue-500" />,
      title: "Analytics & Insights",
      description: "Track estimation patterns and team velocity over time",
    },
  ];

  const benefits = [
    "Improve sprint planning accuracy",
    "Enhance team engagement",
    "Reduce meeting time",
    "Data-driven decisions",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                ScrumScope
              </span>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate(user ? "/" : "/signin")}
            >
              {user ? "Go to Dashboard" : "Sign In"}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        className="pt-32 pb-16 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Streamline Your Agile Estimation Process
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            ScrumScope helps agile teams make faster, more accurate story point
            estimates through collaborative planning poker sessions.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/signin")}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose ScrumScope?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-6 w-6 text-blue-500" />
                </div>
                <p className="font-medium">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-blue-500" />
            <span className="ml-2 font-semibold">ScrumScope</span>
          </div>
          <p>© 2024 ScrumScope. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
