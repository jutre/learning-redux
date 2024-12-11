import { useEffect } from "react";
import { Link } from "react-router-dom";
import { routes } from "../../config";
import { FAVORITE_BOOKS_LIST } from "../../constants/bookListModes";
import BooksListParamProcessor from "./BooksListParamsProcessor";
import BooksListBody from "./BooksListBody";
import { setPageTitleTagValue } from "../../utils/setPageTitleTagValue";

function BooksList({listMode = null}) {
  
  let listTitle;
  if(listMode === FAVORITE_BOOKS_LIST){
    listTitle = "Favorite books";
  }else{
    listTitle = "All books";
  }

  useEffect(() => {
    setPageTitleTagValue(listTitle);
  }, [listTitle]);

  return  (
    <div className="book_list">
      <h1>{listTitle}</h1>
      <div className="add_book_link">
        <Link to={routes.createBookPath}>Add book</Link>
      </div>
      <BooksListParamProcessor listMode={listMode}/>
      <BooksListBody listMode={listMode}/>
    </div>
  )
}


export default BooksList;
