import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./User.css";

function UserEditForm() {
  const navigate = useNavigate(); // FOR NAVIGATION
  const [roles, getRoles] = useState([]); // GET ALL ROLES FROM DB
  const params = useParams();
  const user_id = params.id;

  const intialValues = {
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    role: "",
    gender: "",
  };

  const [formValues, setFormValues] = useState(intialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  useEffect(() => {
    // GET ROLES LIST
    fetch("http://localhost:8000/roles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => getRoles(data));

    // GET ROLES LIST

    // GET USER INFO
    fetch("http://localhost:8000/users/" + user_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((response) => {
        if (response.statusCode === 200) {
          setFormValues(response.user);
        }
      });
    // GET USER INFO
  }, []);

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

    if (!values.role) {
      errors.role = "Role is required";
    }

    if (!values.gender) {
      errors.gender = "Gender is required";
    }

    setFormErrors(errors);
    setIsSubmit(false);
    return errors;
  };
  // FORM VALIDATION

  // HANDLE USER CREATE
  const updateUserInfo = async (data) => {
    return await fetch("http://localhost:8000/users/" + data.id, {
      method: "PATCH",
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
      const token = await updateUserInfo(formValues);

      if (token.statusCode === 200) {
        setIsSubmit(true);
        toast.success(token.message, { autoClose: 1000 });
        setTimeout(() => {
          navigate("/users");
        }, 1000);
      } else {
        toast.error(token.message, { autoClose: 1000 });
        setIsSubmit(false);
      }
    }
  };
  // HANDLE FORM SUBMIT

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
            <h3 className="mt-4"> Update User Info </h3>
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
                  value={formValues.last_name}
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
                  value={formValues.email}
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
                  value={formValues.contact}
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
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role"
                  value={formValues.role.id}
                  onChange={handleChange}
                >
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
                    checked={formValues.gender === "male"}
                    onChange={handleChange}
                  />
                  <Form.Check
                    inline
                    label="Female"
                    value="female"
                    name="gender"
                    type={"radio"}
                    id={`female`}
                    checked={formValues.gender === "female"}
                    onChange={handleChange}
                  />
                  <Form.Check
                    inline
                    label="Other"
                    value="other"
                    name="gender"
                    type={"radio"}
                    id={`other`}
                    checked={formValues.gender === "other"}
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
                <Button
                  className="float-end"
                  type="submit"
                  disabled={isSubmit}
                  variant="secondary"
                >
                  Update
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

export default UserEditForm;
