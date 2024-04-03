import React, { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import "./User.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Pagination from "../Pagination/Pagination";

const User = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("auth-token")

  // PAGINATION
  const [PageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const firstPageIndex = (currentPage - 1) * PageSize;
  const lastPageIndex = firstPageIndex + PageSize;
  const currentTableData = users.slice(firstPageIndex, lastPageIndex);
  // PAGINATION

  useEffect(() => {
    // GET USERS LIST
    fetch("http://localhost:8000/api/users", {
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
        setUsers(data.users)
      }
      );
    // GET USERS LIST
  }, []);

  // USER DELETE
  async function handleUserDelete(id) {
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
        return fetch("http://localhost:8000/api/users/" + id, {
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
            if (response) {
              const updatedUsers = users.filter((user) => user.id !== id);
              setUsers(updatedUsers);
              toast.success(response.message, { autoClose: 500 });
            }
          });
      }
    });
  }
  // USER DELETE

  // USER EDIT
  async function handleUserEdit(id) {
    navigate("/user-edit/" + id);
  }
  // USER EDIT

  return (
    <Container fluid>
      <div className="user-create">
        <h3>Users List</h3>
        <Button
          variant="success"
          size="sm"
          onClick={() => navigate("/new-user")}
        >
          Create User
        </Button>
      </div>
      <Table bordered hover size="md">
        <thead>
          <tr>
            <th width="150">#</th>
            <th width="870">Name</th>
            <th width="870">Email</th>
            <th width="800">Created-At</th>
            <th width="200" className="text-center">
              Edit
            </th>
            <th width="200" className="text-center">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          {currentTableData.map((user, index) => {
            return (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.created_at}</td>
                <td className="text-center">
                  <Button
                    variant="light"
                    size="sm"
                    onClick={async () => {
                      await handleUserEdit(user.id);
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
                      await handleUserDelete(user.id);
                    }}
                    disabled={user.id == localStorage.getItem("user_id")}
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
        totalCount={users.length}
        pageSize={PageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </Container>
  );
};

export default User;
