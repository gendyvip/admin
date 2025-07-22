import * as React from "react";
import {
  IconAd,
  IconBuildingPavilion,
  IconCamera,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconHelp,
  IconPhotoEdit,
  IconReport,
  IconSearch,
  IconSettings,
  IconSpeakerphone,
  IconUsers,
  IconUserScan,
  IconUsersGroup,
  IconVaccine,
  IconVaccineBottle,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Function to get user data from localStorage
const getUserData = () => {
  try {
    const authStore = localStorage.getItem("auth-store");
    if (authStore) {
      const parsed = JSON.parse(authStore);
      const user = parsed.state?.user;
      if (user) {
        return {
          name: user.fullName || user.email?.split("@")[0] || "User",
          email: user.email || "user@example.com",
          avatar: "/avatars/default.jpg", // You can update this with actual avatar logic
        };
      }
    }
  } catch (error) {
    console.error("Error parsing auth store:", error);
  }

  // Fallback data if localStorage is not available or invalid
  return {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/default.jpg",
  };
};

const data = {
  user: getUserData(),
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Users",
      url: "/users",
      icon: IconUsersGroup,
    },
    {
      title: "OCR",
      url: "/ocr",
      icon: IconUserScan,
    },

    {
      title: "Ads Requests",
      url: "/ads-requests",
      icon: IconAd,
    },
    {
      title: "Contact",
      url: "/contact",
      icon: IconUsers,
    },
    {
      title: "Ads Creation",
      url: "/ads-creation",
      icon: IconPhotoEdit,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  Deals: [
    {
      name: "Drugs",
      url: "/drugs",
      icon: IconVaccine,
    },
    {
      name: "Deals",
      url: "/deals",
      icon: IconReport,
    },
  ],
  Pharmacies: [
    {
      name: "Phramcies",
      url: "/pharmacies",
      icon: IconBuildingPavilion,
    },
    {
      name: "Listed Pharmacies",
      url: "/listed-pharmacies",
      icon: IconSpeakerphone,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a
                href="https://dawaback.com/"
                className="flex items-center gap-2"
                target="_blank"
              >
                <img
                  src="https://dawaback.com/logo.svg"
                  alt="logo dawaback"
                  className="w-10 h-10 rounded-full object-contain"
                />
                <span className="text-base font-semibold">DawaBack</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.Deals} name="Deals" />
        <NavDocuments items={data.Pharmacies} name="Pharmacies" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
