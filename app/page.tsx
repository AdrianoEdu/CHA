// Copyright (c) 2026-02-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authService } from "./web/services/authService/authService";
import { toast } from "react-toastify";
import { ActionEnum } from "./web/dto/auth.dto";

export default function Main() {
  const router = useRouter();

  const authValidate = async (): Promise<void> => {
    try {
      const result = await authService.isLogged({ type: ActionEnum.IsLogged });

      if (!result.name && !result.lastName) {
        router.push("/web/view/login");
        return;
      }

      router.push("/web/view/home");
      toast.success("Usuário Autenticado");
    } catch {
      router.push("/web/view/login");
    }
  };

  useEffect(() => {
    authValidate();
  }, [router]);

  return null;
}
