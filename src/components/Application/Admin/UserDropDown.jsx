import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import adminLogo from "../../../../public/assets/images/admin-logo.png"
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { IoShirtOutline } from 'react-icons/io5';
import { MdOutlineShoppingBag } from 'react-icons/md';
import LogoutButton from './LogoutButton';
function UserDropDown() {
    const auth = useSelector((store) => store.authStore.auth);

    return (
        <div><DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage src={adminLogo.src} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="me-5 w-44">
                <DropdownMenuLabel><p className='font-semibold'>
                    {auth?.name}
                </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="" className="cursor-pointer" >
                        <IoShirtOutline />
                        New Product
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="" className="cursor-pointer" >
                        <MdOutlineShoppingBag />
                        Orders
                    </Link>
                </DropdownMenuItem>
                <LogoutButton />

            </DropdownMenuContent>
        </DropdownMenu>
        </div>
    )
}

export default UserDropDown