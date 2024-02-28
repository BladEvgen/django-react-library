import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchData,
  setPage,
  setCategory,
  setAuthor,
  fetchCategories,
  fetchAuthors,
} from "../app/store";
import * as navbars from "../components/navbars";

export default function Home() {
  const dispatch = useDispatch();
  const {
    isLoading,
    error,
    newData,
    xtotalCount,
    page,
    category,
    author,
    categories,
    authors,
  } = useSelector((state: any) => state);

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchCategories());
    //@ts-ignore

    dispatch(fetchAuthors());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchData(page, category, author) as any);
  }, [dispatch, page, category, author]);

  const handleCategoryChange = (selectedCategory: string) => {
    dispatch(setCategory(selectedCategory));
    dispatch(setAuthor(""));
    localStorage.setItem("category", selectedCategory);
    localStorage.removeItem("author");
  };

  const handleAuthorChange = (selectedAuthor: string) => {
    dispatch(setAuthor(selectedAuthor));
    localStorage.setItem("author", selectedAuthor);
  };

  const renderCategories = () => {
    return (
      <div className="list-group mb-3 w-100">
        <h5>Категории</h5>
        <a
          href="#"
          className={`list-group-item list-group-item-action ${category === "" ? "active" : ""}`}
          onClick={() => handleCategoryChange("")}>
          Сбросить фильтры
        </a>
        {categories.map((categoryItem: any, index: number) => (
          <a
            href="#"
            className={`list-group-item list-group-item-action ${category === categoryItem.slug ? "active" : ""}`}
            onClick={() => handleCategoryChange(categoryItem.slug)}
            key={index}>
            {categoryItem.name}
          </a>
        ))}
      </div>
    );
  };

  const renderAuthors = () => {
    return (
      <div className="mb-3">
        <h5>Авторы</h5>
        <div className="list-group">
          {authors.map((authorItem: any, index: number) => (
            <a
              href="#"
              className={`list-group-item list-group-item-action ${author === authorItem.slug ? "active" : ""}`}
              onClick={() => handleAuthorChange(authorItem.slug)}
              key={index}>
              {authorItem.name}
            </a>
          ))}
        </div>
      </div>
    );
  };

  const renderBooks = () => {
    return (
      <div className="row">
        {newData.map((item: any, index: number) => (
          <div className="col-md-3 mb-3" key={index}>
            <div className="card mb-4 box-shadow">
              <h5
                className="text-center"
                style={{ color: "blue", fontWeight: "bold" }}>
                {item.title}
              </h5>
              <div style={{ height: "400px", overflow: "hidden" }}>
                <img
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  className="card-img-top"
                  alt={item.title}
                  src={item.book_image}
                />
              </div>
              <div className="card-body">
                <p className="card-text">
                  {item.description.length > 150
                    ? item.description.substring(0, 150) + "..."
                    : item.description}
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="btn-group">
                    <a
                      href={`/bookDetail/${item.id}`}
                      className="btn btn-sm btn-outline-secondary">
                      View
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div>
        {isLoading && (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}>
            <div
              className="spinner-border spinner-border-lg"
              role="status"></div>
          </div>
        )}
        <navbars.Navbar1 />
        {!isLoading && !error && (
          <div className={"container"}>
            <div className="row">
              <div className="col-lg-3">
                <div style={{ position: "sticky", top: 0 }}>
                  {renderCategories()}
                  {renderAuthors()}
                </div>
              </div>
              <div className="col-lg-9">{renderBooks()}</div>
            </div>
          </div>
        )}
        {error && (
          <div>
            <p className="text-danger">{error}</p>
          </div>
        )}
      </div>
      <div className="d-flex justify-content-center">
        <nav aria-label="...">
          <ul className="pagination">
            <li className="page-item">
              <button
                className={page <= 1 ? "page-link disabled" : "page-link "}
                onClick={() => dispatch(setPage(page - 1))}>
                Previous
              </button>
            </li>
            {Array.from(
              { length: Math.ceil(xtotalCount / 4) },
              (_, i) => i + 1
            ).map((item, index) => (
              <li
                key={index}
                className={`page-item ${item === page ? "active" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => dispatch(setPage(item))}>
                  {item}
                </button>
              </li>
            ))}
            <li className="page-item">
              <button
                className={
                  page >= Math.ceil(xtotalCount / 4)
                    ? "page-link disabled"
                    : "page-link"
                }
                onClick={() => dispatch(setPage(page + 1))}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
