import App from "..";
import * as bases from "../components/bases";
import React, { useState, useEffect } from "react";

import axios from "axios";
import { Link } from "react-router-dom";
interface BookResponse {
  data: any[];
  total_count: number;
}
export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newData, setNewData] = useState<any[]>([]);
  const [xtotalCount, setXtotalCount] = useState(1);
  const [page, setPage] = useState(Number(localStorage.getItem("page")) || 1);

  async function fetchData(page: number) {
    setIsLoading(true);
    try {
      const bookResponse = await axios.get<BookResponse>(
        `http://localhost:8000/api/book?page=${page}`
      );

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

  useEffect(() => {
    fetchData(page);
  }, []);

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
          <div className={"container-fluid"}>
            <div className={"row"}>
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

                  {computePageNumber(xtotalCount, 2).map(
                    (item: any, index: number) => (
                      <li
                        className={`page-item ${item === page ? "active" : ""}`}>
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
                        page >= computePageNumber(xtotalCount, 2).length
                          ? "page-link disabled"
                          : "page-link"
                      }
                      onClick={() => {
                        if (page < computePageNumber(xtotalCount, 2).length) {
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
              {newData.map((item: any, index: number) => (
                <div className="col-md-4" key={index}>
                  <div className="card mb-4 box-shadow">
                    <p className="text-center">{item.title}</p>
                    <img
                      className="card-img-top"
                      alt={item.title}
                      data-holder-rendered="true"
                      src={item.book_file}
                    />
                    <div className="card-body">
                      <p className="card-text">
                        {item.description.length > 150
                          ? item.description.substring(0, 150) + "..."
                          : item.description}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-group">
                          <Link
                            to={item.book_scr}
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
        )}
        {error && (
          <div>
            <p className="text-danger"> {error}</p>
          </div>
        )}
      </div>
    </bases.Base2>
  );
}
