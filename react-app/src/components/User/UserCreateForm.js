import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

import "./User.css";

function UserCreateForm() {
  const navigate = useNavigate(); // FOR NAVIGATION
  const token = localStorage.getItem("auth-token")

  const intialValues = {
    name: "",
    email: "",
    password: "",
    c_password: "",
  };
  const [formValues, setFormValues] = useState(intialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [state, setPasswordState] = useState("password");
  const [cState, setCPasswordState] = useState("password");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // FORM VALIDATION
  const errors = {};
  const validate = async (values) => {
    const emailRegEx =
      /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;

    if (!values.name) {
      errors.name = "Name is required!";
    }

    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!emailRegEx.test(values.email)) {
      errors.email = "Invalid email format!";
    }

    if (!values.password) {
      errors.password = "Password is required!";
    } else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    } else if (values.password.length > 16) {
      errors.password = "Password cannot be more than 16 characters";
    }

    if (!values.c_password) {
      errors.c_password = "Confirm password is required!";
    } else if (values.c_password.length < 4) {
      errors.c_password = "Confirm password must be more than 4 characters";
    } else if (values.c_password.length > 16) {
      errors.c_password = "Confirm password cannot be more than 16 characters";
    }

    if (values.password !== values.c_password) {
      errors.c_password = "Password and Confirm Password should be same";
    }

    setFormErrors(errors);
    setIsSubmit(false);
    return errors;
  };
  // FORM VALIDATION

  // HANDLE USER CREATE
  const createNewUser = async (data) => {
    return await fetch("http://localhost:8000/api/users", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },

      body: JSON.stringify(data),
    }).then((data) => {
      if (!data.ok) throw new Error(data.status);
      else return data.json();
    });
  };
  // HANDLE USER CREATE

  // HANDLE FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    await validate(formValues);

    if (Object.keys(errors).length === 0) {
      const user = await createNewUser(formValues);

      if (user) {
        setIsSubmit(true);
        toast.success(user.message, { autoClose: 1000 });
        setTimeout(() => {
          navigate("/users");
        }, 1000);
      } else {
        setIsSubmit(false);
        toast.error(user.message, { autoClose: 1000 });
      }
    }
  };
  // HANDLE FORM SUBMIT

  // HANDLE PASSWORD SHOW/HIDE
  const handleShowHide = (e) => {
    e.preventDefault();
    let temp;

    if (state === "password") {
      temp = "text";
    } else {
      temp = "password";
    }

    setPasswordState(temp);
  };

  const handleCShowHide = (e) => {
    e.preventDefault();
    let temp;

    if (cState === "password") {
      temp = "text";
    } else {
      temp = "password";
    }

    setCPasswordState(temp);
  };
  // HANDLE PASSWORD SHOW/HIDE

  // HANDLE CANCEL BUTTON
  const handleCancel = () => {
    navigate("/users");
  };
  // HANDLE CANCEL BUTTON

  return (
    <Container>
      <div className="user-form">
        <Form
          className="me-5 mt-4 ms-5"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <Row className="mb-3">
            <h3 className="mt-4"> Create New User </h3>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group className="form-group mt-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                  className="form-control mt-1"
                  placeholder="Enter Name"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="form-group mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={handleChange}
                  className="form-control mt-1"
                  placeholder="Enter Email"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group className="form-group mt-3">
                <Form.Label>Password</Form.Label>
                <InputGroup className="form-group mt-1">
                  <Form.Control
                    type={state}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter Password"
                    name="password"
                  />

                  <InputGroup.Text onClick={handleShowHide}>
                    {state === "password" ? (
                      <AiFillEyeInvisible />
                    ) : (
                      <AiFillEye />
                    )}
                  </InputGroup.Text>
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  {formErrors.password}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="form-group mt-3">
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup className="form-group mt-1">
                  <Form.Control
                    type={cState}
                    onChange={handleChange}
                    className="form-control"
                    name="c_password"
                    placeholder="Enter Confirm Password"
                  />
                  <InputGroup.Text onClick={handleCShowHide}>
                    {cState === "password" ? (
                      <AiFillEyeInvisible />
                    ) : (
                      <AiFillEye />
                    )}
                  </InputGroup.Text>
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  {formErrors.c_password}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="d-grid gap-2 mt-3">
            <Row className="mb-3">
              <Col>
                <Button className="float-end" type="submit" variant="secondary">
                  Submit
                </Button>
                <ToastContainer />
              </Col>

              <Col>
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </div>
    </Container>
  );
}

export default UserCreateForm;
