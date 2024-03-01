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
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand">
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
                  <Link to="/" className="nav-link active" aria-current="page">
                    Home
                  </Link>
                </li>
              </ul>
              <div className="d-flex">
                {loggedIn ? (
                  <>
                    <span className="navbar-text text-warning me-3">
                      {username}
                    </span>
                    <button
                      className="btn btn-outline-danger"
                      onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i> Выход
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-outline-success me-2">
                      <i className="fas fa-sign-in-alt"></i> Войти
                    </Link>
                    <Link to="/signup" className="btn btn-outline-warning">
                      <i className="fas fa-user-plus"></i> Зарегистрироваться
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
