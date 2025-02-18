import { Suspense } from "react";
import {
  useRoutes,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./components/home";
import SignInPage from "./components/auth/SignInPage";
import MarketingLandingPage from "./components/LandingPage";
import LandingPage from "./components/planning-poker/LandingPage";
import { CreateGame } from "./components/planning-poker/CreateGame";
import { AuthProvider, useAuth } from "@/lib/auth";
import routes from "tempo-routes";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  if (!user)
    return <Navigate to="/signin" state={{ from: location }} replace />;

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<MarketingLandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/room/:roomId"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateGame
                onCreateGame={(name, votingSystem) =>
                  console.log(name, votingSystem)
                }
              />
            </ProtectedRoute>
          }
        />
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
