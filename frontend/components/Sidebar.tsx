"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Globe, ShieldAlert, HeartPulse, Network, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      disabled: false,
    },
    {
      name: "Hosted Zones",
      href: "/hosted-zones",
      icon: Globe,
      disabled: false,
    },
    {
      name: "Traffic Policies",
      href: "#",
      icon: ShieldAlert,
      disabled: true,
      badge: "Coming Soon",
    },
    {
      name: "Health Checks",
      href: "#",
      icon: HeartPulse,
      disabled: true,
      badge: "Coming Soon",
    },
    {
      name: "Resolver",
      href: "#",
      icon: Network,
      disabled: true,
      badge: "Coming Soon",
    },
  ];

  return (
    <aside className={cn("w-64 bg-white border-r border-[#eaeded] flex flex-col h-[calc(100vh-50px)]", className)}>
      <div className="p-4 border-b border-[#eaeded]">
        <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase">
          Route 53
        </h2>
      </div>

      <nav className="flex-1 py-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          if (item.disabled) {
            return (
              <div
                key={item.name}
                className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed group relative"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4.5 w-4.5 text-gray-300" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium border">
                    {item.badge}
                  </span>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-[3px] border-l-transparent transition-all",
                isActive && "aws-sidebar-item-active"
              )}
            >
              <Icon className={cn("h-4.5 w-4.5 text-gray-500", isActive && "text-[#0066cc]")} />
              <span className="flex-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#eaeded] bg-gray-50/50">
        <a
          href="https://aws.amazon.com/route53/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-blue-600 hover:underline"
        >
          <span>AWS Route 53 Documentation</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </aside>
  );
}
