import React, { createContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async'; // Added for SEO
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import AdminRoutes from './Routing/AdminRoutes';
import UserRoutes from './Routing/UserRoutes';
import EngineerRoutes from './Routing/EngineerRoutes';
import Unauthorized from './Components/Auth/Unauthorized';
import PrivateRoute from './Routing/PrivateRoute';
import NotFound from './Components/Auth/NotFound';
import Loader from './Components/Auth/Loader';

export const ReloadContext = createContext();

const App = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Structured data for Organization
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Freshair Technical Systems LLC",
    "url": "https://hvacexperts.com",
    "logo": "https://hvacexperts.com/assets/logo.png",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "(555) 123-4567",
        "contactType": "Customer Service",
        "email": "service@hvacexperts.com",
        "areaServed": ["Dubai", "Abu Dhabi", "Sharjah", "Al Ain"]
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Cooling Street",
      "addressLocality": "AC City",
      "addressRegion": "State",
      "postalCode": "12345"
    },
    "sameAs": [
      "https://www.facebook.com/freshairtechnical",
      "https://www.twitter.com/freshairtechnical",
      "https://www.linkedin.com/company/freshairtechnical"
    ]
  };

  if (loading) {
    return <Loader message="Please wait while the app loads..." aria-label="Application loading" />;
  }

  return (
    <HelmetProvider>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charset="UTF-8" />
        <meta name="theme-color" content="#1976d2" />
        <meta name="robots" content="noindex, nofollow" /> {/* Default for root, overridden by child routes */}
        <link rel="icon" href="/favicon.ico" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/not-found" element={<NotFound />} />

        <Route
          path="/main/*"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminRoutes />
            </PrivateRoute>
          }
        />
        <Route
          path="/engineer/*"
          element={
            <PrivateRoute allowedRoles={['engineer']}>
              <EngineerRoutes />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/*"
          element={
            <PrivateRoute allowedRoles={['user']}>
              <UserRoutes />
            </PrivateRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </HelmetProvider>
  );
};

export default App;