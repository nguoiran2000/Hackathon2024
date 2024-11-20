"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const router = useRouter();
    useEffect(() => {
      if (typeof window !== 'undefined') {
      if (!localStorage.getItem('email')) {
        router.push("/signin");
      }}
    }, []);

  return (
    <>{children}
    </>
  );
}
