import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";
import { ToastContainer, toast } from "react-toastify";

async function loginUser(credentials) {
  return fetch("http://localhost:8000/auth/login", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  function validateForm() {
    return (
      email !== undefined &&
      email.length > 0 &&
      password !== undefined &&
      password.length > 0
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    localStorage.clear();

    const token = await loginUser({
      email,
      password,
    });

    if (token.statusCode === 200) {
      localStorage.setItem("auth-token", token.user);
      toast.success(token.message, { autoClose: 1000 });
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      toast.error(token.message, { autoClose: 2000 });
    }
  };

  return (
    <div className="Auth-form-container">
      <Form className="Auth-form" onSubmit={handleSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <Form.Group className="form-group mt-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="form-control mt-1"
              placeholder="Enter email"
            />
          </Form.Group>

          <Form.Group className="form-group mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="form-control mt-1"
              placeholder="Enter password"
            />
          </Form.Group>

          <Form.Group className="d-grid gap-2 mt-3">
            <Button
              type="submit"
              variant="secondary"
              disabled={!validateForm()}
            >
              Submit
            </Button>
            <ToastContainer />
          </Form.Group>

          <p className="float-right mt-2">
            <p>Sign-Up</p>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default Login;
