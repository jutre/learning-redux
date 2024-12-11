/**
 * returns markup with menu containing two links: to all books list and to favorite book list, assigns a dedicated
 * active css class name to a menu entry if menu url is equal with current page's url
 */
import { useLocation, Link } from "react-router-dom";
import { routes } from "../config";


function BooksListTypeMenu () {
  let menuEntries = [
    {linkText: "All books", url: routes.bookListPath},
    {linkText: "Favorite books", url: routes.favoriteBooksListPath}
  ];

  let currentPath = useLocation().pathname;
  
  return (
    <div className="list_type_menu">
      <div className="items_wrapper">
        {(menuEntries).map((entry, index) =>
          <div  key={index} 
                className={"item" + (currentPath === entry.url ? " active" : "")}>
            <Link to={entry.url}><span>{entry.linkText}</span></Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default BooksListTypeMenu;