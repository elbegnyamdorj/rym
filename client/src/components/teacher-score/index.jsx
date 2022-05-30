import React, { Component } from "react";
import Navbar from "../navbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { MAIN_URL } from "../../urls";
const TeacherScoreView = () => {
  const history = useNavigate();
  const location = useLocation();
  const [team_members, setTeam_member] = useState([]);
  const [group_id] = useState(location.state.group_id);
  const [subgroup_id] = useState(location.state.subgroup_id);
  const [group_number] = useState(location.state.group_number);
  const [lesson_name] = useState(location.state.lesson_name);
  const getStudentList = () => {
    axios
      .get(`${MAIN_URL}/subgroup/teammembers/scores/`, {
        params: {
          group_id: group_id,
          subgroup_id: subgroup_id,
        },
      })
      .then((res) => {
        const data = res.data;
        setTeam_member(data);
      });
  };

  useEffect(() => {
    getStudentList();
  }, []);
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-1"></div>
          <div className="col-10 bg-light px-5 h-100">
            <h4 className="border-bottom my-5 pb-1">
              {" "}
              {lesson_name} - {group_number}{" "}
            </h4>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">НЭР</th>
                  <th scope="col">ОЮУТНЫ ХАЯГ</th>
                  <th scope="col">ДУНДАЖ ОНОО</th>
                </tr>
              </thead>
              <tbody>
                {team_members.map((el, index) => (
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>{el.first_name}</td>
                    <td>{el.email}</td>
                    <td>{el.avg_value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="col-sm-6 text-left">
              <button
                onClick={() => history(-1)}
                className="btn btn-secondary my-5 px-5"
                role="button"
              >
                Буцах
              </button>
            </div>
          </div>
          <div className="col-1"></div>
        </div>
      </div>
    </>
  );
};

export default TeacherScoreView;
