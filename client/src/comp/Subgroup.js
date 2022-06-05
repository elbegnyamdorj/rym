import { Link, useParams, useLocation } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { MAIN_URL } from 'urls';
// import Navbar from '../navbar';
// import Button from 'react-bootstrap/Button';
// import SubgroupElement from '../subgroup-element';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import _ from 'lodash';
// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDInput from 'components/MDInput';
import MDTypography from 'components/MDTypography';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DataTable from 'examples/Tables/DataTable';

// Data
const Subgroup = () => {
  //   const { columns, rows } = authorsTableData();
  const { id, sg } = useParams();
  const location = useLocation();
  const { group_info } = location.state;
  const [student_scores, setStudent_scores] = useState([]);
  const [mainList, setMainList] = useState([]);
  const columns = [
    { Header: 'Нэр', accessor: 'first_name', width: '25%' },
    { Header: 'Имэйл', accessor: 'email', width: '30%' },
    { Header: 'Дундаж оноо', accessor: 'avg_value' },
  ];
  const getStudentList = () => {
    axios
      .get(`${MAIN_URL}/subgroup/teammembers/`, {
        params: {
          subgroup_id: sg,
        },
      })
      .then((res) => {
        const data = res.data;
      });
  };
  const getStudentScore = () => {
    axios
      .get(`${MAIN_URL}/subgroup/teammembers/scores/`, {
        params: {
          group_id: id,
          subgroup_id: sg,
        },
      })
      .then((res) => {
        const data = res.data;
        const result = _.groupBy(data, 'team_name');
        console.log(result);
        setMainList(result);
      });
  };
  useEffect(() => {
    getStudentList();
    getStudentScore();
  }, []);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant='gradient'
                bgColor='info'
                borderRadius='lg'
                coloredShadow='info'
              >
                <MDTypography variant='h6' color='white'>
                  Authors Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid> */}
          {Object.keys(mainList).map((key) => (
            <Grid item xs={6}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant='gradient'
                  bgColor='info'
                  borderRadius='lg'
                  coloredShadow='info'
                >
                  <MDTypography variant='h6' color='white'>
                    {key}
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns: columns, rows: mainList[key] }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};
export default Subgroup;
