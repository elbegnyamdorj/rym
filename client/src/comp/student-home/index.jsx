import React, { Component } from "react";
import Navbar from "../navbar";
import axios from "axios";
import { MAIN_URL } from "../../urls";
import CardList from "../lesson-card-list";
class StudentHome extends Component {
  constructor(props) {
    super(props);
    this.state = { group_list: [] };
  }
  componentDidMount() {
    axios
      .get(`${MAIN_URL}/home/`, {
        params: {
          student_id: localStorage.getItem("user_id"),
        },
      })
      .then((res) => {
        const data = res.data;
        this.setState({ group_list: data });
      });
  }

  render() {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-1"></div>
            <div className="col-10 bg-light mh-100 px-5">
              {this.state.group_list && (
                <CardList
                  group_list={this.state.group_list}
                  isTeacher={false}
                />
              )}
            </div>
            <div className="col-1"></div>
          </div>
        </div>
      </>
    );
  }
}
export default StudentHome;
