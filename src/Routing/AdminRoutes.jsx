import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Profile from '../Components/Auth/Profile'
import UserTable from '../Components/Admin/Components/Tabs/UserTable'
import AppointmentTable from '../Components/Admin/Components/Tabs/AppointmentTable'
import BlogsManagement from '../Components/Admin/Components/Tabs/BlogsManagement'
import ContactIssues from '../Components/Admin/Components/Tabs/ContactIssues'
import Dashboard from '../Components/Admin/Components/Tabs/Dashboard'
import ServiceManagement from '../Components/Admin/Components/Tabs/ServiceManagement'
import MainPage from '../Components/Admin/Components/Pages/MainPage'



function AdminRoutes() {
  return (

    <Routes>
            <Route
                path="/main/*"
                element={
                    // <Suspense fallback={<h2>loading...</h2>}>
                    //     <ProtectedRoute role="admin">
                            <MainPage />
                    //     </ProtectedRoute>
                    // </Suspense>
                }
            >
                <Route path="my-appointments" element={<AppointmentTable />} />
                <Route path="my-blogs" element={<BlogsManagement />} />
                <Route path="my-contacts" element={<ContactIssues />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="my-services" element={<ServiceManagement />} />
                <Route path="my-clients" element={<UserTable />} />
                <Route path="my-profile" element={<Profile />} />
            </Route>
        </Routes>

  )
}

export default AdminRoutes