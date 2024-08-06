'use client';

import React from 'react';
import { Typography, Box } from '@mui/material';

const Footer = () => {
  return (
    <Box className="footer-box">
      <Typography variant="body2">
        {new Date().getFullYear()} Dana Altier All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
