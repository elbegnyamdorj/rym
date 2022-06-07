// @mui material components
import Grid from '@mui/material/Grid';
// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import './main.css';
import * as React from 'react';
// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DefaultProjectCard from 'examples/Cards/ProjectCards/DefaultProjectCard';
import DataTable from 'examples/Tables/DataTable';
import RadarChart from 'examples/Charts/RadarChart';
import SummarizeIcon from '@mui/icons-material/Summarize';
// Overview page components
import Header from 'layouts/profile/components/Header';
// Images
import logo from 'assets/images/logo2.png';
import homeDecor2 from 'assets/images/home-decor-2.jpg';
import homeDecor3 from 'assets/images/home-decor-3.jpg';
import homeDecor4 from 'assets/images/home-decor-4.jpeg';
import team1 from 'assets/images/team-1.jpg';
import team2 from 'assets/images/team-2.jpg';
import team3 from 'assets/images/team-3.jpg';
import team4 from 'assets/images/team-4.jpg';
import { html2pdf } from 'html2pdf.js';

import { Preview, print } from 'react-html2pdf';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { MAIN_URL } from 'urls';
import CustomStatisticsCard from 'examples/Cards/CustomStatiscsCard';
import ReportsLineChart from 'examples/Charts/LineCharts/ReportsLineChart';
import authorsTableData from 'layouts/tables/data/authorsTableData';
import CustomTable from 'examples/Tables/CustomTable';
import MDButton from 'components/MDButton';
import { Dialog, Icon } from '@mui/material';
function StudentProfile() {
  const [main_avg, setMain_avg] = useState(0);
  const [user_data, setUser_data] = useState({});
  const [lessonList, setLessonList] = useState([]);
  const [criteria_avg, setCriteria_avg] = useState({});
  const [def_rc_av, setDef_rc_av] = useState([]);
  const [user_id] = useState(localStorage.getItem('user_id'));
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  useEffect(() => {
    getAlltimeRatings();
    getDefaultRatings();
    getUserData();
    getLessonList();
  }, []);
  const { columns, rows } = authorsTableData();
  const sales = {
    labels: [
      '1-р сар',
      '2-р сар',
      '3-р сар',
      '4-р сар',
      '5-р сар',
      '6-р сар',
      '7-р сар',
      '8-р сар',
      '9-р сар',
      '10-р сар',
      '11-р сар',
      '12-р сар',
    ],
    datasets: {
      label: 'Үнэлгээ',
      data: [4.1, 3.2, 4.5, 4.7, 4.3, 4, 3.5, 4.1, 5, 4.2, 3.2, 3.7, 4.5],
    },
  };

  const getDefaultRatings = () => {
    axios
      .get(`${MAIN_URL}/rating/bydefaults/`, {
        params: {
          student_id: user_id,
        },
      })
      .then((res) => {
        const data = res.data;
        setDef_rc_av(data.criteria_avg);
        let crit_avg = data.criteria_avg;
        let rc_name = [];
        let rc_value = [];
        crit_avg?.map((el) => {
          rc_name.push(el.rating_name);
          rc_value.push(el.rating_value);
        });
        setCriteria_avg({ labels: rc_name, data: rc_value });
      });
  };
  const getLessonList = () => {
    axios
      .get(`${MAIN_URL}/rating/myhistory/`, {
        params: {
          student_id: user_id,
        },
      })
      .then((res) => {
        const data = res.data;
        setLessonList(data);
      });
  };
  const getUserData = () => {
    axios
      .get(`${MAIN_URL}/user/get/`, {
        params: {
          id: user_id,
        },
      })
      .then((res) => {
        const data = res.data;
        setUser_data(data);
      });
  };
  const getAlltimeRatings = () => {
    axios
      .get(`${MAIN_URL}/rating/all/`, {
        params: {
          student_id: user_id,
        },
      })
      .then((res) => {
        const data = res.data;
        setMain_avg(data.main_avg);
      });
  };
  const generatePdf = () => {
    handleOpen();
  };
  const onDownload = () => {
    handleClose();
    const element = document.getElementById('invoice');
    print('Үнэлгээний тайлан', 'jsx-template');
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header name={user_data.last_name} email={user_data.email}>
        <MDBox pt={4} px={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <RadarChart
                  icon={{ color: 'info', component: 'leaderboard' }}
                  title='Үндсэн шалгуурууд'
                  description='Үнэлгээ'
                  chart={{
                    labels: criteria_avg.labels,
                    datasets: [
                      {
                        color: 'dark',
                        data: criteria_avg.data,
                      },
                    ],
                  }}
                />
              </MDBox>
              <MDButton
                variant='gradient'
                color='success'
                onClick={generatePdf}
              >
                <SummarizeIcon sx={{ fontWeight: 'bold' }} />
                &nbsp;Тайлан татаж авах
              </MDButton>
            </Grid>
            <Grid item xs={12} md={6} lg={8}>
              <Grid container>
                <Grid xs={12} md={6} lg={6}>
                  <MDBox mb={8}>
                    <CustomStatisticsCard
                      color='dark'
                      icon='leaderboard'
                      title='Нийт дундаж оноо'
                      count={isNaN(main_avg) ? main_avg : main_avg.toFixed(2)}
                    />
                  </MDBox>
                </Grid>
                <Grid pl={3} xs={12} md={6} lg={6}>
                  <MDBox mb={9}>
                    <CustomStatisticsCard
                      color='primary'
                      icon='emoji_events'
                      title='Ранк'
                      count={2}
                    />
                  </MDBox>
                </Grid>
              </Grid>
              <MDBox mb={3}>
                <ReportsLineChart
                  color='success'
                  title='Нийт дундаж'
                  description='Ерөнхий дундаж оноо нэг жилийн хугацаанд'
                  date='2022'
                  chart={sales}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <h4 className='border-bottom my-5 p-2'>ХИЧЭЭЛҮҮД</h4>
        {lessonList.map((i) => (
          <div id='accordion' key={i.group_id}>
            <div className='card'>
              <div className='card-header' id='headingLes'>
                <h5 className='mb-0'>
                  <button
                    className='btn btn-block w-100'
                    data-toggle='collapse'
                    data-target={'#' + i.lesson_name.replace(/ /g, '')}
                    aria-expanded='true'
                    aria-controls={i.lesson_name.replace(/ /g, '')}
                  >
                    <div className='container'>
                      <div className='row'>
                        <div className='col-sm-3 text-left'>
                          {i.lesson_name}
                        </div>
                        <div className='col-sm-9'>
                          <b> {i.rating_value}</b>
                        </div>
                        <div className='col-sm-1'></div>
                      </div>
                    </div>
                  </button>
                </h5>
              </div>

              <div
                id={i.lesson_name.replace(/ /g, '')}
                className='collapse'
                aria-labelledby='headingLes'
                data-parent='#accordion'
              >
                <div className='card-body'>
                  <table className='table'>
                    <thead>
                      <tr>
                        <th scope='col'>ШАЛГУУР</th>
                        <th scope='col'>ОНОО</th>
                      </tr>
                    </thead>
                    <tbody>
                      {i.criteria_rating.map((i) => (
                        <tr>
                          <td>{i.rating_name}</td>
                          <td>
                            <b>{i.rating_value}</b>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className='list-unstyled border rounded p-3 mt-2'>
                    <h5>Давуу тал, авууштай зан чанар</h5>
                    {i.good_comm.map((j) => (
                      <p>{j}</p>
                    ))}
                  </div>
                  <div className='list-unstyled border rounded p-3 mt-2'>
                    <h5>
                      Цаашид анхаарч, хөгжүүлвэл зохих ур чадвар, зан чанар
                    </h5>
                    {i.bad_comm.map((j) => (
                      <p>{j}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            fullWidth
          >
            <DialogTitle id='alert-dialog-title'>
              {'PDF тайлан татах'}
            </DialogTitle>
            <DialogContent>
              <Preview id={'jsx-template'}>
                <div id='invoice'>
                  <div class='invoice-box'>
                    <table cellpadding='0' cellspacing='0'>
                      <tr class='top'>
                        <td colspan='2'>
                          <table>
                            <tr>
                              <td class='title'>
                                <img src={logo} class='img-logo' />
                              </td>

                              <td>
                                Дугаар #: R00001
                                <br />
                                Огноо: 2022/06/08
                                <br />
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <tr class='information'>
                        <td colspan='2'>
                          <table>
                            <tr>
                              <td>
                                RYM Систем
                                <br />
                                Овог нэр:
                                <br />
                                Имейл хаяг:
                              </td>

                              <td>
                                СЭЗИС
                                <br />
                                {user_data.first_name} {user_data.last_name}
                                <br />
                                {user_data.email}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <tr class='heading'>
                        <td>Үндсэн шалгуур</td>

                        <td>Дундаж оноо#</td>
                      </tr>
                      {def_rc_av.map((el) => (
                        <tr class='details'>
                          <td>{el.rating_name}</td>

                          <td>{el.rating_value}</td>
                        </tr>
                      ))}

                      <tr class='heading'>
                        <td>Бусад шалгуур</td>

                        <td>Дундаж оноо#</td>
                      </tr>

                      <tr class='item last'>
                        <td>-</td>

                        <td>-</td>
                      </tr>

                      <tr class='total'>
                        <td></td>

                        <td>Ерөнхий дундаж: {main_avg}</td>
                      </tr>
                    </table>
                  </div>
                </div>
              </Preview>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Болих</Button>
              <Button onClick={onDownload} autoFocus>
                Татах
              </Button>
            </DialogActions>
          </Dialog>
        </>
      </Header>
    </DashboardLayout>
  );
}

export default StudentProfile;
