import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "../navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MAIN_URL } from "../../urls";
import { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaEdit, FaPlusSquare } from "react-icons/fa";
const RatingCriteria = () => {
  const location = useLocation();
  const history = useNavigate();
  const [rc_list, setRc_list] = useState([]);
  const [user_id, setUser_id] = useState(localStorage.getItem("user_id"));
  const [rc_name, setRc_name] = useState("");
  const [description, setDescription] = useState("");
  const [is_default, setIs_default] = useState(false);
  const [id, setId] = useState();
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setRc_name("");
    setDescription("");
    setIs_default(false);
    setId();
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  const [show1, setShow1] = useState(false);

  const handleClose1 = () => {
    setRc_name("");
    setDescription("");
    setIs_default(false);
    setId();
    setShow1(false);
  };
  const handleShow1 = (el) => {
    setRc_name(el.rc_name);
    setDescription(el.description);
    setIs_default(el.is_default);
    setId(el.id);
    setShow1(true);
  };
  const getRc = () => {
    axios
      .get(`${MAIN_URL}/rating-criteria/`, {
        params: {
          teacher_id: user_id,
        },
      })
      .then((res) => {
        const data = res.data;

        setRc_list(data);
      });
  };
  const onUpdate = () => {
    axios
      .put(`${MAIN_URL}/rating-criteria/`, {
        rc_name: rc_name,
        description: description,
        is_default: is_default,
        teacher_id: user_id,
        id: id,
      })
      .then((res) => {
        const data = res.data;
        handleClose1();
        getRc();
      });
  };
  const onSubmit = () => {
    axios
      .post(`${MAIN_URL}/rating-criteria/`, {
        rc_name: rc_name,
        description: description,
        is_default: is_default,
        teacher_id: user_id,
      })
      .then((res) => {
        const data = res.data;
        handleClose();
        getRc();
        alert("Амжилттай нэмлээ");
      });
  };
  useEffect(() => {
    getRc();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-1"></div>
          <div className="col-10 bg-light px-5 h-100">
            <div className="container">
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Үнэлгээний шалгуур нэмэх</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <label>Шалгуурын нэр</label>
                  <input
                    type="text"
                    className="form-control mb-3"
                    required
                    placeholder="Шалгуурын нэр оруулна уу"
                    value={rc_name}
                    onChange={(e) => setRc_name(e.target.value)}
                  />
                  <label>Шалгуурын тайлбар</label>
                  <textarea
                    required
                    className="form-control mb-3"
                    aria-label="With textarea"
                    placeholder="..."
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  ></textarea>
                  <label>Default шалгуур</label>
                  <input
                    type="checkbox"
                    checked={is_default}
                    onChange={(e) => {
                      if (is_default) {
                        setIs_default(false);
                      } else {
                        setIs_default(true);
                      }
                    }}
                  />
                </Modal.Body>
                <Modal.Footer style={{ flexWrap: "nowrap" }}>
                  <Button variant="primary" onClick={onSubmit}>
                    Нэмэх
                  </Button>
                  <Button variant="secondary" onClick={handleClose}>
                    Цуцлах
                  </Button>
                </Modal.Footer>
              </Modal>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">ҮНЭЛГЭЭНИЙ НЭР</th>
                    <th scope="col">ТАЙЛБАР</th>
                    <th scope="col" style={{ textAlign: "center" }}>
                      DEFAULT
                    </th>
                    <th>
                      <Button
                        variant="success"
                        className="w-75"
                        onClick={handleShow}
                      >
                        Нэмэх <FaPlusSquare />
                      </Button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rc_list.map((el, index) => (
                    <tr>
                      <th scope="row">{index + 1}</th>
                      <td>{el.rc_name}</td>
                      <td>{el.description}</td>
                      <td style={{ textAlign: "center" }}>
                        <input type="checkbox" checked={el.is_default} />
                      </td>
                      <td>
                        <Button
                          variant=""
                          className="w-75"
                          onClick={(e) => handleShow1(el)}
                        >
                          Засах <FaEdit />
                        </Button>

                        <Modal show={show1} onHide={handleClose1}>
                          <Modal.Header closeButton>
                            <Modal.Title>Үнэлгээний шалгуур засах</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <label>Шалгуурын нэр</label>
                            <input
                              type="text"
                              className="form-control mb-3"
                              required
                              placeholder="Шалгуурын нэр оруулна уу"
                              value={rc_name}
                              onChange={(e) => setRc_name(e.target.value)}
                            />
                            <label>Шалгуурын тайлбар</label>
                            <textarea
                              required
                              className="form-control mb-3"
                              aria-label="With textarea"
                              placeholder="..."
                              value={description}
                              onChange={(e) => {
                                setDescription(e.target.value);
                              }}
                            ></textarea>
                            <label>Default шалгуур</label>
                            <input
                              type="checkbox"
                              checked={el.is_default}
                              checked={is_default}
                              onChange={(e) => {
                                if (is_default) {
                                  setIs_default(false);
                                } else {
                                  setIs_default(true);
                                }
                              }}
                            />
                          </Modal.Body>
                          <Modal.Footer style={{ flexWrap: "nowrap" }}>
                            <Button variant="primary" onClick={onUpdate}>
                              Хадгалах
                            </Button>
                            <Button variant="secondary" onClick={handleClose1}>
                              Цуцлах
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-1"></div>
        </div>
      </div>
    </>
  );
};

export default RatingCriteria;
