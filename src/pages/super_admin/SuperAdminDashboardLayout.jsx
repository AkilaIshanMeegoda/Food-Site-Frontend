import React from 'react'
import { Outlet } from 'react-router'

const SuperAdminDashboardLayout = () => {
  return (
    <div>
        <Outlet />
    </div>
  )
}

export default SuperAdminDashboardLayout