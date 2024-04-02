import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

import "./User.css";

function UserCreateForm() {
  const navigate = useNavigate(); // FOR NAVIGATION
  const [roles, getRoles] = useState([]); // GET ALL ROLES FROM DB

  const intialValues = {
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    password: "",
    c_password: "",
    role: "",
    gender: "",
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

  // GET ROLES LIST
  useEffect(() => {
    const getRoleList = async () => {
      return await fetch("http://localhost:8000/roles", {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => getRoles(data));
    };

    getRoleList();
  }, []);
  // GET ROLES LIST

  // FORM VALIDATION
  const errors = {};
  const validate = async (values) => {
    const emailRegEx =
      /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
    const contactRegEx = /^(\()?\d{3}(\))?(.|\s)?\d{3}(.|\s)\d{4}$/;

    if (!values.first_name) {
      errors.first_name = "First name is required!";
    }

    if (!values.last_name) {
      errors.last_name = "Last name is required!";
    }

    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!emailRegEx.test(values.email)) {
      errors.email = "Invalid email format!";
    }

    if (!values.contact) {
      errors.contact = "Contact is required!";
    } else if (
      !contactRegEx.test(values.contact) ||
      values.contact.length < 11
    ) {
      errors.contact = "Invalid Contact No.!";
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

    if (!values.role) {
      errors.role = "Role is required";
    }

    if (!values.gender) {
      errors.gender = "Gender is required";
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
    return await fetch("http://localhost:8000/users", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }).then((data) => data.json());
  };
  // HANDLE USER CREATE

  // HANDLE FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    await validate(formValues);

    if (Object.keys(errors).length === 0) {
      const token = await createNewUser(formValues);

      if (token.statusCode === 200) {
        setIsSubmit(true);
        toast.success(token.message, { autoClose: 1000 });
        setTimeout(() => {
          navigate("/users");
        }, 1000);
      } else {
        setIsSubmit(false);
        toast.error(token.message, { autoClose: 1000 });
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
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={formValues.first_name}
                  onChange={handleChange}
                  className="form-control mt-1"
                  placeholder="Enter First Name"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.first_name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="form-group mt-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  onChange={handleChange}
                  className="form-control mt-1"
                  placeholder="Enter Last Name"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.first_name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
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

            <Col>
              <Form.Group className="form-group mt-3">
                <Form.Label>Contact No.</Form.Label>
                <Form.Control
                  type="number"
                  name="contact"
                  onChange={handleChange}
                  className="form-control mt-1"
                  placeholder="Enter Contact No."
                  autoComplete="off"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.contact}
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

          <Row className="mb-3">
            <Col>
              <Form.Group className="form-group mt-3">
                <Form.Label>Role</Form.Label>
                <Form.Select name="role" onChange={handleChange}>
                  <option>Please Select</option>
                  {roles.map((role) => {
                    return (
                      <option key={role.id} value={role.id}>
                        {role.role_name}
                      </option>
                    );
                  })}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formErrors.role}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="form-group mt-3">
                <Form.Label>Gender</Form.Label>
                <div key={`inline-radio`} className="mb-3">
                  <Form.Check
                    inline
                    label="Male"
                    value="male"
                    name="gender"
                    type={"radio"}
                    id={`male`}
                    onChange={handleChange}
                  />
                  <Form.Check
                    inline
                    label="Female"
                    value="female"
                    name="gender"
                    type={"radio"}
                    id={`female`}
                    onChange={handleChange}
                  />
                  <Form.Check
                    inline
                    label="Other"
                    value="other"
                    name="gender"
                    type={"radio"}
                    id={`other`}
                    onChange={handleChange}
                  />
                </div>
                <Form.Control.Feedback type="invalid">
                  {formErrors.gender}
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
