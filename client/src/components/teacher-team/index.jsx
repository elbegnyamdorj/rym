import React from "react";
import Navbar from "../navbar";
import axios from "axios";
import { MAIN_URL } from "../../urls";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const TeacherTeamView = (props) => {
  const history = useNavigate();
  const location = useLocation();
  const [group_id] = useState(location.state.group_id);
  const [subgroup_name] = useState(location.state.subgroup_name);
  const [subgroup_id] = useState(location.state.subgroup_id);
  const [group_number] = useState(location.state.group_number);
  const [lesson_name] = useState(location.state.lesson_name);
  const [main_list, setMainList] = useState([]);
  console.log(group_id, subgroup_name, subgroup_id);

  const getStudentList = () => {
    axios
      .get(`${MAIN_URL}/subgroup/teammembers/`, {
        params: {
          subgroup_id: subgroup_id,
        },
      })
      .then((res) => {
        const data = res.data;
        setMainList(data);
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
            <h4 className="border-bottom mt-5 pb-1">
              <div className="container">
                <div className="row">
                  <div className="col-sm-4 text-left">
                    {lesson_name} - {group_number}
                  </div>
                  <div className="col-sm-4 text-left">{subgroup_name}</div>
                  <div className="col-sm-4 text-left">
                    <Link
                      to="/lesson/subgroups/teams/score"
                      className="btn btn-primary "
                      role="button"
                      state={{
                        group_id: group_id,
                        subgroup_id: subgroup_id,
                        group_number: group_number,
                        lesson_name: lesson_name,
                      }}
                    >
                      Үнэлгээ
                    </Link>
                  </div>
                </div>
              </div>
            </h4>
            {Object.keys(main_list).map((key) => (
              <>
                <h4 className="border-bottom my-5 pb-1">{[key]}</h4>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Оюутны нэр</th>
                      <th scope="col">Оюутны хаяг</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {main_list[key].map((item, i) => (
                      <tr key={i}>
                        <th scope="row">{i + 1}</th>
                        <td> {item["first_name"]}</td>
                        <td> {item["email"]} </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ))}

            <div className="container">
              <div className="row">
                <div className="col-sm-6 text-left">
                  <button
                    className="btn btn-secondary my-5 px-5"
                    role="button"
                    onClick={() => history(-1)}
                  >
                    Сэдэв рүү буцах
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

export default TeacherTeamView;
