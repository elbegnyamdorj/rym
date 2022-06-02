import React from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MAIN_URL } from 'urls';
import TeamElement from './team-element';
// import Navbar from '../navbar';
// import Button from 'react-bootstrap/Button';
// import SubgroupElement from '../subgroup-element';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
//MUI imports
import { Icon } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Bill from 'layouts/billing/components/Bill';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDInput from 'components/MDInput';
import MDTypography from 'components/MDTypography';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDButton from 'components/MDButton';
// Billing page components
import Transaction from 'layouts/billing/components/Transaction';

const Lesson = (props) => {
  const { id } = useParams();
  //   const location = useLocation();
  const [group_info, setGroup_info] = useState({});
  //   const [student_list, setStudent_list] = useState([]);
  const [subgroup_list, setSubgroup_list] = useState([]);
  const [group_id, setGroup_id] = useState(id);
  const [team_number, setTeam_number] = useState(0);
  const [subgroup_name, setSubgroup_name] = useState('');
  //Modal states
  const [open, setOpen] = React.useState(false);
  //   const [group_number] = useState(location.state.group_number);
  //   const [lesson_name] = useState(location.state.lesson_name);
  //   const [isTeacher] = useState(location.state.isTeacher);

  //Create team
  const [student_list, setStudent_list] = useState([]);
  const [option_student_list, setOption_student_list] = useState([]);
  const [student_teams, setStudent_teams] = useState([]);
  const getCurrentSelection = (selected_students) => {
    console.log(selected_students);

    const index = student_teams.findIndex(
      (object) => object.id === selected_students.id
    );

    if (index === -1) {
      setStudent_teams([...student_teams, selected_students]);
    } else {
      var array = student_teams;
      array.splice(index, 1);
      setStudent_teams([...student_teams, selected_students]);
    }
  };
  const onSelected = (team_data) => {
    var filtered_array = option_student_list.filter(
      (ar) => !team_data.selected.find((rm) => rm.value === ar.id)
    );
    // console.log(team_data);
    setOption_student_list(filtered_array);
  };
  const onRemoved = (removed_student) => {
    var id = removed_student.value;
    var student = student_list.find(function (std, index) {
      if (std.id === id) return true;
    });
    setOption_student_list([...option_student_list, student]);
  };
  const handleClickOpen = () => {
    // setFirst(false);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    clearInput();
  };
  const handleTeamNumberChange = (e) => {
    setTeam_number(e.target.value);
  };
  const handleTeamNameChange = (e) => {
    setSubgroup_name(e.target.value);
  };
  async function onTeamCreate() {
    let subgroup = await axios.post(`${MAIN_URL}/subgroup/`, {
      subgroup_name: subgroup_name,
      group_id: group_id,
    });
    if (subgroup.status == 201) {
      let res = await axios.post(`${MAIN_URL}/teammember/create/`, {
        team_list: student_teams,
        subgroup_id: subgroup.data.id,
        group_id: group_id,
      });
      clearInput();
      handleClose();
    }
  }
  const clearInput = () => {
    setStudent_teams([]);
    setSubgroup_name('');
    setTeam_number(0);
  };
  useEffect(() => {
    getStudentList();
    getAllSubgroupList();
    getGroupInfo();
  }, []);
  const getStudentList = () => {
    axios
      .get(`${MAIN_URL}/subgroup/students/`, {
        params: {
          group_id: group_id,
        },
      })
      .then((res) => {
        const data = res.data;
        setStudent_list(data);
        setOption_student_list(data);
      });
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
          group_id: group_id,
        },
      })
      .then((res) => {
        const data = res.data;
        setSubgroup_list(data);
      });
  };
  return (
    <>
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
                    <MDButton
                      variant='gradient'
                      color='dark'
                      onClick={handleClickOpen}
                    >
                      <Icon sx={{ fontWeight: 'bold' }}>add</Icon>
                      &nbsp;Багийн ажил нэмэх
                    </MDButton>
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
                          <Link
                            to={`${el.id}`}
                            state={{ group_info: group_info }}
                          >
                            <Bill
                              name={el.subgroup_name}
                              company={el.deadline}
                              // email=''
                              // vat=''
                            />
                          </Link>
                        );
                      })}
                    </MDBox>
                  </MDBox>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <MDBox
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    pt={3}
                    px={2}
                  >
                    <MDTypography
                      variant='h4'
                      fontWeight='medium'
                      // textTransform='capitalize'
                    >
                      Оюутны жагсаалт
                    </MDTypography>
                    <MDBox display='flex' alignItems='flex-start'>
                      <MDBox color='text' mr={0.5} lineHeight={0}>
                        <Icon color='inherit' fontSize='small'>
                          date_range
                        </Icon>
                      </MDBox>
                      <MDTypography
                        variant='button'
                        color='text'
                        fontWeight='regular'
                      >
                        {group_info.created_at}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                  <MDBox pt={1} pb={2} px={2}>
                    {/* <MDBox mt={1} mb={1}>
                    <MDTypography
                      variant='caption'
                      color='text'
                      fontWeight='bold'
                      textTransform='uppercase'
                    >
                      Оюутнууд
                    </MDTypography>
                  </MDBox> */}
                    <MDBox
                      component='ul'
                      display='flex'
                      flexDirection='column'
                      p={0}
                      m={0}
                      sx={{ listStyle: 'none' }}
                    >
                      {student_list.map((el) => {
                        return (
                          <Transaction
                            color='dark'
                            icon='person_icon'
                            name={el.last_name}
                            description={el.email}
                            //   value='+ $ 750'
                          />
                        );
                      })}
                    </MDBox>
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </DashboardLayout>
      {open && (
        <div>
          <Dialog open={open} onClose={handleClose}>
            {/* maxWidth='md' fullWidth */}
            <DialogTitle>Багийн ажил нэмэх</DialogTitle>
            <DialogContent>
              {/* <DialogContentText>
                To subscribe to this website, please enter your email address
                here. We will send updates occasionally.
              </DialogContentText> */}
              <MDInput
                type='text'
                label='Багийн ажлын нэр'
                fullWidth
                required
                onChange={handleTeamNameChange}
              />
              <MDBox display='flex' alignItems='center' p={0} m={0}>
                <DialogContent>Багийн тоо оруулна уу:</DialogContent>
                <MDInput
                  type='number'
                  label='Багийн тоо'
                  required
                  onChange={handleTeamNumberChange}
                />
              </MDBox>
              {team_number > 0 &&
                Array.from({ length: team_number }, (_, k) => (
                  <>
                    {/* <Select
                      isMulti
                      onChange={this.handleChange}
                      name='colors'
                      options={options}
                      className='basic-multi-select'
                      classNamePrefix='select'
                    /> */}
                    <TeamElement
                      dugaar={k + 1}
                      data={option_student_list}
                      onSelected={onSelected}
                      onRemoved={onRemoved}
                      passCurrentSelection={getCurrentSelection}
                    />
                  </>
                ))}
            </DialogContent>
            {/* {first && (
              <MDAlert color='error' dismissible>
                {alertContent('error')}
              </MDAlert>
            )} */}
            <DialogActions>
              <Button onClick={handleClose}>Болих</Button>
              <Button onClick={onTeamCreate}>Хадгалах</Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  );
  //   if (isTeacher) {
  //     return (
  //       <>
  //         <Navbar />
  //         <div className="container">
  //           <div className="row justify-content-center">
  //             <div className="col-1"></div>
  //             <div className="col-10 bg-light px-5 ">
  //               <h4 className="border-bottom my-5 pb-1">
  //                 {" "}
  //                 {lesson_name} - {group_number} / БАГИЙН АЖЛУУД
  //               </h4>
  //               <Link
  //                 className="btn btn-outline-dark btn-lg py-2 mt-4 btn-light btn-block w-100"
  //                 role="button"
  //                 to="/lesson/subgroups/create"
  //                 state={{
  //                   group_id: group_id,
  //                   group_number: group_number,
  //                   lesson_name: lesson_name,
  //                 }}
  //               >
  //                 +
  //               </Link>
  //               {subgroup_list.map((el) => (
  //                 <SubgroupElement
  //                   key={el.id}
  //                   id={el.id}
  //                   subgroup_name={el.subgroup_name}
  //                   group_id={el.group_id}
  //                   lesson_name={lesson_name}
  //                   group_number={group_number}
  //                 />
  //               ))}
  //             </div>
  //             <div className="col-1"></div>
  //           </div>
  //         </div>
  //       </>
  //     );
  //   } else {
  //     return (
  //       <>
  //         <Navbar />
  //         <div className="container">
  //           <div className="row justify-content-center">
  //             <div className="col-1"></div>
  //             <div className="col-10 bg-light px-5 ">
  //               <h4 className="border-bottom my-5 pb-1">БАГИЙН АЖЛУУД</h4>
  //               {subgroup_list.map((el) => (
  //                 <Link
  //                   key={el.id}
  //                   to="/lesson/subgroups/myteams"
  //                   state={{
  //                     group_id: el.group_id,
  //                     subgroup_id: el.id,
  //                     subgroup_name: el.subgroup_name,
  //                     group_number: group_number,
  //                     lesson_name: lesson_name,
  //                   }}
  //                   {...console.log(el)}
  //                 >
  //                   <Button className="btn btn-outline-link btn-lg py-2 mt-4 btn-light btn-block w-100">
  //                     {el.subgroup_name}
  //                   </Button>
  //                 </Link>
  //               ))}
  //             </div>
  //             <div className="col-1"></div>
  //           </div>
  //         </div>
  //       </>
  //     );
  //   }
};

export default Lesson;
