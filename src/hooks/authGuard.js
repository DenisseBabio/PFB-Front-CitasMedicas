import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "./currentUser";
import { useEffect } from "react";

export function useAuthGuard(redirect) {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  useEffect(() => {
    if (!currentUser) {
      navigate(`/login${redirect ? "?redirect=" + redirect : ""}`);
    }
  }, [currentUser, navigate, redirect]);
}
