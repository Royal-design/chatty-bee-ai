import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <div className="h-full">
      <main>
        <Outlet />
      </main>
    </div>
  );
};
