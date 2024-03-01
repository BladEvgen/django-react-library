import { Link } from "react-router-dom";
export function Navbar1() {
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
              <li> 
              <div className="input-group">
                <Link to="/login" className="btn btn-outline-success">
                  <i className="fa-solid fa-door-open p-1 m-0"></i>
                  Войти
                </Link>
                <Link to="/signup" className="btn btn-outline-warning">
                  <i className="fa-solid fa-user-plus p-1 m-0"></i>
                  Зарегистрироваться
                </Link>
              </div>
              </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}

export function Navbar2() {
  return <header></header>;
}
