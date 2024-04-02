import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Form, Row } from "react-bootstrap";
import "./Login.css";
import { ToastContainer, toast } from "react-toastify";

async function loginUser(credentials) {
  return fetch("http://localhost:8000/api/login", {
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

    const user = await loginUser({
      email,
      password,
    });

    if (user) {
      localStorage.setItem("auth-token", user.token);
      toast.success(user.message, { autoClose: 1000 });
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      toast.error(user.message, { autoClose: 2000 });
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

            <Row className="mb-3">
              <Col>
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={!validateForm()}
                >
                  Sign-In
                </Button>
              </Col>

              <Col>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/user-registration")}
                >
                  Register
                </Button>
              </Col>
            </Row>
            <ToastContainer />
          </Form.Group>
        </div>
      </Form>
    </div>
  );
};

export default Login;
