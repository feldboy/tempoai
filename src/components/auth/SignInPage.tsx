import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";

export default function SignInPage() {
  // Auto-redirect in development
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  const { signIn } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Planning Poker</h2>
          <p className="mt-2 text-gray-600">Sign in to start estimating</p>
        </div>

        <Button
          onClick={signIn}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5"
          />
          Sign in with Google
        </Button>
      </motion.div>
    </div>
  );
}
