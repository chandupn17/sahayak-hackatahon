import React from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  Check as CheckIcon,
  Star as StarIcon,
} from '@mui/icons-material';

const tiers = [
  {
    title: 'Basic Care',
    price: '5',
    description: 'Essential support for independent seniors',
    features: [
      'Basic Emergency Contact System',
      'Community Chat Access',
      'Religious Content (Limited)',
      'Basic Health Reminders',
      'Standard Support (9AM-5PM)',
    ],
    buttonText: 'Start Basic Care',
    buttonVariant: 'outlined',
  },
  {
    title: 'Premium Care',
    subheader: 'Most Popular',
    price: '10',
    description: 'Complete care package for active seniors',
    features: [
      'All Basic Features',
      '24/7 Emergency Support',
      'Priority Community Access',
      'Full Religious Content Library',
      'Advanced Health Tracking',
      'Video Call Support',
      'Family Member Access',
    ],
    buttonText: 'Get Premium Care',
    buttonVariant: 'contained',
  },
  {
    title: 'Family Plus',
    price: '15',
    description: 'Ultimate care for the whole family',
    features: [
      'All Premium Features',
      'Multiple Senior Profiles',
      'Family Dashboard',
      'Caregiver Support',
      'Customized Health Plans',
      'Professional Consultation',
      'Priority Technical Support',
      'Advanced Analytics',
    ],
    buttonText: 'Join Family Plus',
    buttonVariant: 'outlined',
  },
];

const Pricing = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography
          component="h1"
          variant="h2"
          color="primary"
          gutterBottom
          sx={{ fontWeight: 'bold', fontSize: { xs: '2.5rem', md: '3.5rem' } }}
        >
          Simple, Affordable Care
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}
        >
          Choose the perfect plan for your needs
        </Typography>
      </Box>

      <Grid container spacing={4} alignItems="flex-end">
        {tiers.map((tier) => (
          <Grid
            item
            key={tier.title}
            xs={12}
            sm={tier.title === 'Premium Care' ? 12 : 6}
            md={4}
          >
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
                ...(tier.title === 'Premium Care' && {
                  border: `2px solid ${theme.palette.primary.main}`,
                  boxShadow: theme.shadows[4],
                }),
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h3" align="center" sx={{ fontSize: '2rem' }}>
                    {tier.title}
                  </Typography>
                }
                subheader={
                  tier.subheader && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 1,
                        color: 'primary.main',
                      }}
                    >
                      <StarIcon />
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {tier.subheader}
                      </Typography>
                    </Box>
                  )
                }
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                sx={{
                  backgroundColor: tier.title === 'Premium Care' ? 'primary.light' : 'grey.50',
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'baseline',
                    mb: 2,
                  }}
                >
                  <Typography component="h2" variant="h3" color="text.primary">
                    ${tier.price}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    /mo
                  </Typography>
                </Box>
                <Typography
                  variant="subtitle1"
                  align="center"
                  color="text.secondary"
                  sx={{ fontStyle: 'italic', mb: 3 }}
                >
                  {tier.description}
                </Typography>
                <List sx={{ width: '100%' }}>
                  {tier.features.map((feature) => (
                    <ListItem key={feature} sx={{ py: 1 }}>
                      <ListItemIcon>
                        <CheckIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={feature}
                        primaryTypographyProps={{ fontSize: '1.1rem' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant={tier.buttonVariant}
                  color="primary"
                  size="large"
                  sx={{
                    fontSize: '1.1rem',
                    py: 1.5,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 2,
                    },
                  }}
                >
                  {tier.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={6} textAlign="center">
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
          All plans include a 14-day free trial. No credit card required.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Need help choosing? Call us at <strong>1-800-SAHAYAK</strong>
        </Typography>
      </Box>
    </Container>
  );
};

export default Pricing;
