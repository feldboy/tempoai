import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function SignInPage() {
  // Auto-redirect in development
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        return;
      }

      if (session?.user) {
        navigate("/");
      }
    };

    handleAuthRedirect();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  const { signIn } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await signIn();
    } catch (err) {
      console.error("Sign in failed:", err);
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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

        <div className="space-y-4">
          <Button
            onClick={handleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            disabled={isLoading}
          >
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5"
                />
                Sign in with Google
              </>
            )}
          </Button>
          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
