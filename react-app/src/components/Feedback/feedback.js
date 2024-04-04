import React, { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import "./feedback.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Pagination from "../Pagination/Pagination";

const Feedback = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const token = localStorage.getItem("auth-token")
  const auth_user_id = localStorage.getItem("user_id")

  // PAGINATION
  const [PageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const firstPageIndex = (currentPage - 1) * PageSize;
  const lastPageIndex = firstPageIndex + PageSize;
  const currentTableData = feedbacks.slice(firstPageIndex, lastPageIndex);
  // PAGINATION

  useEffect(() => {
    // GET FEEDBACKS LIST
    fetch("http://localhost:8000/api/feedbacks", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        else return res.json();
      })
      .then((data) => {
        setFeedbacks(data.feedbacks)
      }
      );
    // GET FEEDBACKS LIST
  }, []);

  // FEEDBACK DELETE
  async function handleFeedbackDelete(id) {
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
        return fetch("http://localhost:8000/api/feedbacks/" + id, {
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
            const updatedFeebacks = feedbacks.filter((feedback) => feedback.id !== id);
            setFeedbacks(updatedFeebacks);
          });
      }
    });
  }
  // FEEDBACK DELETE

  // FEEDBACK EDIT
  async function handleFeedBackEdit(id) {
    navigate("/feedback-edit/" + id);
  }
  // FEEDBACK EDIT

  return (
    <Container fluid>
      <div className="user-create">
        <h3>Feedback List</h3>
        <Button
          variant="success"
          size="sm"
          onClick={() => navigate("/new-feedback")}
        >
          Add New Feedback
        </Button>
      </div>
      <Table bordered hover size="md">
        <thead>
          <tr>
            <th width="150">#</th>
            <th width="870">Title</th>
            <th width="870">Description</th>
            <th width="800">Category</th>
            <th width="800">Created By</th>
            <th width="800">Created At</th>
            <th width="200" className="text-center">
              Edit
            </th>
            <th width="200" className="text-center">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          {currentTableData.map((feedback, index) => {
            return (
              <tr key={feedback.id}>
                <td>{index + 1}</td>
                <td>{feedback.title}</td>
                <td>{feedback.description}</td>
                <td>
                  {feedback.category == "bug_report" ? "Bug Report"
                    : feedback.category == "feature_request" ? "Feature Request"
                      : "Improvement"
                  }
                </td>
                <td>{feedback.user_name}</td>
                <td>{feedback.created_at}</td>
                <td className="text-center">
                  <Button
                    variant="light"
                    size="sm"
                    onClick={async () => {
                      await handleFeedBackEdit(feedback.id);
                    }}
                  >
                    <BiEdit />
                  </Button>
                  <ToastContainer />
                </td>
                <td className="text-center">
                  <Button
                    variant="light"
                    size="sm"
                    onClick={async () => {
                      await handleFeedbackDelete(feedback.id);
                    }}
                  >
                    <MdDeleteForever />
                  </Button>
                  <ToastContainer />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={feedbacks.length}
        pageSize={PageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </Container>
  );
};

export default Feedback;
