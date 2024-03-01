import * as bases from "../components/bases";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      const response = await axios.post(`http://localhost:8000/api/token/`, {
        username,
        password,
      });

      const accessToken = response.data.access;
      document.cookie = `accessToken=${accessToken};max-age=3600`;
      navigate("/");
    } catch (error) {
      console.error("Error during login: ", error);
    }
  }

  return (
    <bases.Base2>
      <div className="container-fluid d-flex justify-content-center">
        <div className="bg-dark text-secondary px-4 py-5 text-center w-25">
          <main className="form-signin w-100 m-auto">
            <form>
              <img
                className="mb-4"
                src="https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo.svg"
                alt=""
                width="72"
                height="57"
              />
              <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="Input Login"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="floatingInput">Login</label>
              </div>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="floatingPassword">Password</label>
              </div>

              <div className="form-check text-start my-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="remember-me"
                  id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  Remember me
                </label>
              </div>

              <button
                className="btn btn-primary w-100 py-2"
                type="button"
                onClick={handleLogin}>
                Sign in
              </button>
            </form>
          </main>
        </div>
      </div>
    </bases.Base2>
  );
}
