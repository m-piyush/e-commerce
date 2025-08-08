import React from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
function BreadCrumb({ breadcrumbData }) {
    return (
        <Breadcrumb className="mb-2">
            <BreadcrumbList>
                {breadcrumbData.length > 0 && breadcrumbData.map((data, index) => {

                    return (
                        index !== breadcrumbData.length - 1 ?
                            <div key={index} className='flex items-center gap-2'>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={data.href}>
                                        {data.lable}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="mt-1"/>
                            </div>
                            :
                            <div key={index} className='flex items-center'>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={data.href}>
                                        {data.lable}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </div>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default BreadCrumb