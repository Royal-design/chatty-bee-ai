import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <main className="h-screen">
      <Outlet />
    </main>
  );
};
