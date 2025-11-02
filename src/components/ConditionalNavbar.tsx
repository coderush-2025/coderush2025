"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const ConditionalNavbar = () => {
  const pathname = usePathname();

  // Hide navbar on admin pages
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage) {
    return null;
  }

  return <Navbar />;
};

export default ConditionalNavbar;
