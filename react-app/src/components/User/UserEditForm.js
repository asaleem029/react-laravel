import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./User.css";

function UserEditForm() {
  const navigate = useNavigate(); // FOR NAVIGATION
  const params = useParams();
  const user_id = params.id;
  const token = localStorage.getItem("auth-token");

  const intialValues = {
    name: "",
    email: "",
  };

  const [formValues, setFormValues] = useState(intialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  useEffect(() => {
    // GET USER INFO
    fetch("http://localhost:8000/api/users/" + user_id, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
    })
      .then((data) => {
        if (!data.ok) throw new Error(data.status);
        else return data.json();
      })
      .then((response) => setFormValues(response.user));
    // GET USER INFO
  }, []);

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

    setFormErrors(errors);
    setIsSubmit(false);
    return errors;
  };
  // FORM VALIDATION

  // HANDLE USER CREATE
  const updateUserInfo = async (data) => {
    return await fetch("http://localhost:8000/api/users/" + data.id, {
      method: "PATCH",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (!response.ok) throw new Error(response.status);
      else return response.json();
    });
  };
  // HANDLE USER CREATE

  // HANDLE FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    await validate(formValues);

    if (Object.keys(errors).length === 0) {
      const response = await updateUserInfo(formValues);

      if (response) {
        setIsSubmit(true);
        toast.success(response.message, { autoClose: 1000 });
        setTimeout(() => {
          navigate("/users");
        }, 1000);
      } else {
        toast.error(response.message, { autoClose: 1000 });
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
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                  className="form-control mt-1"
                  placeholder="Enter First Name"
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
