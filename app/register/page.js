'use client';

import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';

const FormContainer = styled(Box)(() => ({
  width: '100%',
  maxWidth: '400px',
  padding: '24px',
  borderRadius: '20px',
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledTextField = styled(TextField)(() => ({
  marginBottom: '20px',
  width: '100%',
}));

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registration successful');
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error registering:', error.message);
      alert('Registration failed. Please try again.');
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
              Register
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
              onClick={handleRegister}
              disabled={loading}
              sx={{ backgroundColor: '#95989c', fontSize: 20 }}
            >
              Register
            </Button>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
