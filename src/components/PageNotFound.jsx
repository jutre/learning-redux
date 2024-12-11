import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { routes } from "../config";
import { setPageTitleTagValue } from "../utils/setPageTitleTagValue";

function PageNotFound() {

  useEffect(() => {
    setPageTitleTagValue("Page not found");
  }, []);

  const location = useLocation();
  let pagePath = location.pathname;
  return  (
    <div className="page_not_found">
      <h1>Page not found</h1>
      <p>The page with URL "<em>{pagePath}</em>" for was not found.</p>
      
      <p>You can explore books list on <Link to={routes.bookListPath}>books list page</Link> or by using searching form 
        at the to of the page.</p> 
    </div>
  )
}


export default PageNotFound;
