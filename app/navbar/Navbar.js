'use client';

import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Link from 'next/link';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <AppBar className="navbar-container" position="static">
      <Container>
        <Toolbar className="navbar-content">
          <Typography className="navbar-title" variant="h6">
            Inventory Tracker
          </Typography>
          <div className="navbar-buttons">
            {user ? (
              <>
                <Button color="inherit" component={Link} href="/inventory">
                  Manage Inventory
                </Button>
                <Button color="inherit" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} href="/">
                  Home
                </Button>
                <Button color="inherit" component={Link} href="/register">
                  Register
                </Button>
                <Button color="inherit" component={Link} href="/login">
                  Log In
                </Button>
              </>
            )}
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
