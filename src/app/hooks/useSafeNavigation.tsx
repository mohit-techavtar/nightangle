import { useNavigate } from "react-router";
import { useState, useCallback } from "react";
import { ErrorDialog } from "../components/ErrorBoundary";
import { toast } from "sonner";

export function useSafeNavigation() {
  const navigate = useNavigate();
  const [error, setError] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  const safeNavigate = useCallback(
    (path: string, options?: { replace?: boolean; state?: any }) => {
      try {
        // Validate the path
        if (!path || typeof path !== "string") {
          throw new Error("Invalid navigation path");
        }

        // Navigate
        navigate(path, options);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Navigation failed";
        setError({ show: true, message });
        toast.error("Navigation Error", {
          description: message,
        });
      }
    },
    [navigate]
  );

  const goBack = useCallback(() => {
    try {
      window.history.back();
    } catch (err) {
      toast.error("Cannot go back");
      navigate("/");
    }
  }, [navigate]);

  const goHome = useCallback(
    (userType: "admin" | "customer" = "customer") => {
      try {
        if (userType === "admin") {
          navigate("/admin");
        } else {
          navigate("/tenant");
        }
      } catch (err) {
        toast.error("Navigation failed");
        navigate("/");
      }
    },
    [navigate]
  );

  const closeError = useCallback(() => {
    setError({ show: false, message: "" });
  }, []);

  const ErrorComponent = error.show ? (
    <ErrorDialog
      isOpen={error.show}
      title="Navigation Error"
      message={error.message}
      onClose={closeError}
      onNavigateBack={goBack}
      onNavigateHome={() => goHome()}
    />
  ) : null;

  return {
    safeNavigate,
    goBack,
    goHome,
    ErrorComponent,
  };
}
