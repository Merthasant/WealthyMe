import { Button } from "@/components/ui/button";
import { authLogout } from "@/lib/APIs/services/auth.service";
import { useAuthContext } from "@/provider/auth/auth.provider.hook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const { user, setUser, isLoading } = useAuthContext();

  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: () => authLogout(),
    onSuccess: () => {
      queryClient.clear();
      setUser(undefined);
      return <Navigate to={"/sign-in"} />;
    },
  });

  const logout = async () => {
    await mutate.mutateAsync();
  };

  console.log("in dashboard layout", { user, isLoading });
  if (isLoading) return <h1>Loading</h1>;
  if (!user) return <Navigate to={"/sign-in"} />;
  return (
    <section>
      <Button onClick={logout}>Logout</Button>
      <Outlet />
    </section>
  );
}
