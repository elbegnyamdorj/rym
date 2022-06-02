import React, { Component } from "react";
import LessonCard from "../lesson-card";
import { Link } from "react-router-dom";
import "./lesson-card-list-style.css";

class CardList extends Component {
  render() {
    if (this.props.isTeacher) {
      return (
        <div>
          <h3 className=" my-5 pb-1 border-bottom">ХИЧЭЭЛҮҮД</h3>
          <div className="card-list">
            <div className="card text-center shadow p-3 mb-5 rounded-4 border-0 card-style">
              <div className="card-body">
                <i className="fas fa-plus"></i>
                <h1>+</h1>
                <p className="card-text">ХИЧЭЭЛ НЭМЭХ</p>
                <Link className="stretched-link" to="/lesson/create"></Link>
              </div>
            </div>
            {this.props.group_list.map((el) => (
              <LessonCard
                key={el.id}
                created_at={el.created_at}
                group_id={el.id}
                lesson_name={el.lesson_name}
                group_number={el.group_number}
                isTeacher={this.props.isTeacher}
              />
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h4 className=" my-5 pb-1 border-bottom">ХИЧЭЭЛҮҮД</h4>
          <div className="card-list">
            {this.props.group_list.map((el) => (
              <LessonCard
                key={el.id}
                created_at={el.created_at}
                group_id={el.id}
                lesson_name={el.lesson_name}
                group_number={el.group_number}
                isTeacher={this.props.isTeacher}
              />
            ))}
          </div>
        </div>
      );
    }
  }
}
export default CardList;
