import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./lesson-card-style.css";

class LessonCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="card text-right shadow p-3 mb-5 rounded-3 border-0 card-style">
        <div class="card-header bg-white">
          <h4 class="card-title">
            {this.props.lesson_name} - {this.props.group_number}
          </h4>
        </div>
        <div class="card-body">
          <p className="card-text">{this.props.created_at.substring(0, 10)}</p>
          <Link
            className="stretched-link"
            to="/lesson/subgroups"
            state={{
              group_id: this.props.group_id,
              isTeacher: this.props.isTeacher,

              group_number: this.props.group_number,
              lesson_name: this.props.lesson_name,
            }}
          ></Link>
        </div>
      </div>
    );
  }
}

export default LessonCard;
