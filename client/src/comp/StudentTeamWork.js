import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MAIN_URL } from 'urls';
// import Navbar from '../navbar';
// import Button from 'react-bootstrap/Button';
// import SubgroupElement from '../subgroup-element';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
//MUI imports
import { FormControlLabel, Icon, Radio, RadioGroup } from '@mui/material';
import DataTable from 'examples/Tables/DataTable';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { useMaterialUIController } from 'context';
import MDInput from 'components/MDInput';
const StudentTeamWork = () => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { id } = useParams();
  const [group_id, setGroup_id] = useState(id);
  const [group_info, setGroup_info] = useState({});
  const [subgroup_list, setSubgroup_list] = useState([]);
  const [team_members, setTeam_members] = useState([]);
  const [rating_criteria, setRC] = useState([]);
  const [team_name, setTeam_name] = useState('');
  const [selectedTW, setSelectedTW] = useState('');
  const [selectedMember, setSelectedMember] = useState({});
  const [ratings, setRatings] = useState([]);
  const [open, setOpen] = useState(false);
  const [goodComm, setGood] = useState('');
  const [badComm, setBad] = useState('');

  const RadioButtons = ({ team_member, rc }) => {
    return (
      <RadioGroup
        onClick={(e) => {
          handleValutation(e.target.value, rc, team_member);
        }}
        row
        aria-labelledby='demo-radio-buttons-group-label'
        name='radio-buttons-group'
      >
        <FormControlLabel
          value='1'
          control={<Radio />}
          label=''
          sx={{ margin: 'auto' }}
        />
        <FormControlLabel
          value='2'
          control={<Radio />}
          label=''
          sx={{ margin: 'auto' }}
        />
        <FormControlLabel
          value='3'
          control={<Radio />}
          label=''
          sx={{ margin: 'auto' }}
        />
        <FormControlLabel
          value='4'
          control={<Radio />}
          label=''
          sx={{ margin: 'auto' }}
        />
        <FormControlLabel
          value='5'
          control={<Radio />}
          label=''
          sx={{ margin: 'auto' }}
        />
      </RadioGroup>
    );
  };
  const getRC = (team_member) => {
    axios
      .get(`${MAIN_URL}/rating-criterias/`, {
        params: { group_id: group_id },
      })
      .then((res) => {
        const data = res.data;
        let rc_radio = data;
        rc_radio.map(
          (el) =>
            (el.radioButtons = (
              <RadioButtons team_member={team_member} rc={el} />
            ))
        );
        setRC(rc_radio);
      });
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleValutaionSubmit = () => {
    axios
      .post(`${MAIN_URL}/rating/create/`, {
        post_list: ratings,
        good_comm: goodComm,
        bad_comm: badComm,
        user_id: localStorage.getItem('user_id'),
      })
      .then((res) => {
        alert('Амжилттай хадгаллаа!');
        window.location.reload();
      });
  };
  const handleValutation = (value, rc, team_member) => {
    let pre_obj = {
      team_member_id: team_member.team_member_id,
      rc_name: rc.rc_name,
      rc_id: rc.id,
      rating_value: parseInt(value),
    };
    // addRatings(pre_obj);
    setRatings((r) => {
      console.log(r);
      return [...r, pre_obj];
    });
    // let changed_ratings = ratings;
    // changed_ratings.map((el) => {
    //   if (el.id === rc.id) {
    //     var objIndex = ratings.findIndex((obj) => obj.id == rc.id);
    //     changed_ratings[objIndex] = pre_obj;
    //   }
    // });
    // setRatings(['', 'sda']);
  };
  const onRate = (team_member) => {
    setSelectedMember(team_member);
    getRC(team_member);
    handleClickOpen();
  };
  const getGroupInfo = () => {
    axios
      .get(`${MAIN_URL}/group-more/`, {
        params: {
          id: group_id,
        },
      })
      .then((res) => {
        const data = res.data;
        setGroup_info(data);
      });
  };
  const getAllSubgroupList = () => {
    axios
      .get(`${MAIN_URL}/subgroup/`, {
        params: {
          group_id: id,
        },
      })
      .then((res) => {
        const data = res.data;
        setSubgroup_list(data);
      });
  };
  useEffect(() => {
    getAllSubgroupList();
    getGroupInfo();
  }, []);
  const ratingColumns = [
    { Header: 'Шалгуур', accessor: 'rc_name', width: '50%' },
    {
      Header: (
        <MDBox display='flex' justifyContent='space-around'>
          <MDTypography component='p' variant='caption'>
            1
          </MDTypography>
          <MDTypography component='p' variant='caption'>
            2
          </MDTypography>
          <MDTypography component='p' variant='caption'>
            3
          </MDTypography>
          <MDTypography component='p' variant='caption'>
            4
          </MDTypography>
          <MDTypography component='p' variant='caption'>
            5
          </MDTypography>
        </MDBox>
      ),
      accessor: 'radioButtons',
      width: '50%',
    },
  ];
  const columns = [
    { Header: 'Нэр', accessor: 'last_name', width: '35%' },
    { Header: 'Имэйл', accessor: 'email', width: '35%' },
    { Header: 'Үнэлгээ өгөх', accessor: 'action' },
  ];

  const onTeamWorkClick = (subgroup_id, subgroup_name) => {
    setSelectedTW(subgroup_name);
    axios
      .get(`${MAIN_URL}/home/myteam/`, {
        params: {
          subgroup_id: subgroup_id,
          group_id: group_id,
          user_id: localStorage.getItem('user_id'),
        },
      })
      .then((res) => {
        const data = res.data;
        let action_team_mem = data.team_members;
        console.log(action_team_mem);
        action_team_mem.map((el) => {
          el.action = (
            <MDTypography
              component='a'
              onClick={() => onRate(el)}
              variant='caption'
              color='text'
              fontWeight='medium'
            >
              <Icon>edit</Icon>&nbsp;
            </MDTypography>
          );
        });
        setTeam_members(action_team_mem);
        setTeam_name(data.team_name);
      });
  };
  return (
    <DashboardLayout>
      <DashboardNavbar
        title={`${group_info.lesson_name}-${group_info.group_number}`}
      />
      <MDBox mt={3}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card id='delete-account'>
                <MDBox
                  pt={3}
                  px={2}
                  display='flex'
                  justifyContent='space-between'
                >
                  <MDTypography variant='h4' fontWeight='medium'>
                    Багийн ажлууд
                  </MDTypography>
                </MDBox>
                <MDBox pt={1} pb={2} px={2}>
                  <MDBox
                    component='ul'
                    display='flex'
                    flexDirection='column'
                    p={0}
                    m={0}
                  >
                    {subgroup_list.map((el) => {
                      return (
                        <MDBox
                          component='li'
                          display='flex'
                          justifyContent='space-between'
                          alignItems='flex-start'
                          bgColor={darkMode ? 'transparent' : 'grey-100'}
                          borderRadius='lg'
                          width='100%'
                          p={3}
                          mb={0.5}
                          mt={2}
                          sx={{ cursor: 'pointer' }}
                          onClick={() =>
                            onTeamWorkClick(el.id, el.subgroup_name)
                          }
                        >
                          <MDBox
                            width='100%'
                            display='flex'
                            flexDirection='column'
                          >
                            <MDBox
                              display='flex'
                              justifyContent='space-between'
                              alignItems={{ xs: 'flex-start', sm: 'center' }}
                              flexDirection={{ xs: 'column', sm: 'row' }}
                              mb={0.5}
                            >
                              <MDTypography
                                variant='h5'
                                fontWeight='medium'
                                textTransform='capitalize'
                              >
                                {el.subgroup_name}
                              </MDTypography>

                              <MDBox
                                display='flex'
                                alignItems='center'
                                mt={{ xs: 2, sm: 0 }}
                                ml={{ xs: -1.5, sm: 0 }}
                              ></MDBox>
                            </MDBox>
                            <MDBox mb={0.5} lineHeight={0} textAlign='left'>
                              <MDTypography variant='caption' color='text'>
                                Огноо:&nbsp;&nbsp;&nbsp;
                                <MDTypography
                                  variant='caption'
                                  fontWeight='medium'
                                  textTransform='capitalize'
                                >
                                  {el.deadline}
                                </MDTypography>
                              </MDTypography>
                            </MDBox>
                          </MDBox>
                        </MDBox>
                        // </MDButton>
                      );
                    })}
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <MDBox
                  pt={3}
                  px={2}
                  pb={3}
                  display='flex'
                  justifyContent='space-between'
                >
                  <MDTypography variant='h4' fontWeight='medium'>
                    Багийн гишүүд
                  </MDTypography>
                </MDBox>
                <Grid item xs={12}>
                  <Card>
                    <MDBox
                      mx={2}
                      mt={-3}
                      py={1.5}
                      px={1.5}
                      variant='gradient'
                      bgColor='dark'
                      borderRadius='lg'
                      coloredShadow='info'
                    >
                      <MDTypography variant='h6' color='white'>
                        {team_name
                          ? `${selectedTW} / ${team_name}`
                          : 'Багийн ажил сонгоно уу!'}
                      </MDTypography>
                    </MDBox>
                    <MDBox pt={2}>
                      <DataTable
                        table={{ columns: columns, rows: team_members }}
                        isSorted={false}
                        entriesPerPage={false}
                        showTotalEntries={false}
                        noEndBorder
                      />
                    </MDBox>
                  </Card>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Үнэлгээний талбар</DialogTitle>

        <DialogContent>
          <DialogContentText>
            {`${selectedTW} / ${team_name} / ${selectedMember.last_name}`}
          </DialogContentText>

          <DataTable
            table={{ columns: ratingColumns, rows: rating_criteria }}
            isSorted={false}
            entriesPerPage={false}
            showTotalEntries={false}
          />
          <MDInput
            // style={{ marginTop: '15px' }}
            type='text'
            label='Гишүүний давуу тал, авууштай зан чанар'
            fullWidth
            required
            multiline
            rows={5}
            onChange={(e) => setGood(e.target.value)}
          />
          <MDInput
            style={{ marginTop: '15px' }}
            type='text'
            label='Гишүүний цаашид анхаарч, хөгжүүлвэл зохих ур чадвар, зан чанар'
            fullWidth
            required
            multiline
            rows={5}
            onChange={(e) => setBad(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Буцах</Button>
          <Button onClick={handleValutaionSubmit}>Хадгалах</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};
export default StudentTeamWork;
