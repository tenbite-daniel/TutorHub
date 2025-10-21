"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  MessageCircle, 
  User, 
  LogOut,
  Users,
  FileText,
  Star,
  Activity,
  X,
  UserCheck
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function Sidebar() {
  const { user, logout, isLoading } = useAuth();
  const { isOpen, close } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  if (isLoading || !user) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getMenuItems = (): MenuItem[] => {
    const baseItems: MenuItem[] = [
      { label: "Dashboard", href: `/dashboard/${user.role}`, icon: LayoutDashboard },
    ];

    const roleSpecificItems: Record<string, MenuItem[]> = {
      student: [
        { label: "Find Tutor", href: "/find-tutors", icon: Search },
        { label: "Chat", href: "/chat", icon: MessageCircle },
      ],
      tutor: [
        { label: "Enrollments", href: "/enrollments", icon: UserCheck },
        { label: "Chat", href: "/chat", icon: MessageCircle },
      ],
      admin: [
        { label: "User Management", href: "/dashboard/admin/users", icon: Users },
        { label: "Report Management", href: "/dashboard/admin/reports", icon: FileText },
        { label: "Testimonial Management", href: "/dashboard/admin/testimonials", icon: Star },
        { label: "Admin Logs", href: "/dashboard/admin/logs", icon: Activity },
      ],
    };

    return [
      ...baseItems,
      ...(roleSpecificItems[user.role] || []),
      { label: "Profile", href: "/profile", icon: User },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <aside className={`fixed lg:static left-0 top-16 lg:top-0 h-[calc(100vh-4rem)] lg:h-full w-64 bg-white border-r border-gray-200 z-40 lg:z-auto lg:block transform lg:transform-none transition-transform duration-300 ease-in-out lg:transition-none ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-sm">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
            <button
              onClick={close}
              className="p-1 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== `/dashboard/${user.role}` && pathname.startsWith(item.href));
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-orange-50 text-orange-600 border border-orange-200"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}