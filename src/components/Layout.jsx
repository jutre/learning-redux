import { routes } from "../config";
import { FAVORITE_BOOKS_LIST } from "../constants/bookListModes";
import SettingsMenu from "./settings_menu/SettingsMenu";
import PageHeader from "./page_header/PageHeader";
import BookEditing from "./BookEditing";
import BooksList from "./books_list/BooksList";
import BookCreating from "./BookCreating";
import BooksListTypeMenu from "./BooksListTypeMenu";
import PageNotFound from './PageNotFound';
import DataFetchingProgressIndicator from "./DataFetchingProgressIndicator";
import {
        BrowserRouter as Router,
        Routes,
        Route } from "react-router-dom";
import DataFetchingErrorMessageResetter from "./DataFetchingErrorMessageResetter";

const Layout = () => {
  return (
    <div className="root_container">
      <Router>
        {/*DataFetchingErrorMessageResetter does not output anytning but must be child of react router <Router> child
        to receive data from react router context to use it's api */}
        <DataFetchingErrorMessageResetter/>

        <div className="left_column">
          <BooksListTypeMenu/>
        </div>
        <div className="central_column">
          <PageHeader/>
          <SettingsMenu/>

          <div className="content_wrapper">
            <DataFetchingProgressIndicator />

            <Routes>
              <Route path={routes.bookListPath} element={<BooksList />} />
              <Route path={routes.favoriteBooksListPath} element={<BooksList listMode={FAVORITE_BOOKS_LIST} />} />
              <Route path={routes.bookEditPath} element={<BookEditing />} />
              <Route path={routes.createBookPath} element={<BookCreating />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </div>
        </div>
        <div className="right_column"></div>
      </Router>
    </div>
  )
}
export default Layout;
