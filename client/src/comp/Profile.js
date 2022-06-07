// @mui material components
import Grid from '@mui/material/Grid';
// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DefaultProjectCard from 'examples/Cards/ProjectCards/DefaultProjectCard';
import DataTable from 'examples/Tables/DataTable';
import RadarChart from 'examples/Charts/RadarChart';

// Overview page components
import Header from 'layouts/profile/components/Header';
// Images
import homeDecor1 from 'assets/images/home-decor-1.jpg';
import homeDecor2 from 'assets/images/home-decor-2.jpg';
import homeDecor3 from 'assets/images/home-decor-3.jpg';
import homeDecor4 from 'assets/images/home-decor-4.jpeg';
import team1 from 'assets/images/team-1.jpg';
import team2 from 'assets/images/team-2.jpg';
import team3 from 'assets/images/team-3.jpg';
import team4 from 'assets/images/team-4.jpg';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { MAIN_URL } from 'urls';
import CustomStatisticsCard from 'examples/Cards/CustomStatiscsCard';
import ReportsLineChart from 'examples/Charts/LineCharts/ReportsLineChart';
import authorsTableData from 'layouts/tables/data/authorsTableData';
import CustomTable from 'examples/Tables/CustomTable';
function StudentProfile() {
  const [main_avg, setMain_avg] = useState(0);
  const [user_data, setUser_data] = useState({});
  const [criteria_avg, setCriteria_avg] = useState({});
  const [user_id] = useState(localStorage.getItem('user_id'));
  useEffect(() => {
    getAlltimeRatings();
    getDefaultRatings();
    getUserData();
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
        {/* <CustomTable />
        <DataTable
          table={{ columns, rows }}
          isSorted={false}
          entriesPerPage={false}
          showTotalEntries={false}
          noEndBorder
        /> */}
        {/* <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant='h6' fontWeight='medium'>
            Projects
          </MDTypography>
          <MDBox mb={1}>
            <MDTypography variant='button' color='text'>
              Architects design houses
            </MDTypography>
          </MDBox>
        </MDBox> */}
        {/* <MDBox p={2}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor1}
                label='project #2'
                title='modern'
                description='As Uber works through a huge amount of internal management turmoil.'
                action={{
                  type: 'internal',
                  route: '/pages/profile/profile-overview',
                  color: 'info',
                  label: 'view project',
                }}
                authors={[
                  { image: team1, name: 'Elena Morison' },
                  { image: team2, name: 'Ryan Milly' },
                  { image: team3, name: 'Nick Daniel' },
                  { image: team4, name: 'Peterson' },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor2}
                label='project #1'
                title='scandinavian'
                description='Music is something that everyone has their own specific opinion about.'
                action={{
                  type: 'internal',
                  route: '/pages/profile/profile-overview',
                  color: 'info',
                  label: 'view project',
                }}
                authors={[
                  { image: team3, name: 'Nick Daniel' },
                  { image: team4, name: 'Peterson' },
                  { image: team1, name: 'Elena Morison' },
                  { image: team2, name: 'Ryan Milly' },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor3}
                label='project #3'
                title='minimalist'
                description='Different people have different taste, and various types of music.'
                action={{
                  type: 'internal',
                  route: '/pages/profile/profile-overview',
                  color: 'info',
                  label: 'view project',
                }}
                authors={[
                  { image: team4, name: 'Peterson' },
                  { image: team3, name: 'Nick Daniel' },
                  { image: team2, name: 'Ryan Milly' },
                  { image: team1, name: 'Elena Morison' },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor4}
                label='project #4'
                title='gothic'
                description='Why would anyone pick blue over pink? Pink is obviously a better color.'
                action={{
                  type: 'internal',
                  route: '/pages/profile/profile-overview',
                  color: 'info',
                  label: 'view project',
                }}
                authors={[
                  { image: team4, name: 'Peterson' },
                  { image: team3, name: 'Nick Daniel' },
                  { image: team2, name: 'Ryan Milly' },
                  { image: team1, name: 'Elena Morison' },
                ]}
              />
            </Grid>
          </Grid>
        </MDBox> */}
      </Header>
    </DashboardLayout>
  );
}

export default StudentProfile;
