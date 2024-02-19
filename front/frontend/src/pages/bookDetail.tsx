import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import * as footers from "../components/footers";
import * as navbars from "../components/navbars";
interface Book {
  id: number;
  title: string;
  description: string;
  book_image: string;
  categories: string[];
  author_name: string[];
  book_file: string;
}

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8000/api/book/?id=${id}`
        );
        setBook(response.data.data[0]);
        console.log(response.data.data[0]);
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (!book) {
    return (
      <div>
        {" "}
        {isLoading && (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
          </div>
        )}
        {!isLoading && (
          <div
            className="d-flex flex-column justify-content-center align-items-center text-danger"
            style={{ height: "100vh" }}>
            <h1 className="font-weight-bold display-5 mb-3 ">
              Данные не найдены
            </h1>
            <Link to="/" type="button" className="btn btn-sm btn-outline-light">
              Вернуться домой
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <navbars.Navbar1></navbars.Navbar1>
      <div className="custom-body">
        <div className="container py-5">
          <div className="row">
            <div className="col-md-6">
              <img
                src={book.book_image}
                alt={book.title}
                className="img-fluid rounded max-width-100"
                style={{ maxHeight: "700px", objectFit: "cover" }}
              />
            </div>
            <div className="col-md-6">
              <h2 className="d-flex justify-content-center font-weight-bold fs-1">
                {book.title}
              </h2>
              <p className="fs-4" style={{ textAlign: "justify" }}>
                {book.description}
              </p>
              {book.book_file && (
                <a href={book.book_file} className="btn btn-primary" download>
                  Скачать
                </a>
              )}
            </div>
          </div>
        </div>
        <footers.Footer1></footers.Footer1>
      </div>
    </div>
  );
};
export default BookDetail;
