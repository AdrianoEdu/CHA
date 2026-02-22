import Link from "next/link";
import { useAuth } from "../../providers/AuthProvider";

export default function SideBar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex flex-col w-64 h-full bg-gray-900 text-gray-300">
      {/* Logo / Título */}
      <div className="flex items-center h-16 px-6 border-b border-gray-800">
        <span className="text-lg font-bold text-white">Meu Sistema</span>
      </div>
      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        {/* Item */}
        <Link
          href="/web/view/home/dashboard"
          className="flex items-center px-3 py-2 rounded hover:bg-gray-800 hover:text-white transition"
        >
          📊 <span className="ml-3">Dashboard</span>
        </Link>
      </nav>
      {/* Rodapé */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="w-full px-3 py-2 bg-gray-800 rounded hover:bg-gray-700"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
