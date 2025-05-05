import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EngineerDefaultPage from '../Components/Engineer/EngineerDefaultPage';
// import EngineerProfile from '../Components/Engineer/EngineerProfile';
import EngineerNavbar from '../Components/Engineer/EngineerNavbar';
import Profile from '../Components/Auth/Profile';

function EngineerRoutes() {
  return (
    <>
    <EngineerNavbar />
      <Routes>
        {/* <Route path="/engineer" element={<EngineerNavbar />}> */}
          <Route index path="defaultpage" element={<EngineerDefaultPage />} />
          <Route index path="profile" element={<Profile />} />
          <Route path="*" element={<div>Engineer Not Found</div>} />
        {/* </Route> */}
      </Routes>
    </>
  );
}

export default EngineerRoutes;