import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import Image from 'next/image';
import logoBlack from '../../../../public/assets/images/logo-black.png';
import logoWhite from '../../../../public/assets/images/logo-white.png';
import { ButtonLoading } from '../buttonLoading';
import { Button } from '@/components/ui/button';
import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { adminAppSidebarMenu } from '@/lib/adminSidebarMenu';
import { Collapsible } from '@radix-ui/react-collapsible';
import { CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Link from 'next/link';
const AppSidebar = () => {
  console.log("adminAppSidebarMenu", adminAppSidebarMenu);

  return (
    <Sidebar>
      <SidebarHeader className="border-b h-14 p-0">
        <div className='flex justify-between items-center px-4'>
          <Image src={logoBlack.src} height={logoWhite.height} width={logoBlack.width} className='block dark:hidden h-[50px] w-auto' alt="logo dark" />
          <Image src={logoWhite.src} height={logoBlack.height} width={logoWhite.width} className='hidden dark:hidden h-[50px] w-auto' alt="logo white" />
          <Button type="Button" size="icon" className="">
            <IoMdClose />
          </Button>

        </div>
      </SidebarHeader>

      <SidebarContent className="p-3">
        <SidebarMenu>
          {adminAppSidebarMenu.map((menu, index) => {
            console.log("menu",menu.url);
            
            return (
              <Collapsible key={index} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild className="font-semibold px-2 py-5 ">
                      <Link href={menu?.url}>
                        <menu.icon className="mr-2" />
                        <span>{menu.title}</span>
                        {menu.submenu && menu.submenu.length > 0 && (
                          <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </Link>
                    </SidebarMenuButton>

                  </CollapsibleTrigger>
                </SidebarMenuItem>

                {menu.submenu && menu.submenu.length > 0 && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {menu.submenu.map((submenuitem, submenuIndex) => (
                        <SidebarMenuSubItem key={submenuIndex}>
                          <SidebarMenuSubButton asChild className="px-2 py-5">
                            <Link href={submenuitem.url}>
                              {submenuitem.title}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </Collapsible>
            )
          })}

        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default AppSidebar
