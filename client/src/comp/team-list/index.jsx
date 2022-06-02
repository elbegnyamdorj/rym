import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "../navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MAIN_URL } from "../../urls";
import { useEffect } from "react";
import TeamElement from "../team-element";
const TeamList = () => {
  const location = useLocation();
  const history = useNavigate();
  const [subgroup_name] = useState(location.state.subgroup_name);
  const [group_id] = useState(location.state.group_id);
  const [num_of_groups] = useState(location.state.num_of_groups);
  const [subgroup_id] = useState(location.state.subgroup_id);
  const [lesson_name] = useState(location.state.lesson_name);

  const [student_list, setStudent_list] = useState([]);
  const [option_student_list, setOption_student_list] = useState([]);

  const [student_teams, setStudent_teams] = useState([]);

  useEffect(() => {
    // getTeamList();
    getStudentList();
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
  const onSubmit = () => {
    axios
      .post(`${MAIN_URL}/teammember/create/`, {
        team_list: student_teams,
        subgroup_id: subgroup_id,
        group_id: group_id,
      })
      .then((res) => {
        history("/lesson");
      });
  };
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

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-1"></div>
          <div className="col-10 bg-light px-5 h-100">
            <h4 className="border-bottom my-5 pb-1">
              <div className="container">
                <div className="row">
                  <div className="col-sm-6 text-left">{lesson_name}</div>
                  <div className="col-sm-6 text-left">{subgroup_name} </div>
                </div>
              </div>
            </h4>

            {Array.from({ length: num_of_groups }, (_, k) => (
              <TeamElement
                dugaar={k + 1}
                data={option_student_list}
                onSelected={onSelected}
                onRemoved={onRemoved}
                passCurrentSelection={getCurrentSelection}
              />
            ))}

            <div className="container">
              <div className="row">
                <div className="col-sm-6 text-left">
                  <Link
                    className="btn btn-secondary my-5 px-5"
                    to="/lesson"
                    role="button"
                  >
                    Хичээл рүү буцах
                  </Link>
                </div>
                <div className="col-sm-6 text-right">
                  <button className="btn btn-dark my-5 px-5" onClick={onSubmit}>
                    ХАДГАЛАХ
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-1"></div>
        </div>
      </div>
    </>
  );
};

export default TeamList;
