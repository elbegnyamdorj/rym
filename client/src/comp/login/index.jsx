import React, { Component } from 'react';
import axiosInstance from '../axiosApi';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

// react-router-dom components
// @mui material components
import Card from '@mui/material/Card';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';

// @mui icons
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';
import MDAlert from 'components/MDAlert';

// Authentication layout components
import BasicLayout from 'layouts/authentication/components/BasicLayout';

// Images
import bgImage from 'assets/images/bg-sign-in-basic.jpeg';
// import bgImage from 'assets/images/wave.svg';
// import './login-style.css';
import jwt from 'jwt-decode';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = () => {
    setMessage('');
    try {
      setIsLoading(true);
      const response = axiosInstance
        .post('/token/obtain/', {
          email: email,
          password: password,
        })
        .then((response) => {
          if (response.status == 200) {
            setMessage('');
            axiosInstance.defaults.headers['Authorization'] =
              'JWT ' + response.data.access;
            const token = jwt(response.data.access);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user_id', token.user_id);
            localStorage.setItem('user_type_id', token.user_type_id_id);
            if (token.user_type_id_id === 1) {
              window.location.href = '/lesson';
            } else {
              window.location.href = '/home';
            }
            return response.data;
          }
        })
        .catch((error) => {
          if (error.response.status == 401) {
            setMessage('Нэвтрэх нэр эсвэл нууц үг буруу байна');
          }
        });
      setIsLoading(false);
    } catch (error) {
      console.log('error');
      throw error;
    }
  };
  const alertContent = () => (
    <MDTypography variant='body2' color='white'>
      {message}
    </MDTypography>
  );
  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant='gradient'
          bgColor='info'
          borderRadius='lg'
          coloredShadow='info'
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign='center'
        >
          <MDTypography variant='h4' fontWeight='medium' color='white' mt={1}>
            Нэвтрэх
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component='form' role='form'>
            <MDBox mb={2}>
              <MDInput
                type='email'
                label='Имэйл'
                fullWidth
                onChange={handleEmailChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type='password'
                label='Нууц үг'
                fullWidth
                onChange={handlePasswordChange}
              />
            </MDBox>
            <MDBox display='flex' alignItems='center' ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant='button'
                fontWeight='regular'
                color='text'
                onClick={handleSetRememberMe}
                sx={{ cursor: 'pointer', userSelect: 'none', ml: -1 }}
              >
                &nbsp;&nbsp;Санах
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant='gradient'
                color='info'
                fullWidth
                onClick={handleSubmit}
              >
                Нэвтрэх
              </MDButton>
              {message && (
                <MDAlert color='error' mt={1}>
                  {alertContent('error')}
                </MDAlert>
              )}
            </MDBox>
            <MDBox mt={3} mb={1} textAlign='center'>
              <MDTypography variant='button' color='text'>
                Шинээр бүртгэл үүсгэх?{' '}
                <MDTypography
                  component={Link}
                  to='/signup'
                  variant='button'
                  color='info'
                  fontWeight='medium'
                  textGradient
                >
                  Бүртгүүлэх
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
};

export default Login;
