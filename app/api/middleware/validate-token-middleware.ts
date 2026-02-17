// Copyright (c) 2026-02-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { UnauthorizedException } from "../error/UnauthorizedException";

export async function authGuard(req: Request) {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("token")?.value;

  const headerToken = req.headers.get("authorization")?.replace("Bearer ", "");

  const token = cookieToken || headerToken;

  if (!token) throw new UnauthorizedException("Não autorizado");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    return {
      authorized: true,
      user: decoded,
    };
  } catch {
    throw new UnauthorizedException("Token inválido ou expirado");
  }
}
