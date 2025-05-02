import React from 'react'
import ResponsiveDrawer from './ResponsiveDrawer'

import FloatingApp from './Pages/FloatingApp'
// import Routing from '../Routes/Routing'
import Footer from './Pages/Footer'
import CssBaseline from '@mui/material/CssBaseline';


// import Navbar from '../../../ClientSide/src/Components/Pages/Navbar';



function Files() {
    return (
        <>
            <CssBaseline />
            <ResponsiveDrawer />          
            <FloatingApp />
            <UserRoutes/>
            {/* <Footer /> */}
        </>
    )
}

export default Files