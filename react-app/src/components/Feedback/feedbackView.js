import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./feedback.css";
import { BiEdit } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CommentEditModal from "./CommentEditModal";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function FeedbackView() {
  const token = localStorage.getItem("auth-token")
  const auth_user_id = localStorage.getItem("user_id")
  const params = useParams();
  const feedback_id = params.id;

  // FEEDBACK DETAILS
  const intialFeedbackValues = {
    title: "",
    description: "",
    category: ""
  };

  const [feedbackValues, setfeedbackValues] = useState(intialFeedbackValues);
  const [feedbackComments, setfeedbackComments] = useState([]);
  // FEEDBACK DETAILS

  // COMMENT INITIAL VALUE
  const intialValues = {
    comment: "",
    feedback_id: feedback_id
  };
  // COMMENT INITIAL VALUE

  const [formValues, setFormValues] = useState(intialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [usersList, setUsersList] = useState([]);

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
      .then((response) => {
        setfeedbackValues(response.feedback)
        setfeedbackComments(response.feedback.comments)
      });
    // GET FEEDBACK INFO

    // GET USERS LIST
    fetch("http://localhost:8000/api/users", {
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
      .then((response) => {
        let usersArray = []
        response.users.map((user) => {
          usersArray.push({ text: user.name, value: user.name })
        })

        setUsersList(usersArray);
      });
    // GET USERS LIST
  }, []);

  // FORM VALIDATION
  const errors = {};
  const validate = async (values) => {
    if (!values.comment) {
      errors.comment = "Comment is required!";
    }

    setFormErrors(errors);
    setIsSubmit(false);
    return errors;
  };
  // FORM VALIDATION

  // HANDLE COMMENT CREATE
  const addComment = async (data) => {
    return await fetch("http://localhost:8000/api/comments", {
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
  // HANDLE COMMENT CREATE

  // HANDLE FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    await validate(formValues);

    if (Object.keys(errors).length === 0) {
      const comment = await addComment(formValues);

      if (comment) {
        setIsSubmit(true);

        // RESET COMMENT TEXTBOX AFTER SUBMITION OF COMMENT
        let textBox = document.getElementsByClassName("public-DraftEditor-content")
        let span = textBox[0].lastChild.lastChild.lastChild.lastChild.lastChild
        span.innerHTML = " "

        setFormValues({
          ...formValues,
          comment: "",
          feedback_id: ""
        });
        // RESET COMMENT TEXTBOX AFTER SUBMITION OF COMMENT

        // REFRESH COMMENTS LIST AFTER SUBMITIION OF COMMENT
        setfeedbackComments(comment.commentsList)

        toast.success(comment.message, { autoClose: 1000 });
      } else {
        setIsSubmit(false);
        toast.error(comment.message, { autoClose: 1000 });
      }
    }
  };
  // HANDLE FORM SUBMIT

  // COMMENT DELETE
  async function handleCommentDelete(id) {
    const MySwal = withReactContent(Swal);

    MySwal.fire({
      title: "Are you sure?",
      icon: "question",
      text: "You want to delete?",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        return fetch("http://localhost:8000/api/comments/" + id, {
          method: "DELETE",
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
          .then((response) => {
            toast.success(response.message, { autoClose: 1000 });
            const comments = feedbackComments.filter((comment) => comment.id !== id);
            setfeedbackComments(comments);
          });
      }
    });
  }
  // COMMENT DELETE

  // COMMENT EDIT
  const [modalShow, setModalShow] = useState(false);
  const [commentId, setCommentId] = useState(false);

  async function handleCommentEdit(id) {
    setCommentId(id);
    setModalShow(true);
  }
  // COMMENT EDIT

  // REFRESH COMMENTS LIST AFTER COMMENT UPDATE
  const updateCommentList = useCallback(val => {
    setfeedbackComments(val);
  }, [setfeedbackComments]);
  // REFRESH COMMENTS LIST AFTER COMMENT UPDATE

  // SET COMMENT FORM VALUES
  const onEditorStateChange = function (editorState) {
    setFormValues({
      ...formValues,
      comment: editorState.getCurrentContent().getPlainText("\u0001"),
      feedback_id: feedback_id
    });
  };
  // SET COMMENT FORM VALUES

  return (
    <Container>
      <CommentEditModal
        modalShow={modalShow}
        setModalShow={setModalShow}
        commentId={commentId}
        setCommentId={setCommentId}
        feedbackComments={feedbackComments}
        feedbackCommentSetter={updateCommentList}
        usersList={usersList}
        setUsersList={setUsersList}
      />

      <div className="user-form">
        <Form className="me-5 mt-4 ms-5">
          <Row className="mb-3">
            <h3 className="mt-4"> Feedback </h3>
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
                  disabled
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="form-group mt-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={
                    feedbackValues.category == "bug_report" ? "Bug Report"
                      : feedbackValues.category == "feature_request" ? "Feature Request"
                        : "Improvement"
                  }
                  className="form-control mt-1"
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className="form-group">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={feedbackValues.description}
                  className="form-control mt-1"
                  as="textarea"
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>

        <Form
          className="me-5 ms-5"
          id="comment-form"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >

          <Form.Group className="mt-3">
            <Editor
              formValues={formValues}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={onEditorStateChange}
              mention={{
                separator: " ",
                trigger: "@",
                suggestions: usersList
              }}
            />

            <Form.Control.Feedback type="invalid">
              {formErrors.comment}
            </Form.Control.Feedback>

            <Button className="mt-1" type="submit" variant="secondary">
              Submit
            </Button>
            <ToastContainer />
          </Form.Group>
        </Form>

        <Card className="mt-2 ms-5 me-5 mb-2" style={{ width: 'auto' }}>
          <Card.Header>Comments</Card.Header>
          <Card.Body>
            {
              feedbackComments.map((com) => {
                return (
                  <div className="comment text-justify" key={com.id}>
                    <div className="d-flex mt-1 ms-1">
                      <p style={{ fontSize: "12px" }}>{com.user_name}</p>
                      <span style={{ fontSize: "12px" }}> - {new Date(com.created_at).toLocaleDateString()}</span>

                      <div className="me-1" style={{ marginLeft: 'auto' }}>
                        <Button
                          variant="light"
                          size="sm"
                          className="me-1"
                          onClick={async () => {
                            await handleCommentEdit(com.id);
                          }}
                          disabled={auth_user_id != com.user_id}
                        >
                          <BiEdit />
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={async () => {
                            await handleCommentDelete(com.id);
                          }}
                          disabled={auth_user_id != com.user_id}
                        >
                          <MdDeleteForever />
                        </Button>
                      </div>
                    </div>

                    <Card.Text className="ms-1">
                      {com.comment}
                    </Card.Text>
                  </div>
                )
              })
            }
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default FeedbackView;
