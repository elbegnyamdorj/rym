import React, { Component } from "react";
import axiosInstance from "../axiosApi";
import { Link, useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import "./login-style.css";
import jwt from "jwt-decode";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "", message: "", isLoading: false };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    try {
      this.setState({ isLoading: true });
      const response = axiosInstance
        .post("/token/obtain/", {
          email: this.state.email,
          password: this.state.password,
        })
        .then((response) => {
          if (response) {
            axiosInstance.defaults.headers["Authorization"] =
              "JWT " + response.data.access;
            const token = jwt(response.data.access);
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            localStorage.setItem("user_id", token.user_id);
            localStorage.setItem("user_type_id", token.user_type_id_id);
            console.log(token.user_type_id_id);
            if (token.user_type_id_id === 1) {
              window.location.href = "/lesson";
            } else {
              window.location.href = "/home";
            }
            return response.data;
          } else {
            console.log("aldaa");
          }
        });
      this.setState({
        message: "Нэвтрэх нэр эсвэл нууц үг буруу байна",
        isLoading: false,
      });
    } catch (error) {
      console.log("error");
      throw error;
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="containers">
            <div>
              <img
                src={"./ufelogo.png"}
                class="img-fluid float-left"
                width="80"
              />
            </div>
            <div className="garchig">НЭВТРЭХ</div>
            <input
              type="text"
              placeholder="email@ufe.edu.mn"
              name="email"
              required
              className="login-inputs"
              value={this.state.email}
              onChange={this.handleChange}
            />
            <input
              type="password"
              placeholder="нууц үг"
              name="password"
              className="login-inputs"
              required
              value={this.state.password}
              onChange={this.handleChange}
            />
            {this.state.message && (
              <Alert variant="danger">{this.state.message}</Alert>
            )}
            <label>
              <input type="checkbox" name="remember" label="namaig sana" />{" "}
              Remember Me
            </label>
            {this.state.isLoading === false ? (
              <button class="btnlogin" type="submit" value="Submit">
                НЭВТРЭХ
              </button>
            ) : (
              <button
                class="btnlogin"
                type="submit"
                value="Submit"
                disabled="true"
              >
                НЭВТРЭХ
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </button>
            )}
            <span className="psw">
              <a href="#">Forgot Password?</a>
            </span>
            <Link to="/signup" className="btn btn-light signupbtn ">
              Бүртгүүлэх
            </Link>
          </div>
        </form>
      </div>
    );
  }
}
export default Login;
