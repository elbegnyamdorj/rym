import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MAIN_URL } from '../../urls';
import Grid from '@mui/material/Grid';
// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';

const StudentHome = () => {
  const [group_list, setGroup_list] = useState([]);
  useEffect(() => {
    axios
      .get(`${MAIN_URL}/home/`, {
        params: {
          student_id: localStorage.getItem('user_id'),
        },
      })
      .then((res) => {
        const data = res.data;
        setGroup_list(data);
      });
  }, []);

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
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
          </Grid>
        </MDBox>
      </DashboardLayout>
      {/* <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-1'></div>
          <div className='col-10 bg-light mh-100 px-5'>
            {this.state.group_list && (
              <CardList group_list={this.state.group_list} isTeacher={false} />
            )}
          </div>
          <div className='col-1'></div>
        </div>
      </div> */}
    </>
  );
};

export default StudentHome;
