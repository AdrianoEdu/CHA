"use client";

import SideBar from "../../components/sidebar/sidebar";

export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-off-white">
      <aside className="fixed inset-y-0 left-0 h-screen w-80 bg-gray-800 text-white">
        <SideBar />
      </aside>

      <main className="ml-80 min-h-screen bg-off-white p-6">{children}</main>
    </div>
  );
}
