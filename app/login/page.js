'use client';

import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
} from '@mui/material';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/inventory');
    } catch (error) {
      console.error('Error logging in: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="main-container">
      <Navbar />
      <Box className="content-container">
        <Container className="login-container">
          <Box className="form-container">
            <Typography variant="h4" gutterBottom align="center" color="black">
              Log In
            </Typography>
            <TextField
              label="Email"
              variant="outlined"
              className="login-textfield"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              className="login-textfield"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
              disabled={loading}
              sx={{ backgroundColor: '#95989c', fontSize: 20 }}
            >
              Log In
            </Button>
            <Box className="login-button-container">
              <Link href="/register" underline="none">
                <Button
                  variant="text"
                  sx={{ color: '#95989c', fontSize: 20 }}
                  fullWidth
                >
                  No account? Sign Up
                </Button>
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
