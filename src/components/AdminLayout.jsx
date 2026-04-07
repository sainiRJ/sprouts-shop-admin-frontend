import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AdminTopBar } from "./AdminTopBar";

export function AdminLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminTopBar />
        <main className="flex-1 overflow-auto">
          <div className="p-5 pb-10 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

