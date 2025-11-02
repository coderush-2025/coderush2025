"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const ConditionalFooter = () => {
  const pathname = usePathname();

  // Hide footer on admin pages
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage) {
    return null;
  }

  return <Footer />;
};

export default ConditionalFooter;
