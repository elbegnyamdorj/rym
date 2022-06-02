import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
export class SubgroupElement extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Link
        to="/lesson/subgroups/teams"
        state={{
          group_id: this.props.group_id,
          group_number: this.props.group_number,
          lesson_name: this.props.lesson_name,
          subgroup_id: this.props.id,
          subgroup_name: this.props.subgroup_name,
        }}
      >
        <Button className="btn btn-outline-link btn-lg py-2 mt-4 btn-light btn-block w-100">
          {this.props.subgroup_name}
        </Button>
      </Link>
    );
  }
}

export default SubgroupElement;
