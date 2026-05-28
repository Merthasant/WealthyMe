import { setNavigate } from "@/lib/utils/navigate.utils";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NavigateSetter() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return null;
}
