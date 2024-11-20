"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();
  useEffect(() => {
    localStorage.removeItem('email');
    router.push("/signin");
  }, [])
  return (
    <>
    </>
  );
}
