import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "./feedback.css";

function FeedbackView() {
  const token = localStorage.getItem("auth-token")
  const params = useParams();
  const feedback_id = params.id;

  const intialValues = {
    title: "",
    description: "",
    category: ""
  };
  const [feedbackValues, setfeedbackValues] = useState(intialValues);

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
      .then((response) => setfeedbackValues(response.feedback));
    // GET FEEDBACK INFO
  }, []);

  return (
    <Container>
      <div className="user-form">
        <Form className="me-5 mt-4 ms-5">
          <Row className="mb-3">
            <h3 className="mt-4"> Feedback Details </h3>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group className="form-group mt-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={feedbackValues.title}
                  className="form-control mt-1"
                  readOnly
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="form-group mt-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={feedbackValues.category}
                  className="form-control mt-1"
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className="form-group mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={feedbackValues.description}
                  className="form-control mt-1"
                  as="textarea"
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>
    </Container>
  );
}

export default FeedbackView;
