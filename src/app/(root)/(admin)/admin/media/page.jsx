import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import UploadMedia from '@/components/Application/Admin/UploadMedia'
import { ADMIN_DASDBOARD } from '@/routes/AdminPanelRoute'
import React from 'react'
const breadcrumbData = [
    { href: ADMIN_DASDBOARD, lable: 'Home' },
    { href: "", lable: 'Media' },

]
function MediaPage() {

    return (
        <div>
            <BreadCrumb breadcrumbData={breadcrumbData}/>
            <h1>Test</h1>
            <UploadMedia/>
        </div>
    )
}

export default MediaPage