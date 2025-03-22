import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <div className="h-full">
      <main className="h-full">
        <Outlet />
      </main>
    </div>
  );
};
