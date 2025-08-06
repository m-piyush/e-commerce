import React from 'react'
import { RiLogoutCircleRLine } from "react-icons/ri";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { showToast } from '@/lib/showToast';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/reducer/authReducer';
import { useRouter } from 'next/navigation';
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute';

function LogoutButton() {
  const dispatch = useDispatch()
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const { data: logoutResposne } = await axios.post("/api/auth/logout")
      if (!logoutResposne) {
        throw new Error(logoutResposne.message)
      }
      showToast('success', logoutResposne.message)
      dispatch(logout());
      router.push(WEBSITE_LOGIN)
    } catch (error) {
      showToast('error', error.message)
    }
  }
  return (
    <DropdownMenuItem onClick={handleLogout}>
      <RiLogoutCircleRLine color='red' />
      logout
    </DropdownMenuItem>
  )
}

export default LogoutButton