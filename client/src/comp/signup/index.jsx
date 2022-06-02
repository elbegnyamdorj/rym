import React, { useState } from 'react';
import './sign-up-style.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MAIN_URL } from '../../urls';
import jwt from 'jwt-decode';
import axiosInstance from '../axiosApi';
import Switch from 'react-switch';

// @mui material components
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';
import MDAlert from 'components/MDAlert';

// Authentication layout components
import CoverLayout from 'layouts/authentication/components/CoverLayout';

// Images
import bgImage from 'assets/images/bg-sign-up-cover.jpeg';
const Signup = () => {
  const [password, setPassword] = useState('');
  const [re_password, setRe_password] = useState('');
  const [email, setEmail] = useState('');
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [checked, setChecked] = useState(false);
  const [fError, setFError] = useState('');
  const [lError, setLError] = useState('');
  const [pError, setPError] = useState('');
  const [rpError, setRpError] = useState('');

  const [message, setMessage] = useState('');
  const switchChange = () => {
    setChecked(!checked);
  };
  const handleFirstNameChange = (e) => {
    // var letters = /^[А-Яа-яA-Za-z]+$/;
    // var input = e.target.value;
    // if (input.match(letters) || input.length === 0) {
    //   console.log(e.target.value);
    setFirst_name(e.target.value);
    //   setFError('');
    // } else {
    //   setFError('Зөвхөн үсэг оруулна уу');
    // }
  };
  const handleLastNameChange = (e) => {
    // var letters = /^[А-Яа-яA-Za-z]+$/;
    // var input = e.target.value;
    // if (input.match(letters) || input.length === 0) {
    setLast_name(e.target.value);
    //   setLError('');
    // } else {
    //   setLError('Зөвхөн үсэг оруулна уу');
    // }
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    if (e.target.value.length >= 8) {
      setPError('');
    } else {
      setPError('Нууц үг нь 8-аас дээш тэмдэгттэй байна.');
    }
    setPassword(e.target.value);
  };
  const handleRePasswordChange = (e) => {
    if (e.target.value === password) {
      setRpError('');
    } else {
      setRpError('Нууц үг тохирохгүй байна.');
    }
    setRe_password(e.target.value);
  };
  const handleSubmit = (e) => {
    var user_type_id;
    if (checked) {
      user_type_id = 1;
    } else {
      user_type_id = 2;
    }
    axios
      .post(`${MAIN_URL}/user/create/`, {
        password: password,
        email: email,
        first_name: first_name,
        last_name: last_name,
        user_type_id: user_type_id,
      })
      .then((res) => {
        if (
          res.data.status === 'success' ||
          res.status === 201 ||
          res.status === 200
        ) {
          setMessage('success');
          clearData();
          window.location.href = '/login';
        }
      })
      .catch(function (error) {
        var msg = '';
        for (const [key, value] of Object.entries(error.response.data)) {
          msg = msg + ` ${key}: ${value[0]} \r\n`;
        }
      });
    e.preventDefault();
  };
  const clearData = () => {
    setPassword('');
    setRe_password('');
    setEmail('');
    setFirst_name('');
    setLast_name('');
    setChecked(false);
    setFError('');
    setLError('');
    setPError('');
    setRpError('');
  };
  const alertContent = (name) => (
    <MDTypography variant='body2' color='white'>
      Амжилттай бүртгүүллээ
    </MDTypography>
  );
  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant='gradient'
          bgColor='info'
          borderRadius='lg'
          coloredShadow='success'
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign='center'
        >
          <MDTypography variant='h4' fontWeight='medium' color='white' mt={1}>
            Бүртгүүлэх
          </MDTypography>
          <MDTypography display='block' variant='button' color='white' my={1}>
            Сургуулийн имэйл хаягаа ашиглан бүртгүүлнэ үү
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component='form' role='form'>
            <MDBox mb={2} display='flex'>
              <MDInput
                type='text'
                label='Овог'
                onChange={handleFirstNameChange}
                variant='standard'
                fullWidth
              />

              <MDInput
                type='text'
                label='Нэр'
                onChange={handleLastNameChange}
                variant='standard'
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type='email'
                label='Имэйл'
                onChange={handleEmailChange}
                variant='standard'
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type='password'
                label='Нууц үг'
                onChange={handlePasswordChange}
                helperText={pError}
                error={pError ? true : false}
                variant='standard'
                fullWidth
              />
            </MDBox>
            <MDBox display='flex' alignItems='center' ml={-1}>
              <Checkbox onChange={switchChange} />
              <MDTypography
                variant='button'
                fontWeight='regular'
                color='text'
                sx={{ cursor: 'pointer', userSelect: 'none', ml: -1 }}
              >
                Багшаар бүртгүүлэх
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant='gradient'
                color='info'
                fullWidth
                onClick={handleSubmit}
              >
                Бүртгүүлэх
              </MDButton>
              {message && (
                <MDAlert color='success' mt={1} dismissible>
                  {alertContent('success')}
                </MDAlert>
              )}
            </MDBox>
            <MDBox mt={3} mb={1} textAlign='center'>
              <MDTypography variant='button' color='text'>
                Бүртгэлтэй юу?{'  '}
                <MDTypography
                  component={Link}
                  to='/login'
                  variant='button'
                  color='info'
                  fontWeight='medium'
                  textGradient
                >
                  Нэвтрэх
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
    // <form onSubmit={handleSubmit}>
    //   <div class='containers'>
    //     <div class='garchig'>БҮРТГҮҮЛЭХ</div>
    //     <div className='row'>
    //       <div className='col-6'>
    //         <div class='form-group'>
    //           <label for='exampleInputEmail1'>Овог</label>
    //           <input
    //             name='last_name'
    //             type='text'
    //             className='form-control input-box'
    //             aria-describedby='emailHelp'
    //             placeholder='Овог'
    //             value={last_name}
    //             onChange={handleLastNameChange}
    //           />
    //           {lError && <small className='text-danger'>{lError}</small>}
    //         </div>
    //       </div>
    //       <div className='col-6'>
    //         <div class='form-group'>
    //           <label for='exampleInputEmail1'>Нэр</label>
    //           <input
    //             type='text'
    //             name='first_name'
    //             className='form-control input-box'
    //             aria-describedby='emailHelp'
    //             placeholder='Нэр'
    //             value={first_name}
    //             onChange={handleFirstNameChange}
    //           />
    //           {fError && <small className='text-danger'>{fError}</small>}
    //         </div>
    //       </div>
    //       <div className='col-12'>
    //         <div class='form-group'>
    //           <label for='exampleInputEmail1'>Имейл хаяг</label>
    //           <input
    //             type='email'
    //             name='email'
    //             className='form-control input-box'
    //             aria-describedby='emailHelp'
    //             placeholder='Имейл хаяг'
    //             value={email}
    //             onChange={handleEmailChange}
    //           />
    //         </div>
    //       </div>
    //       <label>
    //         <span>Багшын хаяг үүсгэх</span>
    //         <Switch onChange={switchChange} checked={checked} />
    //       </label>
    //       <div className='col-6'>
    //         <div class='form-group'>
    //           <label for='exampleInputEmail1'>Нууц үг</label>
    //           <input
    //             type='password'
    //             name='password'
    //             className='form-control input-box'
    //             placeholder='Нууц үг'
    //             value={password}
    //             onChange={handlePasswordChange}
    //           />
    //           {pError && <small className='text-danger'>{pError}</small>}
    //         </div>
    //       </div>
    //       <div className='col-6'>
    //         <div class='form-group'>
    //           <label for='exampleInputEmail1'>Давтан оруулна уу</label>
    //           <input
    //             type='password'
    //             name='re_password'
    //             className='form-control input-box'
    //             placeholder='Нууц үг'
    //             value={re_password}
    //             onChange={handleRePasswordChange}
    //           />
    //           {rpError && <small className='text-danger'>{rpError}</small>}
    //         </div>
    //       </div>
    //     </div>

    //     <button type='submit' className='button btn-primary' value='submit'>
    //       Бүртгүүлэх
    //     </button>
    //     <Link to='/login'>
    //       <button type='button' className='btn-light'>
    //         Нэвтрэх
    //       </button>
    //     </Link>
    //   </div>
    // </form>
  );
};

export default Signup;
