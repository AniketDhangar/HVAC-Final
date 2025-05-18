import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  Paper
} from '@mui/material';
import {
  Engineering as EngineerIcon,
  Speed as SpeedIcon,
  Security as CertificationIcon,
  LocationOn as LocationIcon,
  Timer as EmergencyIcon,
  ThumbUp as SatisfactionIcon
} from '@mui/icons-material';
import { Helmet } from 'react-helmet-async'; // Added for SEO

const features = [
  {
    icon: <EngineerIcon fontSize="large" color="primary" />,
    title: "Expert Technicians",
    description: "Our certified technicians have over 15 years of experience in AC repair and maintenance."
  },
  {
    icon: <SpeedIcon fontSize="large" color="primary" />,
    title: "24/7 Service",
    description: "We provide round-the-clock emergency AC repair services when you need them most."
  },
  {
    icon: <CertificationIcon fontSize="large" color="primary" />,
    title: "Licensed & Certified",
    description: "Fully licensed, bonded, and insured for your peace of mind."
  },
  {
    icon: <LocationIcon fontSize="large" color="primary" />,
    title: "Service Coverage",
    description: "Serving the entire metropolitan area and surrounding communities."
  },
  {
    icon: <EmergencyIcon fontSize="large" color="primary" />,
    title: "Fast Response",
    description: "Emergency response within 60 minutes for urgent AC problems."
  },
  {
    icon: <SatisfactionIcon fontSize="large" color="primary" />,
    title: "Satisfaction Guaranteed",
    description: "100% satisfaction guarantee on all our services and repairs."
  }
];

function About() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* SEO Metadata */}
      <Helmet>
        <title>About HVAC Experts - Trusted AC Repair Since 2005</title>
        <meta
          name="description"
          content="Learn about HVAC Experts, your trusted AC repair and maintenance provider with over 15 years of experience. Offering 24/7 emergency services, certified technicians, and 100% satisfaction guarantee."
        />
        <meta
          name="keywords"
          content="HVAC, AC repair, air conditioning services, expert technicians, 24/7 emergency service, licensed HVAC, HVAC Experts"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="About HVAC Experts - Trusted AC Repair Since 2005" />
        <meta
          property="og:description"
          content="Learn about HVAC Experts, your trusted AC repair and maintenance provider with over 15 years of experience. Offering 24/7 emergency services, certified technicians, and 100% satisfaction guarantee."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hvacexperts.com/about" />
        <meta property="og:image" content="https://hvacexperts.com/assets/hvac-about-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About HVAC Experts - Trusted AC Repair Since 2005" />
        <meta
          name="twitter:description"
          content="Learn about HVAC Experts, your trusted AC repair and maintenance provider with over 15 years of experience. Offering 24/7 emergency services, certified technicians, and 100% satisfaction guarantee."
        />
        <meta name="twitter:image" content="https://hvacexperts.com/assets/hvac-about-image.jpg" />
        <link rel="canonical" href="https://hvacexperts.com/about" />
      </Helmet>

      {/* Hero Section */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Your Trusted AC Repair Experts
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Keeping You Cool Since 2005
        </Typography>
      </Box>

      {/* Company Introduction */}
      <Paper elevation={3} sx={{ p: 4, mb: 8 }}>
        <Typography variant="body1" paragraph>
          Welcome to HVAC Experts, your premier destination for all air conditioning needs. 
          With over 15 years of experience, we've built our reputation on providing exceptional 
          AC repair, installation, and maintenance services to both residential and commercial clients.
        </Typography>
        <Typography variant="body1" paragraph>
          Our team of certified technicians is committed to delivering fast, reliable, and 
          cost-effective solutions for all your AC problems. We understand that a malfunctioning 
          AC system can be more than just uncomfortable – it can disrupt your daily life or business operations.
        </Typography>
      </Paper>

      {/* Services Grid */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography gutterBottom variant="h5" component="h2">
                  {feature.title}
                </Typography>
                <Typography>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Why Choose Us */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Why Choose Us?
        </Typography>
        <Grid container spacing={2} sx={{ maxWidth: '800px', margin: 'auto' }}>
          <Grid item xs={12} md={6} sx={{ textAlign: 'left' }}>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              • Professional and courteous service at competitive prices
            </Typography>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              • Advanced diagnostic equipment for accurate problem detection
            </Typography>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              • Genuine replacement parts with warranty
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: 'left' }}>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              • Transparent pricing with no hidden fees
            </Typography>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              • Scheduled maintenance programs to prevent future issues
            </Typography>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              • Emergency services available 24/7
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Contact Information */}
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom color="primary">
          Ready to Schedule Service?
        </Typography>
        <Typography variant="body1">
          Call us at: (555) 123-4567<br />
          Email: service@hvacexperts.com<br />
          Address: 123 Cooling Street, AC City, State 12345
        </Typography>
      </Paper>
    </Container>
  );
}

export default About;