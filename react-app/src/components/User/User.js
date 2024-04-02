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
  const [currentUser, setCurrentUser] = useState([]);

  // PAGINATION
  const [PageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const firstPageIndex = (currentPage - 1) * PageSize;
  const lastPageIndex = firstPageIndex + PageSize;
  const currentTableData = users.slice(firstPageIndex, lastPageIndex);
  // PAGINATION

  useEffect(() => {
    // GET USERS LIST
    fetch("http://localhost:8000/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));
    // GET USERS LIST

    // GET CURRENT USER
    const parseJwt = async (token) => {
      if (!token) {
        return;
      }
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace("-", "+").replace("_", "/");
      const user = await JSON.parse(window.atob(base64));
      setCurrentUser(user);
    };

    parseJwt(localStorage.getItem("auth-token"));
    // GET CURRENT USER
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
        return fetch("http://localhost:8000/users/" + id, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((data) => data.json())
          .then((response) => {
            if (response.statusCode === 200) {
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
            <th width="550">Contact</th>
            <th width="170">Gender</th>
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
          {currentTableData.map((user) => {
            return (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.first_name + " " + user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.contact}</td>
                <td>{user.gender}</td>
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
                    disabled={user.id === currentUser.id}
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