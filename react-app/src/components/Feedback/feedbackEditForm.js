import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

import "./feedback.css";

function FeedbackEditForm() {
  const navigate = useNavigate(); // FOR NAVIGATION
  const token = localStorage.getItem("auth-token")
  const params = useParams();
  const feedback_id = params.id;

  const intialValues = {
    title: "",
    description: "",
    category: ""
  };
  const [formValues, setFormValues] = useState(intialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  useEffect(() => {
    // GET FEEDBACK INFO
    fetch("http://localhost:8000/api/feedbacks/" + feedback_id, {
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
      .then((response) => setFormValues(response.feedback));
    // GET FEEDBACK INFO
  }, []);

  // FORM VALIDATION
  const errors = {};
  const validate = async (values) => {
    if (!values.title) {
      errors.title = "Title is required!";
    }

    if (!values.description) {
      errors.description = "Description is required!";
    }

    if (!values.category) {
      errors.category = "Category is required!";
    }

    setFormErrors(errors);
    setIsSubmit(false);
    return errors;
  };
  // FORM VALIDATION

  // HANDLE FEEDBACK CREATE
  const updateFeedback = async (data) => {
    return await fetch("http://localhost:8000/api/feedbacks/" + feedback_id, {
      method: "PATCH",
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
  // HANDLE FEEDBACK CREATE

  // HANDLE FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    await validate(formValues);

    if (Object.keys(errors).length === 0) {
      const feedback = await updateFeedback(formValues);

      if (feedback) {
        setIsSubmit(true);
        toast.success(feedback.message, { autoClose: 1000 });
        setTimeout(() => {
          navigate("/feedbacks");
        }, 1000);
      } else {
        setIsSubmit(false);
        toast.error(feedback.message, { autoClose: 1000 });
      }
    }
  };
  // HANDLE FORM SUBMIT

  // HANDLE CANCEL BUTTON
  const handleCancel = () => {
    navigate("/feedbacks");
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
            <h3 className="mt-4"> Update Feedback Info </h3>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group className="form-group mt-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formValues.title}
                  onChange={handleChange}
                  className="form-control mt-1"
                  placeholder="Enter Title"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.title}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="form-group mt-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={formValues.description}
                  onChange={handleChange}
                  className="form-control mt-1"
                  placeholder="Enter Description"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.description}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="form-group mt-3">
                <Form.Label>Category</Form.Label>
                <Form.Select name="category" onChange={handleChange} value={formValues.category}>
                  <option>Please Select</option>
                  <option key="bug_report" value="bug_report">Bug Report</option>
                  <option key="feature_request" value="feature_request">Feature Request</option>
                  <option key="improvement" value="improvement">Improvement</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formErrors.category}
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

export default FeedbackEditForm;
