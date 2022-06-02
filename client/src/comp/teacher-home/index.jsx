import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MAIN_URL } from '../../urls';
import './teacher-home-style.css';
import CardList from '../lesson-card-list';
import { Link } from 'react-router-dom';
// @mui material components
import Grid from '@mui/material/Grid';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDAlert from 'components/MDAlert';
// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDSnackbar from 'components/MDSnackbar';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard';
import MDButton from 'components/MDButton';

//MUI imports
import { Icon } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const TeacherHome = () => {
  const [group_list, setGroup_list] = useState([]);

  //Modal states
  const [open, setOpen] = React.useState(false);
  const [lesson_name, setLesson_name] = useState('');
  const [group_number, setGroup_number] = useState('');
  const [student_list, setStudent_list] = useState('');
  const [successSB, setSuccessSB] = useState(false);
  const [first, setFirst] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const handleLessonNameChange = (e) => {
    setLesson_name(e.target.value);
  };
  const handleGroupNumberChange = (e) => {
    setGroup_number(e.target.value);
  };
  const handleStudentListChange = (e) => {
    setStudent_list(e.target.value);
  };
  const handleClickOpen = () => {
    setFirst(false);
    setOpen(true);
  };
  const clearInput = () => {
    setLesson_name('');
    setGroup_number('');
    setStudent_list('');
  };
  const alertContent = () => (
    <MDTypography variant='body2' color='white'>
      Бүх нүдийг бөглөнө үү!
    </MDTypography>
  );
  const handleNewLessonSubmit = () => {
    setFirst(false);
    if (lesson_name && group_number && student_list) {
      axios
        .post(`${MAIN_URL}/group/`, {
          lesson_name: lesson_name,
          group_number: group_number,
          student_list: student_list,
          teacher_id: localStorage.getItem('user_id'),
        })
        .then((res) => {
          if (res.status == 201) {
            openSuccessSB();
            getGroupList();
            clearInput();
          }
          //   state: {
          //     group_id: data.id,
          //     isTeacher: true,
          //     lesson_name: lesson_name,
          //     group_number: group_number,
          //   },
          // });
        });
      handleClose();
    } else {
      setFirst(true);
    }
  };
  const handleClose = () => {
    setOpen(false);
    clearInput();
  };
  const getGroupList = () => {
    axios
      .get(`${MAIN_URL}/group/`, {
        params: {
          teacher_id: localStorage.getItem('user_id'),
        },
      })
      .then((res) => {
        const data = res.data;
        setGroup_list(data);
      });
  };
  useEffect(() => {
    getGroupList();
  }, []);

  const renderSuccessSB = (
    <MDSnackbar
      color='success'
      icon='check'
      title='Хичээл амжилттай нэмэгдлээ'
      content=''
      dateTime=''
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );
  return (
    // <>
    //   <Navbar />
    //   <div className='container'>
    //     <div className='row justify-content-center'>
    //       <div className='col-1'></div>
    //       <div className='col-10 bg-light mh-100 px-5'>
    //         <CardList group_list={group_list} isTeacher={true} />
    //       </div>
    //       <div className='col-1'></div>
    //     </div>
    //   </div>
    // </>
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <MDButton variant='gradient' color='dark' onClick={handleClickOpen}>
          <Icon sx={{ fontWeight: 'bold' }}>add</Icon>
          &nbsp;Хичээл нэмэх
        </MDButton>
        <MDBox py={3}>
          <Grid container spacing={3}>
            {group_list.map((e) => {
              return (
                <Grid item xs={12} md={6} lg={3}>
                  <Link to={`${e.id}`}>
                    <MDBox mb={1.5}>
                      <ComplexStatisticsCard
                        color='dark'
                        icon='weekend'
                        title={e.group_number}
                        count={e.lesson_name}
                        percentage={{
                          color: 'success',
                          amount: '+55%',
                          label: e.created_at,
                        }}
                      />
                    </MDBox>
                  </Link>
                </Grid>
              );
            })}
            {renderSuccessSB}
          </Grid>
        </MDBox>
      </DashboardLayout>
      {open && (
        <div>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Хичээл нэмэх</DialogTitle>
            <DialogContent>
              {/* <DialogContentText>
                To subscribe to this website, please enter your email address
                here. We will send updates occasionally.
              </DialogContentText> */}
              <MDInput
                type='text'
                label='Хичээлийн нэр'
                fullWidth
                required
                variant='standard'
                onChange={handleLessonNameChange}
              />
              <MDInput
                type='text'
                label='Групптийн код'
                fullWidth
                required
                variant='standard'
                onChange={handleGroupNumberChange}
              />
              <MDInput
                style={{ marginTop: '15px' }}
                type='text'
                label='Оюутны имэйл хаяг'
                placeholder='student@ufe.edu.mn, ...'
                fullWidth
                required
                multiline
                rows={10}
                onChange={handleStudentListChange}
              />
            </DialogContent>
            {first && (
              <MDAlert color='error' dismissible>
                {alertContent('error')}
              </MDAlert>
            )}

            <DialogActions>
              <Button onClick={handleClose}>Болих</Button>
              <Button onClick={handleNewLessonSubmit}>Хадгалах</Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  );
};
export default TeacherHome;
