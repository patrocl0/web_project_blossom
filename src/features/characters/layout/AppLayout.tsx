import { Outlet } from "react-router";

export const AppLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* El Sidebar se inyectará desde CharactersPage */}
      <div className="w-1/3 border-r">
        <Outlet context={{ layout: "sidebar" }} />
      </div>
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet context={{ layout: "detail" }} />
      </main>
    </div>
  );
};
