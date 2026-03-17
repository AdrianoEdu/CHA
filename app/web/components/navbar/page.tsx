// Copyright (c) 2026-03-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export interface NavItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface NavbarProps {
  items: NavItem[];
  active?: string;
  onChange?: (item: NavItem) => void;
}

export function Navbar({ items, active, onChange }: NavbarProps) {
  return (
    <nav className="bg-off-white dark:bg-gray-800 rounded-2xl">
      <div className="container flex items-center justify-center p-6 mx-auto text-gray-600 capitalize dark:text-gray-300">
        {items.map((item) => {
          const isActive = active === item.value;

          return (
            <button
              key={item.value}
              onClick={() => onChange?.(item)}
              className={`mx-1.5 sm:mx-6 border-b-2 flex items-center gap-2
                ${
                  isActive
                    ? "text-gray-900 dark:text-gray-200 border-blue-500"
                    : "border-transparent hover:text-gray-900 dark:hover:text-gray-200 hover:border-blue-500"
                }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
