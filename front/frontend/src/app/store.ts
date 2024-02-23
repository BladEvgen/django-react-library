import { configureStore, createSlice, ThunkAction, Action, Dispatch } from '@reduxjs/toolkit';
import axios from "axios";

interface BookResponse {
  data: any[];
  total_count: number;
}

interface Category {
  name: string;
  slug: string;
}

interface Author {
  name: string;
  slug: string;
}

const initialState = {
  isLoading: false,
  error: null,
  newData: [],
  xtotalCount: 1,
  page: Number(localStorage.getItem("page")) || 1,
  category: localStorage.getItem("category") || "",
  author: localStorage.getItem("author") || "",
  categories: [] as Category[],
  authors: [] as Author[]
};

const slice = createSlice({
  name: "data",
  initialState,
  reducers: {
    fetchDataStart(state) {
      state.isLoading = true;
    },
    fetchDataSuccess(state, action) {
      state.isLoading = false;
      state.newData = action.payload.data;
      state.xtotalCount = action.payload.total_count;
      state.error = null;
    },
    fetchDataFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setCategory(state, action) {
      state.category = action.payload;
      localStorage.setItem("category", action.payload);
    },
    setAuthor(state, action) {
      state.author = action.payload;
       localStorage.setItem("author", action.payload);
    },
    setCategories(state, action) {
      state.categories = action.payload;
    },
    setAuthors(state, action) {
      state.authors = action.payload;
    }
  }
});

export const { fetchDataStart, fetchDataSuccess, fetchDataFailure, setPage, setCategory, setAuthor, setCategories, setAuthors } = slice.actions;

export const fetchCategories = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get<{ data: Category[]; total_count: number }>('http://localhost:8000/api/categories/');
    dispatch(setCategories(response.data.data));
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

export const fetchAuthors = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get<{ data: Author[]; total_count: number }>('http://localhost:8000/api/authors/');
    dispatch(setAuthors(response.data.data));
  } catch (error) {
    console.error('Error fetching authors:', error);
  }
};

export const fetchData = (page: number, category?: string, author?: string) => async (dispatch: AppDispatch) => {
  dispatch(fetchDataStart());
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

    dispatch(fetchDataSuccess(bookResponse.data));
    localStorage.setItem("page", String(page));
  } catch (error) {
    console.error("Error fetching data:", error);
    dispatch(fetchDataFailure(`Error ${error}`));
  }
};

export const store = configureStore({
  reducer: slice.reducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = Dispatch<Action<string>>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;