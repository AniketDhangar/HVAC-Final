import React, { Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Profile from '../Components/Auth/Profile'
import UserTable from '../Components/Admin/Components/Tabs/UserTable'
import AppointmentTable from '../Components/Admin/Components/Tabs/AppointmentTable'
import BlogsManagement from '../Components/Admin/Components/Tabs/BlogsManagement'
import ContactIssues from '../Components/Admin/Components/Tabs/ContactIssues'
import Dashboard from '../Components/Admin/Components/Tabs/Dashboard'
import ServiceManagement from '../Components/Admin/Components/Tabs/ServiceManagement'
// import MainPage from '../Components/Admin/Components/Pages/MainPage'
import ProtectedRoute from './ProtectedRoute'
import EngineersList from '../Components/Admin/Components/Tabs/EngineersList'
import MiniDrawer from '../Components/Admin/Components/Pages/MiniDrawer'

function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MiniDrawer />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        {/* <Route path="my-appointments" element={<AppointmentTable />} /> */}
        {/* <Route path="my-blogs" element={<BlogsManagement />} /> */}
        {/* <Route path="my-contacts" element={<ContactIssues />} /> */}
        {/* <Route path="my-services" element={<ServiceManagement />} /> */}
        {/* <Route path="my-clients" element={<UserTable />} /> */}
         {/* <Route path="my-engineers" element={<EngineersList />} /> */}
        
        {/* <Route path="my-profile" element={<Profile />} /> */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default AdminRoutes