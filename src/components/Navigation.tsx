"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "🤖 ChatBot", icon: "💬" },
    { href: "/register", label: "📝 Multi-Step Form", icon: "📋" },
    { href: "/register/simple", label: "⚡ Simple Form", icon: "📄" },
  ];

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🚀</span>
              <span className="text-xl font-bold text-gray-800">CodeRush 2025</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                  ${pathname === link.href
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}