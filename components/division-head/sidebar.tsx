'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Calendar,
  LogOut,
  Building2,
  Settings,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { logout } from '@/app/actions/logout';

interface SidebarProps {
  user: {
    firstName: string;
    lastName: string;
    division: string | null;
    avatarUrl?: string | null;   // new
  };
}

const divisionLabels: Record<string, string> = {
  regulatory: 'Regulatory Division',
  laboratory: 'Integrated Laboratory Division',
  research: 'Research Division',
  field_ops: 'Field Operations Division',
  agri_marketing: 'Agribusiness and Marketing Assistance Division',
  engineering: 'Regional Agricultural Engineering Division',
  planning: 'Planning, Monitoring and Evaluation Division',
  info_section: 'Regional Agriculture & Fisheries Information Section',
  admin_finance: 'Administrative & Finance Division',
  procurement: 'Procurement of Goods and Infrastructure',
};

export function DivisionHeadSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const divisionName = user.division ? divisionLabels[user.division] || user.division : 'Division';
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  const navItems = [
    { href: '/division-head/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/division-head/travel-orders', label: 'Travel Orders', icon: FileText },
    { href: '/division-head/staff', label: 'Staff', icon: Users },
    { href: '/division-head/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/division-head/calendar', label: 'Travel Calendar', icon: Calendar },
  ];

  return (
    <Sidebar className="border-r border-border bg-background">
      <SidebarHeader className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Department_of_Agriculture_of_the_Philippines.svg/1280px-Department_of_Agriculture_of_the_Philippines.svg.png"
            alt="DA Logo"
            className="h-6 w-6"
          />
          <div>
            <h2 className="text-sm font-bold text-foreground">DA MIMAROPA</h2>
            <p className="text-xs text-muted-foreground">{divisionName}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar with profile link */}
          <Link href="/division-head/profile">
            <Avatar className="h-9 w-9 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 cursor-pointer hover:ring-2 ring-emerald-500 transition-all">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-muted-foreground">Division Head</p>
          </div>
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link href="/division-head/profile">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <form action={logout}>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}