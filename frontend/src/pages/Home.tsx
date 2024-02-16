import App from "..";
import * as bases from "../components/bases";
import React, { useState, useEffect } from "react";

import axios from "axios";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [newData, setNewData] = useState([]);
  const [xtotalCount, setXtotalCount] = useState(1);
  const [page, setPage] = useState(1);
  async function fetchData(page: number) {
    setIsLoading(true);
    try {
      console.log(page);
      const bookResponse = await axios.get(
        `http://localhost:8000/api/book?page=${page}`
      );

      setNewData(bookResponse.data.data);
      setXtotalCount(bookResponse.data.total_count);
      console.log(bookResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(`Error ${error}`);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchData(1);
  }, []);

  function computePageNumber(count: number, limit: number): any {
    try {
      let totalPage = Math.ceil(count / limit);
      let pages = [];
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
      }
      return pages;
    } catch (error) {
      console.log("Error computing page number:", error);
      return [];
    }
  }

  return (
    <bases.Base2>
      <div>
        {isLoading && <div className="loader"></div>}
        {!isLoading && !error && (
          <div className={"container-fluid"}>
            <div className={"row"}>
              <nav aria-label="...">
                <ul className="pagination">
                  <li className="page-item">
                    <button
                      className={
                        page >= 1 ? "page-link disabled" : "page-link "
                      }
                      onClick={() => {
                        setPage(page - 1);
                        fetchData(page - 1);
                      }}>
                      Previous
                    </button>
                  </li>

                  {computePageNumber(xtotalCount, 2).map(
                    (item: any, index: number) => (
                      <li className="page-item ">
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
                          ? "page-link"
                          : "page-link disabled "
                      }
                      onClick={() => {
                        setPage(page + 1);
                        fetchData(page + 1);
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
                      src={item.file}
                    />
                    <div className="card-body">
                      <p className="card-text">{item.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary">
                            View
                          </button>
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
