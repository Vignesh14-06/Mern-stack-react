import React, { useEffect, useState } from "react";
import "./user.css";
import axios from "axios";
import { toast } from "react-hot-toast";

const User = () => {
  const [userData, setUserData] = useState([]);
  const [searchFilteredData, setSearchFilterData] = useState([]);
  const [modalOpen, setModelOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [originalUserData, setOriginalUserData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    address: "",
  });

  const getUserData = async () => {
    try {
      const response = await axios.get(
        "https://mern-stack-f5ek.onrender.com/User/GetAllUsers"
      );
      setUserData(response?.data);
      setOriginalUserData(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  const handleChange = (e) => {
    const searchValue = e?.target?.value;
    console.log(searchValue, "sdfag");
    if (!searchValue) {
      setSearchFilterData(originalUserData); // Reset to full data if searchValue is empty
      return;
    }
    const filteredData = originalUserData?.filter((data) => {
      return (
        data?.name?.toLowerCase()?.includes(searchValue?.toLowerCase()) ||
        data?.email?.toLowerCase()?.includes(searchValue?.toLowerCase()) ||
        data?.address?.toLowerCase()?.includes(searchValue?.toLowerCase())
      );
    });
    setSearchFilterData(filteredData);
  };
  const handleSearch = () => {
    setUserData(searchFilteredData);
  };
  const handleCreate = () => {
    setModelOpen(true);
  };
  const handleClose = () => {
    setModelOpen(false);
    setEdit(false);
    setNewUser({
      name: "",
      email: "",
      address: "",
    });
  };

  const createData = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const api = edit
      ? axios.put(`https://mern-stack-f5ek.onrender.com/User/UpdateUser/${userId}`, newUser)
      : axios.post("https://mern-stack-f5ek.onrender.com/User/CreateUser", newUser);
    await api
      .then((res) => {
        handleClose();
        toast.success(res?.data?.message, { position: "bottom-center" });
        getUserData();
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message, {
          position: "bottom-center",
        });
      });
  };

  const handleUpdate = async (id) => {
    setUserId(id);
    setEdit(true);
    const response = await axios.get(
      `https://mern-stack-f5ek.onrender.com/User/GetUserById/${id}`
    );
    setNewUser(response?.data);
    setModelOpen(true);
  };
  const handleDelete = async (id) => {
    await axios
      .delete(`https://mern-stack-f5ek.onrender.com/User/DeleteUser/${id}`)
      .then((res) => {
        toast.success(res?.data?.message, { position: "bottom-center" });
        getUserData();
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message, {
          position: "bottom-center",
        });
      });
  };
  return (
    <div className="userTable">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <div>
          <button
            onClick={handleCreate}
            type="button"
            className="btn btn-primary"
          >
            Create User
          </button>
        </div>
        <div>
          <span>
            <input
              type="text"
              placeholder="Search UserDetail"
              style={{ marginTop: "6px" }}
              onChange={handleChange}
            />
          </span>
          <span className={{ height: "4px" }}>
            <button
              type="button"
              className="btn btn-warning"
              style={{ marginLeft: "5px", height: "32px", marginBottom: "4px" }}
              onClick={handleSearch}
            >
              <i
                class="fa-brands fa-searchengin fa-sm"
                style={{
                  alignItems: "center",
                  display: "flex",
                }}
              ></i>
            </button>
          </span>
        </div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">S.No</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Address</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {userData?.length > 0 ? (
            userData?.map((user, index) => (
              <tr key={user?._id}>
                <td>{index + 1}</td>
                <td>{user?.name}</td>
                <td>{user?.email}</td>
                <td>{user?.address}</td>
                <td className="actionButtons">
                  <button
                    type="button"
                    class="btn btn-info"
                    onClick={() => handleUpdate(user?._id)}
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger"
                    onClick={() => handleDelete(user?._id)}
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span onClick={handleClose} className="close">
              <i class="fa-solid fa-xmark"></i>
            </span>
            <h2>{edit ? "Update User" : "Create User"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label for="name">Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={newUser?.name}
                  onChange={createData}
                />
              </div>
              <div className="form-group">
                <label for="email">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={newUser?.email}
                  onChange={createData}
                />
              </div>
              <div className="form-group">
                <label for="address">Address:</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={newUser?.address}
                  onChange={createData}
                />
              </div>
              <div className="form-buttons">
                <button
                  type="button"
                  onClick={handleClose}
                  class="btn btn-secondary"
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  {edit ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
