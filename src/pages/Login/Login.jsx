import React, { useEffect, useRef, useState } from "react";
import styles from "./Login.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../../components/Alert/Alert";
import { useAlert } from "../../context/AlertContext";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    document.title = "Staff Login";
  }, []);

  const login = (e) => {
    e.preventDefault();
    // Retrieve input values from refs
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    console.log({ username, password });
    if (username === "admin" && password === "password") {
      showAlert("User logged in successfully", "success");
      navigate("/home");
      return;
    }
    showAlert("Wrong username or password", "error");
  };

  return (
    <div className={styles.container}>
      <h1>Staff Login</h1>
      <form id={styles.loginForm} onSubmit={login}>
        <div className={styles["form-group"]}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter username"
            ref={usernameRef}
            required
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="password">Password:</label>
          <div className={styles["icon-input"]}>
            <input
              type={!showPassword ? "password" : "text"}
              id="password"
              name="password"
              placeholder="Enter your password"
              ref={passwordRef}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        </div>
        <div className={styles["form-group"]}>
          <button id="login-button" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
