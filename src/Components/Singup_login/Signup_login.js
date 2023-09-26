import React from "react";
import { useState } from "react";
import { Form } from "react-bootstrap";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function LogSignIn() {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [creds, setCreds] = useState(true);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState();

  const handleClose = () => {
    setShowModal(false);
    setMessage("");
  };
  const handleShow = (login) => {
    setIsLogin(login);
    setShowModal(true);
  };

  const getEmail = (e) => {
    console.log("Email changed", e.target.value);
    setEmail(e.target.value);
  };

  const getUserName = (e) => {
    console.log("Username changed", e.target.value);
    setUserName(e.target.value);
  };

  const getPassWord = (e) => {
    console.log("Password changed", e.target.value);
    setPassword(e.target.value);
  };

  function handleSubmit(event) {
    event.preventDefault();
    axios
      .post("/login", { email, userName, password })
      .then((response) => {
        console.log(response.data.message);
        setUserName(response.data.userName);
        setCreds(false);
        setMessage("You successfully logged in!");
      })
      .catch((error) => {
        console.log(error);
        setMessage("Failed to log in. Please check your credentials.");
      });
  }

  const handleNewUser = (event) => {
    event.preventDefault();
    axios
      .post("/register", { email, userName, password })
      .then((response) => {
        console.log(response.data.message);
        setUserName(response.data.userName);
        setMessage("You successfully registered!");
      })
      .catch((error) => {
        console.log(error);
        setMessage(
          "Failed to register. Please check the information provided."
        );
      });
  };

  return (
    <>
      {creds ? (
        <header className="login">
          <div className="loginBtns">
            <button
              className="btn btn-black rounded-pill my-button"
              onClick={() => handleShow(true)}
            >
              Log In
            </button>
            <button
              className="btn btn-white rounded-pill my-button"
              onClick={() => handleShow(false)}
            >
              Sign Up
            </button>
          </div>
        </header>
      ) : (
        <header className="login">
          <div className="loginBtns">
            <button className="btn btn-black rounded-pill my-button">
              {userName} {/* Display the logged in username */}
            </button>
          </div>
        </header>
      )}

      {isLogin ? (
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Log In</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {" "}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  onChange={getEmail}
                  required
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  onChange={getUserName}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={getPassWord}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3">
                Submit
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <p>{message}</p>
            <Button variant="outline-light" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Sign Up</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {" "}
            <Form onSubmit={handleNewUser}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  onChange={getEmail}
                  required
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  onChange={getUserName}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={getPassWord}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-3">
                Submit
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <p>{message}</p>
            <Button variant="outline-light" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default LogSignIn;
