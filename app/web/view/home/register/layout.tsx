// Copyright (c) 2026-03-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { Navbar, NavItem } from "@/app/web/components/navbar/page";
import { RegisterAction } from "@/app/web/constants/enum";
import { useRouter, usePathname } from "next/navigation";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (item: NavItem) => {
    const base = "/web/view/home/register";

    const routeMap = {
      [RegisterAction.General]: `${base}`,
      [RegisterAction.Bank]: `${base}/bank`,
      [RegisterAction.Costumer]: `${base}/customer`,
      [RegisterAction.Financial]: `${base}/financial`,
    };

    router.push(routeMap[item.value as RegisterAction]);
  };

  const getActive = (): RegisterAction => {
    if (pathname.includes("bank")) return RegisterAction.Bank;
    if (pathname.includes("customer")) return RegisterAction.Costumer;
    if (pathname.includes("financial")) return RegisterAction.Financial;
    return RegisterAction.General;
  };

  return (
    <div>
      <Navbar
        items={[
          { label: "Gerais", value: RegisterAction.General },
          { label: "Banco", value: RegisterAction.Bank },
          { label: "Cliente", value: RegisterAction.Costumer },
          { label: "Financeiro", value: RegisterAction.Financial },
        ]}
        active={getActive()}
        onChange={handleNavigation}
      />

      <div className="mt-6">{children}</div>
    </div>
  );
}
