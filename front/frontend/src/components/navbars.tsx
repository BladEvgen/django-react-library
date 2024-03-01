import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function Navbar1() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = () => {
    const accessToken = getCookie("accessToken");
    if (accessToken) {
      setLoggedIn(true);
      const username = getCookie("username");
      if (username) {
        setUsername(username);
      }
    }
  };

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  };

  const handleLogout = () => {
    document.cookie = "accessToken=;max-age=0";
    document.cookie = "username=;max-age=0";
    setLoggedIn(false);
    setUsername("");
  };

  return (
    <div className="container">
      <header>
        <nav className="navbar navbar-expand-lg bg-dark text-white">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand text-white">
              Navbar
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    to="/"
                    className="nav-link active text-white"
                    aria-current="page">
                    Home
                  </Link>
                </li>
              </ul>
              <ul style={{ listStyleType: "none" }}>
                {loggedIn ? (
                  <>
                    <li>
                      <span className="text-white me-3">{username}</span>
                    </li>
                    <li>
                      <button
                        className="btn btn-outline-danger"
                        onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login" className="btn btn-outline-success">
                        <i className="fa-solid fa-door-open p-1 m-0"></i> Войти
                      </Link>
                    </li>
                    <li>
                      <Link to="/signup" className="btn btn-outline-warning">
                        <i className="fa-solid fa-user-plus p-1 m-0"></i>{" "}
                        Зарегистрироваться
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
