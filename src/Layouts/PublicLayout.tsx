import { useAppSelector } from "@/redux/store";
import { Navigate, Outlet } from "react-router-dom";

export const PublicLayout = () => {
  const { user, loading } = useAppSelector((state) => state.auth);

  //   if (loading) return <Loading />;
  if (user) return <Navigate to="/" />;

  return <Outlet />;
};
