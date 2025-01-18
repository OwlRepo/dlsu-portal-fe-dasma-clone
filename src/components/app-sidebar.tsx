'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // SidebarTrigger,
} from '@/components/ui/sidebar';
import Image from 'next/image';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: 'Reports',
    icon: FileText,
    href: '/reports',
  },
  {
    title: 'User Management',
    icon: Users,
    href: '/user-management',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];

export function AppSidebar() {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4 mb-4">
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/dlsu-logo-horizontal.png"
            alt="DLSU"
            width={165}
            height={100} // Keep this for optimization
            className="auto-height"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={cn(
                  'h-10 justify-start px-4 w-52 mx-auto',
                  pathname === item.href
                    ? 'text-[#00bc65] bg-[#ddf3ea] font-bold  hover:text-[#00573F] hover:bg-[#ddf3ea]'
                    : 'text-gray-600 hover:bg-gray-100',
                )}
              >
                <Link href={item.href} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
