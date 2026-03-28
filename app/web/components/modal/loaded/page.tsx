// Copyright (c) 2026-03-23
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export default function LoadingModal() {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-700 font-medium">Carregando...</p>
    </div>
  );
}
