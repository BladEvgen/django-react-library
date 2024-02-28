import * as bases from "../components/bases";
import axios from "axios";
import React, { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Пароли не совпадают");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/user_register/",
        {
          email,
          password,
          confirm_password: confirmPassword,
        }
      );
      console.log(response.data);
      setMessage("Registration successful");
    } catch (error) {
      console.error("Ошибка в регистрации: ", error);
      setMessage("Произошла ошибка обратитесь к Администратору");
    }
  }

  return (
    <bases.Base2>
      <div className="container d-flex justify-content-center align-items-center vh-75">
        <div className="bg-dark text-secondary px-4 py-5 text-center w-100 w-md-75 w-lg-50 w-xl-35 mx-auto">
          <main className="form-signin w-100 m-auto">
            <form onSubmit={handleRegister}>
              <img
                className="mb-4"
                src="https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo.svg"
                alt=""
                width="72"
                height="57"
              />
              <h1 className="h3 mb-3 fw-normal">Register</h1>

              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="floatingInput">Email address</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="floatingPassword">Password</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="floatingConfirmPassword"
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label htmlFor="floatingConfirmPassword">
                  Confirm Password
                </label>
              </div>

              <button className="w-100 btn btn-lg btn-primary" type="submit">
                Register
              </button>
              {message && <p className="text-warning mt-3">{message}</p>}
            </form>
          </main>
        </div>
      </div>
    </bases.Base2>
  );
}
