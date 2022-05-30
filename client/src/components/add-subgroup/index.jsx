import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../navbar";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { MAIN_URL } from "../../urls";

const CreateSubgroup = () => {
  const location = useLocation();
  const [sub_group_name, setSubgroupName] = useState("");
  const [subgroup_id, setSubgroupId] = useState();
  const [num_of_groups, setNumOfGroups] = useState(0);
  const [group_id] = useState(location.state.group_id);
  const [lesson_name] = useState(location.state.lesson_name);

  const history = useNavigate();
  console.log(typeof group_id);
  const createSubGroup = () => {
    axios
      .post(`${MAIN_URL}/subgroup/`, {
        subgroup_name: sub_group_name,
        group_id: group_id,
      })
      .then((res) => {
        const data = res.data;
        setSubgroupId(data.id);

        history("/lesson/subgroups/create-team", {
          state: {
            subgroup_name: sub_group_name,
            num_of_groups: num_of_groups,
            group_id: group_id,
            subgroup_id: data.id,
            lesson_name: lesson_name,
          },
        });
      });
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-1"></div>
          <div className="col-10 bg-light px-5 h-100">
            <h4 className="border-bottom my-5 pb-1">{lesson_name}</h4>
            <div className="container">
              <div className="d-flex align-items-center flex-column">
                <input
                  type="text"
                  className="form-control mb-5"
                  id="sub_group_name"
                  placeholder="Багын ажлийн нэр оруулна уу"
                  value={sub_group_name}
                  onChange={(e) => setSubgroupName(e.target.value)}
                />
                <div className="d-flex justify-content-start w-100">
                  <span className="align-bottom p-2 mr-2">
                    БАГИЙН ТОО ОРУУЛНА УУ{" "}
                  </span>
                  <input
                    type="number"
                    className="form-control "
                    id="teamNum"
                    placeholder="0"
                    style={{ width: "100px" }}
                    value={num_of_groups}
                    onChange={(e) => setNumOfGroups(e.target.value)}
                  />
                </div>

                <div>
                  <Link
                    to="/lesson"
                    className="btn btn-outline-dark m-5"
                    role="button"
                    style={{ width: "150px" }}
                  >
                    ЦУЦЛАХ
                  </Link>
                  <div
                    to="/lesson/subgroups/create-team"
                    onClick={createSubGroup}
                    className="btn btn-primary m-5"
                    role="button"
                    style={{ width: "150px" }}
                  >
                    НЭЭХ
                  </div>
                </div>
              </div>
              <div className="col-1"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateSubgroup;
