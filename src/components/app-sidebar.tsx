'use client';

import * as React from 'react';

import { House, Languages, PieChart, TreePine } from 'lucide-react';

import { NavProjects } from '@/components/nav-project';
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

import { NavSecondary } from './nav-secondary';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  projects: [
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
  ],
  navSecondary: [
    {
      title: 'Guesthouse',
      url: '/',
      icon: House,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
