import App from "..";
import * as bases from "../components/bases";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Navbar1 } from "../components/navbars";
interface BookResponse {
  data: any[];
  total_count: number;
}
interface Category {
  categories_title: string;
  categories_slug: string;
}

interface Author {
  author_name: string;
  author_slug: string;
}
export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newData, setNewData] = useState<any[]>([]);
  const [xtotalCount, setXtotalCount] = useState(1);
  const [page, setPage] = useState(Number(localStorage.getItem("page")) || 1);
  const [category, setCategory] = useState(
    localStorage.getItem("category") || ""
  );
  const [author, setAuthor] = useState(localStorage.getItem("author") || "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    async function fetchCategoriesAndAuthors() {
      try {
        const categoriesResponse = await axios.get(
          "http://localhost:8000/api/categories/"
        );
        setCategories(categoriesResponse.data.data);
        const authorsResponse = await axios.get(
          "http://localhost:8000/api/authors/"
        );
        setAuthors(authorsResponse.data.data);
      } catch (error) {
        console.error("Error fetching categories and authors:", error);
      }
    }

    fetchCategoriesAndAuthors();
  }, []);

  useEffect(() => {
    fetchData(page, category, author);
  }, [page, category, author]);

  async function fetchData(page: number, category?: string, author?: string) {
    setIsLoading(true);
    try {
      let url = `http://localhost:8000/api/book?page=${page}`;
      if (category) {
        url += `&category=${category}`;
        localStorage.setItem("category", category);
      }
      if (author) {
        url += `&author=${author}`;
        localStorage.setItem("author", author);
      }

      const bookResponse = await axios.get<BookResponse>(url);

      setNewData(bookResponse.data.data);
      setXtotalCount(bookResponse.data.total_count);
      localStorage.setItem("page", String(page));
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(`Error ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  function computePageNumber(count: number, limit: number): number[] {
    try {
      let totalPage = Math.ceil(count / limit);
      let pages = [];
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
      }
      return pages;
    } catch (error) {
      console.error(`Error computing page number: ${error}`);
      return [];
    }
  }

  return (
    <div>
      <bases.Base2>
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
          {!isLoading && !error && (
            <div className={"container"}>
              <div className="d-flex justify-content-center">
                <nav aria-label="...">
                  <ul className="pagination">
                    <li className="page-item">
                      <button
                        className={
                          page <= 1 ? "page-link disabled" : "page-link "
                        }
                        onClick={() => {
                          if (page > 1) {
                            setPage(page - 1);
                            fetchData(page - 1);
                          }
                        }}>
                        Previous
                      </button>
                    </li>

                    {computePageNumber(xtotalCount, 4).map(
                      (item: any, index: number) => (
                        <li
                          className={`page-item ${item === page ? "active" : ""}`}
                          key={index}>
                          <button
                            className="page-link"
                            onClick={() => {
                              setPage(item);
                              fetchData(item);
                            }}>
                            {item}
                          </button>
                        </li>
                      )
                    )}
                    <li className="page-item">
                      <button
                        className={
                          page >= computePageNumber(xtotalCount, 4).length
                            ? "page-link disabled"
                            : "page-link"
                        }
                        onClick={() => {
                          if (page < computePageNumber(xtotalCount, 4).length) {
                            setPage(page + 1);
                            fetchData(page + 1);
                          }
                        }}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className={"row"}>
                <div className={"col-lg-3"}>
                  <div style={{ position: "sticky", top: 0 }}>
                    <div className="list-group mb-3 w-100">
                      <h5>Категории</h5>
                      <a
                        href="#"
                        className={`list-group-item list-group-item-action ${
                          category === "" ? "active" : ""
                        }`}
                        onClick={() => {
                          setCategory("");
                          setAuthor("");
                          localStorage.removeItem("category");
                          localStorage.removeItem("author");
                        }}>
                        Сбросить фильтры
                      </a>
                      {categories.map((categoryItem, index) => (
                        <a
                          href="#"
                          className={`list-group-item list-group-item-action ${
                            category === categoryItem.categories_slug
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setCategory(categoryItem.categories_slug)
                          }
                          key={index}>
                          {categoryItem.categories_title}
                        </a>
                      ))}
                    </div>
                  </div>{" "}
                  <div className="mb-3">
                    <h5>Авторы</h5>
                    <div className="list-group">
                      {authors.map((authorItem, index) => (
                        <a
                          href="#"
                          className={`list-group-item list-group-item-action ${
                            author === authorItem.author_slug ? "active" : ""
                          }`}
                          onClick={() => setAuthor(authorItem.author_slug)}
                          key={index}>
                          {authorItem.author_name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={"col-lg-9"}>
                  <div className={"row"}>
                    {newData.map((item: any, index: number) => (
                      <div className="col-md-3 mb-3" key={index}>
                        <div
                          className="card mb-4 box-shadow"
                          style={{ height: "100%" }}>
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
                              data-holder-rendered="true"
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
                                <Link
                                  to={`/bookDetail/${item.id}`}
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary">
                                  View
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div>
              <p className="text-danger"> {error}</p>
            </div>
          )}
        </div>
        <div className="d-flex justify-content-center">
          <nav aria-label="...">
            <ul className="pagination">
              <li className="page-item">
                <button
                  className={page <= 1 ? "page-link disabled" : "page-link "}
                  onClick={() => {
                    if (page > 1) {
                      setPage(page - 1);
                      fetchData(page - 1);
                    }
                  }}>
                  Previous
                </button>
              </li>

              {computePageNumber(xtotalCount, 4).map(
                (item: any, index: number) => (
                  <li
                    className={`page-item ${item === page ? "active" : ""}`}
                    key={index}>
                    <button
                      className="page-link"
                      onClick={() => {
                        setPage(item);
                        fetchData(item);
                      }}>
                      {item}
                    </button>
                  </li>
                )
              )}
              <li className="page-item">
                <button
                  className={
                    page >= computePageNumber(xtotalCount, 4).length
                      ? "page-link disabled"
                      : "page-link"
                  }
                  onClick={() => {
                    if (page < computePageNumber(xtotalCount, 4).length) {
                      setPage(page + 1);
                      fetchData(page + 1);
                    }
                  }}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </bases.Base2>
    </div>
  );
}
