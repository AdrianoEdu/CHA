// Copyright (c) 2026-02-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Main() {
  const router = useRouter();

  useEffect(() => {
    router.push('/web/view/login');
  }, [router]);

  return null;
}
