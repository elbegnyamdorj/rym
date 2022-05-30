import React, { Component } from "react";
import Select from "react-select";
export class TeamElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team_name: this.props.dugaar + "-р баг",
      selected: [],
      data: [],
    };
  }
  componentDidMount() {
    this.setState({ data: this.props.data });
  }

  handleChange = (selected) => {
    let data = { id: this.props.dugaar, selected: selected };
    this.props.passCurrentSelection({
      id: this.props.dugaar,
      selected: selected,
    });
    if (this.state.selected.length > selected.length) {
      var filtered_array = this.state.selected.filter(
        (ar) => !selected.find((rm) => rm.value === ar.value)
      );
      this.props.onRemoved(filtered_array[0]);
    } else {
      this.props.onSelected(data);
    }
    this.setState({ selected: selected });
  };

  render() {
    let options = [];
    this.props.data.map((el) =>
      options.push({ value: el.id, label: el.first_name + " " + el.email })
    );
    return (
      <div>
        <h4 className="border-bottom my-5 pb-1">{this.state.team_name}</h4>
        <Select
          isMulti
          onChange={this.handleChange}
          name="colors"
          options={options}
          className="basic-multi-select"
          classNamePrefix="select"
        />
      </div>
    );
  }
}

export default TeamElement;
