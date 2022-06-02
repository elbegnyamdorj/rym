import React, { Component } from "react";
import Navbar from "../navbar";
import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { MAIN_URL } from "../../urls";
import axios from "axios";

import { FaCheckCircle } from "react-icons/fa";
const StudentTeam = () => {
  const location = useLocation();
  const [group_id] = useState(location.state.group_id);
  const [subgroup_id] = useState(location.state.subgroup_id);
  const [subgroup_name] = useState(location.state.subgroup_name);
  const [teammember_list, setTeamMember] = useState([]);
  const [rated_member_list, setRated_member_list] = useState([]);
  const [rating_criteria, setRC] = useState([]);
  const [value, setValue] = useState();
  const [goodComm, setGood] = useState("");
  const [badComm, setBad] = useState("");
  const [post_list, setPost_list] = useState([]);
  const [group_number] = useState(location.state.group_number);
  const [lesson_name] = useState(location.state.lesson_name);
  const [team_name, setTeamName] = useState("");
  const history = useNavigate();
  useEffect(() => {
    getMyTeam();
    getRC();
  }, []);
  const getMyTeam = () => {
    axios
      .get(`${MAIN_URL}/home/myteam/`, {
        params: {
          subgroup_id: subgroup_id,
          group_id: group_id,
          user_id: localStorage.getItem("user_id"),
        },
      })
      .then((res) => {
        const data = res.data;
        setTeamName(data.team_name);
        setTeamMember(data.team_members);
        if (data.team_members) {
          let team_member_id_list = data.team_members.map(
            (a) => a.team_member_id
          );
          isRatedByMe(team_member_id_list);
        }
      });
  };
  const isRatedByMe = (team_member_id_list) => {
    axios
      .post(`${MAIN_URL}/rating/check/`, {
        team_member_id: team_member_id_list,
        user_id: localStorage.getItem("user_id"),
      })
      .then((res) => {
        const data = res.data;
        let rated_member_list = data.rated_member_list;
        setRated_member_list(rated_member_list);
      });
  };
  const onSubmit = () => {
    axios
      .post(`${MAIN_URL}/rating/create/`, {
        post_list: post_list,
        good_comm: goodComm,
        bad_comm: badComm,
        user_id: localStorage.getItem("user_id"),
      })
      .then((res) => {
        const data = res.data;
        alert("Амжилттай хадгаллаа!");
      });
  };

  const getRC = () => {
    axios
      .get(`${MAIN_URL}/rating-criterias/`, {
        params: { group_id: group_id },
      })
      .then((res) => {
        const data = res.data;
        setRC(data);
      });
  };
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-1"></div>
          <div className="col-10 bg-light px-5 ">
            <div className="card border-info mt-5">
              <div className="card-body">
                <div className="row justify-content-center">
                  <div className="col-6">
                    <h5 className="card-title">
                      {lesson_name} - {group_number}
                    </h5>
                  </div>
                  <div className="col-6 text-right">
                    <h5 className="card-title">
                      <b> {team_name} </b>
                    </h5>
                    {subgroup_name}
                  </div>
                </div>
              </div>
            </div>
            <h4 className="border-bottom my-5 pb-1">БАГИЙН ГИШҮҮД</h4>
            {teammember_list.map((i) => (
              <div id="accordion" key={i.student_id}>
                <div className="card">
                  <div className="card-header" id="headingMem">
                    <h5 className="mb-0">
                      <button
                        className="btn btn-block w-100"
                        data-toggle="collapse"
                        data-target={"#" + i.first_name}
                        aria-expanded="true"
                        aria-controls={i.first_name}
                        disabled={
                          rated_member_list.includes(i.team_member_id)
                            ? true
                            : false
                        }
                      >
                        <div className="container">
                          <div className="row">
                            <div className="col-sm-4 text-left">
                              {i.first_name}
                            </div>
                            <div className="col-sm-4">{i.email} </div>
                            <div className="col-sm-4">
                              {rated_member_list.includes(i.team_member_id) && (
                                <>
                                  <FaCheckCircle style={{ color: "green" }} />{" "}
                                  Done
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    </h5>
                  </div>

                  <div
                    id={i.first_name}
                    className="collapse"
                    aria-labelledby="headingMem"
                    data-parent="#accordion"
                  >
                    <div className="card-body">
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">ШАЛГУУР</th>
                            <th scope="col">1</th>
                            <th scope="col">2</th>
                            <th scope="col">3</th>
                            <th scope="col">4</th>
                            <th scope="col">5</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rating_criteria.map((el) => (
                            <tr
                              key={el.id}
                              onChange={(e) => {
                                const target = e.target;
                                if (target.checked) {
                                  console.log(...post_list);
                                  setPost_list([
                                    ...post_list,
                                    {
                                      team_member_id: i.team_member_id,
                                      rc_name: el.rc_name,
                                      rc_id: el.id,
                                      rating_value: parseInt(target.value),
                                    },
                                  ]);
                                  setValue(target.value);
                                }
                              }}
                            >
                              <td>{el.rc_name}</td>
                              <td className="text-left">
                                <div className="form-check form-check-inline">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name={el.id}
                                    id={el.id}
                                    value={1}
                                  />
                                </div>
                              </td>
                              <td className="text-left">
                                <div className="form-check form-check-inline">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name={el.id}
                                    id={el.id}
                                    value={2}
                                  />
                                </div>
                              </td>
                              <td className="text-left">
                                <div className="form-check form-check-inline">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name={el.id}
                                    id={el.id}
                                    value={3}
                                  />
                                </div>
                              </td>
                              <td className="text-left">
                                <div className="form-check form-check-inline">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name={el.id}
                                    id={el.id}
                                    value={4}
                                  />
                                </div>
                              </td>
                              <td className="text-left">
                                <div className="form-check form-check-inline">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name={el.id}
                                    id={el.id}
                                    value={5}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="form-group px-3">
                        <label for="comment1">
                          Гишүүн {i.first_name}-ийн давуу тал, авууштай зан
                          чанар
                        </label>
                        <textarea
                          onChange={(e) => setGood(e.target.value)}
                          className="form-control"
                          id="comment1"
                          rows="2"
                        ></textarea>
                      </div>

                      <div className="form-group px-3">
                        <label for="comment2">
                          Гишүүн {i.first_name}-ийн цаашид анхаарч, хөгжүүлвэл
                          зохих ур чадвар, зан чанар
                        </label>
                        <textarea
                          required={true}
                          onChange={(e) => setBad(e.target.value)}
                          className="form-control"
                          id="comment2"
                          rows="2"
                        ></textarea>
                      </div>

                      <div className="d-flex justify-content-end">
                        <button
                          className="btn btn-secondary m-2 "
                          href="studentTeam.html"
                          role="button"
                          onClick={onSubmit}
                        >
                          ХАДГАЛАХ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* DUUSAH */}
            <button
              className="btn btn-secondary my-5"
              role="button"
              onClick={() => history(-1)}
            >
              Сэдэв рүү буцах
            </button>
          </div>
          <div className="col-1"></div>
        </div>
      </div>
    </>
  );
};

export default StudentTeam;
