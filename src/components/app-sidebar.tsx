'use client';

import * as React from 'react';

import { Session } from 'next-auth';

import {
  Book,
  CalendarCheck,
  House,
  HouseHeart,
  Languages,
  PieChart,
  Star,
  TreePine,
  User,
} from 'lucide-react';

import { NavOverview } from '@/components/nav-overview';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { NavManagement } from './nav-management';
import { NavSecondary } from './nav-secondary';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  overview: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: PieChart,
    },
    {
      name: 'Kuisioner',
      url: '/kuisioner',
      icon: Languages,
    },
    {
      name: 'Review',
      url: '/review',
      icon: Star,
    },
    {
      name: 'Booking',
      url: '/booking',
      icon: CalendarCheck,
    },
  ],
  management: [
    {
      name: 'Guesthouse',
      url: '/guesthouse',
      icon: HouseHeart,
    },
    {
      name: 'News Event',
      url: '/news-event',
      icon: Book,
    },
    {
      name: 'User Management',
      url: '/user-management',
      icon: User,
    },
  ],
  navSecondary: [
    {
      title: 'User Guesthouse',
      url: '/',
      icon: House,
    },
  ],
};

export function AppSidebar({
  session,
  ...props
}: { session: Session | null } & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      variant="inset"
      {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <TreePine className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Desa Bakas</span>
                  <span className="truncate text-xs">E-Goverment Project</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavOverview projects={data.overview} />
        <NavManagement projects={data.management} />
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
