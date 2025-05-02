import React from 'react'
import { Route, Routes } from 'react-router-dom'

function AdminRoutes() {
  return (
    <>
      <Routes>
        <Route path='/main/*' element={<MainPage />} >

        </Route>
      </Routes>

    </>
  )
}

export default AdminRoutes