import React, { Component } from 'react';
import Navbar from '../navbar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { MAIN_URL } from '../../urls';
const MyScore = () => {
  const [lessonList, setLessonList] = useState([]);
  const [allRatingAvg, setAllRatingAvg] = useState();
  const [criteriaAvg, setCriteriaAvg] = useState([]);
  const [user_id] = useState(localStorage.getItem('user_id'));
  const getLessonList = () => {
    axios
      .get(`${MAIN_URL}/rating/myhistory/`, {
        params: {
          student_id: user_id,
        },
      })
      .then((res) => {
        const data = res.data;
        setLessonList(data);
      });
  };
  const getAllTimeRatings = () => {
    axios
      .get(`${MAIN_URL}/rating/all/`, {
        params: {
          student_id: user_id,
        },
      })
      .then((res) => {
        const data = res.data;
        setAllRatingAvg(data.main_avg);
        setCriteriaAvg(data.criteria_avg);
      });
  };
  const onLessonClick = (group_id) => {
    console.log(group_id);
  };
  useEffect(() => {
    getAllTimeRatings();
    getLessonList();
  }, []);
  return (
    <>
      <Navbar />
      <div className='container '>
        <div className='row justify-content-center'>
          <div className='col-2 '></div>
          <div className='col-8 bg-light px-5 '>
            <h4 className='border-bottom my-5 pb-1'> </h4>
            <div id='accordion'>
              <div className='card'>
                <div className='card-header' id='headingNiit'>
                  <button
                    className='btn btn-lg btn-block w-100'
                    data-toggle='collapse'
                    data-target='#collapseNiit'
                    aria-expanded='true'
                    aria-controls='collapseNiit'
                  >
                    <div className='container'>
                      <div className='row'>
                        <div className='col-sm-8 text-left'>
                          МИНИЙ НИЙТ ОНОО
                        </div>
                        <div className='col-sm-3'>
                          <b>{allRatingAvg} </b>
                        </div>
                        <div className='col-sm-1'></div>
                      </div>
                    </div>
                  </button>
                </div>

                <div
                  id='collapseNiit'
                  className='collapse'
                  aria-labelledby='headingNiit'
                  data-parent='#accordion'
                >
                  <div className='card-body'>
                    <table className='table'>
                      <thead>
                        <tr>
                          <th scope='col'>ШАЛГУУР</th>
                          <th scope='col'>
                            <b>ОНОО</b>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {criteriaAvg.map((i) => (
                          <tr>
                            <td>{i.rating_name}</td>
                            <td>
                              <b>{i.rating_value}</b>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <h4 className='border-bottom my-5 pb-1'>ХИЧЭЭЛҮҮД</h4>
            {lessonList.map((i) => (
              <div id='accordion' key={i.group_id}>
                <div className='card'>
                  <div className='card-header' id='headingLes'>
                    <h5 className='mb-0'>
                      <button
                        className='btn btn-block w-100'
                        data-toggle='collapse'
                        data-target={'#' + i.lesson_name.replace(/ /g, '')}
                        aria-expanded='true'
                        aria-controls={i.lesson_name.replace(/ /g, '')}
                        onClick={() => onLessonClick(i.group_id)}
                      >
                        <div className='container'>
                          <div className='row'>
                            <div className='col-sm-3 text-left'>
                              {i.lesson_name}
                            </div>
                            <div className='col-sm-9'>
                              <b> {i.rating_value}</b>
                            </div>
                            <div className='col-sm-1'></div>
                          </div>
                        </div>
                      </button>
                    </h5>
                  </div>

                  <div
                    id={i.lesson_name.replace(/ /g, '')}
                    className='collapse'
                    aria-labelledby='headingLes'
                    data-parent='#accordion'
                  >
                    <div className='card-body'>
                      <table className='table'>
                        <thead>
                          <tr>
                            <th scope='col'>ШАЛГУУР</th>
                            <th scope='col'>ОНОО</th>
                          </tr>
                        </thead>
                        <tbody>
                          {i.criteria_rating.map((i) => (
                            <tr>
                              <td>{i.rating_name}</td>
                              <td>
                                <b>{i.rating_value}</b>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className='list-unstyled border rounded p-3 mt-2'>
                        <h5>Давуу тал, авууштай зан чанар</h5>
                        {i.good_comm.map((j) => (
                          <p>{j}</p>
                        ))}
                      </div>
                      <div className='list-unstyled border rounded p-3 mt-2'>
                        <h5>
                          Цаашид анхаарч, хөгжүүлвэл зохих ур чадвар, зан чанар
                        </h5>
                        {i.bad_comm.map((j) => (
                          <p>{j}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='col-2'></div>
        </div>
      </div>
    </>
  );
};

export default MyScore;
