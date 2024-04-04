import { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ToastContainer, toast } from 'react-toastify';

function CommentEditModal(props) {
  // GETTING AUTH TOKEN
  const token = localStorage.getItem("auth-token");

  // INITIAL VALUES FOR FORM
  const intialValues = {
    comment: "",
    feedback_id: ""
  };
  const [formValues, setFormValues] = useState(intialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const commentId = props.commentId;

  useEffect(() => {
    if (commentId)
      // GET COMMENT INFO
      fetch("http://localhost:8000/api/comments/" + commentId, {
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
          setFormValues(response.comment) // SETTING FORM VALUES
        });
    // GET COMMENT INFO
  }, [commentId, setFormValues]);

  // HANDLE FORM CHANGE VALUES
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  // HANDLE FORM CHANGE VALUES

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

  // HANDLE COMMENT UPDATE
  const updateComment = async (data) => {
    return await fetch("http://localhost:8000/api/comments/" + commentId, {
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
  // HANDLE COMMENT UPDATE

  // HANDLE FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    await validate(formValues); // VALIDATE FORM VALUES

    if (Object.keys(errors).length === 0) {
      const comment = await updateComment(formValues); // CALL COMMENT UPDATE FUNCTION

      if (comment) {
        setIsSubmit(true);
        toast.success(comment.message, { autoClose: 1000 }); // SHOW SUCCESS MESSAGE
        props.setModalShow(false) // CLOSE MODAL
        props.feedbackCommentSetter(comment.commentsList) // UPDATE COMMENTS LIST
      } else {
        setIsSubmit(false);
        toast.error(comment.message, { autoClose: 1000 });
      }
    }
  };
  // HANDLE FORM SUBMIT

  return (
    <>
      <Modal
        show={props.modalShow}
        onHide={() => props.setModalShow(false)}
        size="lg"
        centered
      >
        <Modal.Body>
          <Form
            className="me-5 mt-4 ms-5"
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >

            <Row className="mb-3">
              <Col>
                <Form.Group className="form-group mt-3">
                  <Form.Control
                    type="text"
                    name="comment"
                    value={formValues.comment}
                    onChange={handleChange}
                    className="form-control mt-1"
                    placeholder="Enter Comment"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.comment}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="d-grid gap-2 mt-3">
              <Row className="mb-3">
                <Col>
                  <Button className="float-end" type="submit" variant="secondary">
                    Update
                  </Button>
                  <ToastContainer />
                </Col>

                <Col>
                  <Button onClick={() => props.setModalShow(false)}>Close</Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CommentEditModal;