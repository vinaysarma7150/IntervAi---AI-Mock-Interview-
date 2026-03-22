"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { usePathname } from "next/navigation"

import { SideBarOptions } from "@/services/constants"

export default function AppSidebar() {



  const path = usePathname();






  return (
    <Sidebar>

      <SidebarHeader className="flex items-center mt-5">
        <Image
          src="/logo-whitebg.png"
          alt="logo"
          width={200}
          height={100}
          className="w-[150px] dark:hidden"
        />
        <Image
          src="/logo.jpeg"
          alt="logo"
          width={200}
          height={100}
          className="hidden w-[150px] dark:block"
        />

        <Button asChild className="w-full mt-4">
          <Link href="/dashboard/create-interview">
            <Plus /> Create New Interview
          </Link>
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>

          <SidebarMenu>


{SideBarOptions.map((option, index) => {
  const Icon = option.icon

              return (
                <SidebarMenuItem key={index} className = 'p-1'  >
                  <SidebarMenuButton aschild="true" className={`p-5 ${path === option.path ? 'bg-blue-50 text-primary dark:bg-[#112b50] dark:text-blue-100' : ''}`}>
                    <Link href={option.path} className="flex items-center gap-2">
                      <Icon size={18} className={`text-[17px]  ${path == option.path && 'text-primary'}`}/>
                      <span className={`text-[17px] font-medium ${path == option.path && 'text-primary' }  `}>{option.name}</span>
                    </Link> 
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}





          </SidebarMenu>

        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />

    </Sidebar>
  )
}
