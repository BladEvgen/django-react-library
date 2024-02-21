import * as bases from "../components/bases";
import axios from "axios";
import React, { useState } from "react";

export default function Page() {
  const [token, setToken] = useState("");

  async function Login() {
    try {
      const response = await axios.post(`http://localhost:8000/api/token/`, {
        username: "admin",
        password: "admin",
      });
      console.log(response);

      const accessToken = response.data.access;
      setToken(accessToken);
    } catch (error) {
      console.error("error Login: ", error);
    }
  }

  async function GetData() {
    try {
      const config = {
        url: `http://localhost:8000/api/users/`,
        method: "GET",
        timeout: 5000,
        timeoutErrorMessage: "timeout error",
        headers: {
          // @ts-ignore
          Authorization: `Bearer ${token}`,
        },
        data: {},
      };
      const response = await axios(config);
      console.log("success GetData: ", response);
    } catch (error) {
      console.error("error GetData: ", error);
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
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                />
                <label htmlFor="floatingInput">Email address</label>
              </div>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
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

              <p className="mt-5 mb-3 text-body-secondary">© 2017–2023</p>
            </form>
          </main>
          {/* Тестовые кнопки которые помогают просмотреть token  */}
          <button
            className="btn btn-primary w-100 py-2"
            type="submit"
            onClick={Login}>
            Sign in
          </button>
          <button
            className="btn btn-danger w-100 py-2"
            type="submit"
            onClick={GetData}>
            GetData
          </button>
          <p className="text-warning d-flex justify-content-center">{token}</p>
        </div>
      </div>
    </bases.Base2>
  );
}
