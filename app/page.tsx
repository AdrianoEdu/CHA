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
import { useAuth } from "./web/providers/AuthProvider";

export default function Main() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    isAuthenticated();
  }, [router]);

  return null;
}
