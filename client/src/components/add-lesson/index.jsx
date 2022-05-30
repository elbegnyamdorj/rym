import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Navbar from "../navbar";
import { MAIN_URL } from "../../urls";
const CreateLesson = (props) => {
  const [lesson_name, setLesson_name] = useState("");
  const [group_number, setGroup_number] = useState("");
  const [student_list, setStudent_list] = useState("");
  const history = useNavigate();
  const handleSubmit = () => {
    axios
      .post(`${MAIN_URL}/group/`, {
        lesson_name: lesson_name,
        group_number: group_number,
        student_list: student_list,
        teacher_id: localStorage.getItem("user_id"),
      })
      .then((res) => {
        const data = res.data;
        alert("Хичээлийн групп амжилттай үүслээ");
        history("/lesson/subgroups", {
          state: {
            group_id: data.id,
            isTeacher: true,
            lesson_name: lesson_name,
            group_number: group_number,
          },
        });
      });
  };
  const handleStudentListChange = (e) => {
    setStudent_list(e.target.value);
  };
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-1"></div>
          <div className="col-10 bg-light px-5 h-100">
            <h4 className="border-bottom my-5 pb-1">ХИЧЭЭЛ НЭМЭХ</h4>
            <div className="container">
              <div className="row">
                <div className="col-sm-6 text-left">
                  <textarea
                    required
                    className="form-control mb-5"
                    aria-label="With textarea"
                    placeholder="student@ufe.edu.mn , .."
                    style={{ height: "300px" }}
                    value={student_list}
                    onChange={handleStudentListChange}
                  ></textarea>
                </div>
                <div className="col-sm-6 d-flex align-items-center flex-column">
                  <input
                    type="text"
                    className="form-control mb-5"
                    required
                    id="lesson_name"
                    placeholder="Хичээлийн нэр оруулна уу"
                    value={lesson_name}
                    onChange={(e) => setLesson_name(e.target.value)}
                  />
                  <input
                    type="number"
                    required
                    className="form-control mb-5"
                    id="group_number"
                    placeholder="Группын дугаар оруулна уу"
                    value={group_number}
                    onChange={(e) => setGroup_number(e.target.value)}
                  />
                  <Button
                    className="btn btn-primary mt-5"
                    onClick={() => handleSubmit()}
                    role="button"
                    style={{ width: "150px" }}
                  >
                    ХИЧЭЭЛ НЭЭХ
                  </Button>
                  <Link
                    className="btn btn-outline-dark mt-2"
                    role="button"
                    style={{ width: "150px" }}
                    to="/lesson"
                  >
                    ЦУЦЛАХ
                  </Link>
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
export default CreateLesson;
