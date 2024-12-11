import { useState, useRef, useCallback } from 'react';
import store from "../../store/store";
import { selectBooksListByTitle } from "../../features/booksSlice";
import { routes } from '../../config';
import { Link, useNavigate } from "react-router-dom";

function SearchBar() {
  //holds value of controlled <input/> element
  const [searchTerm, setSearchTerm] = useState("");

  //search result list could be displayed based only on criteria that local search result variable is not empty, but we have additional
  //functionality - when user clicks any element in document outside of search bar while there are search results, 
  //result bar becomes hidden and when user focused input field (which still has same text) after that, result list is displayed again.
  //For that a state variable for search list visibility and storing rearch result is needed
  const [isSearchResultBarVisible, setIsSearchResultBarVisible] = useState(false);
  const [searchResult, setSearchResult] = useState([]);


  let bookListWithSearchResultUrl = routes.bookListPath + "?search=" + searchTerm;

  //needed for detecting that user clicked outside of search bar div
  const beginningOfSearchBarRef = useRef(null);

  //ref to window.document for adding click event listener 
  //(for performance issues don't use directly document.addEventListener/removeEventListener)
  const documentRef = useRef(document);

  //for focusing text input field after clicking on "clear input field" button
  const searchInputFieldRef = useRef();


  /**
   * This is a function attached to window.document as "click" event handler when there is any input in search string input field.
   * Function does following - when user clicks any element except anchor ("a" tag) in document outside of search bar starting div, 
   * hide search result list; if clicked element was inside anchor ("a" tag), then additionally set result list to empty array,
   * set search input field's value to empty string and remove this function from window.document, actually "reset" search bar 
   * as user havigated to other page.
   * Event listerner function is created using useCallback() hook. This is done to be able to remove
   * previously attached event handler when needeed as on each render of React component a defined  
   * function inside component is created as new function and such function won't be removed by a 
   * document.removeEventListener() call. Using useCallback creates memorized function which
   * can be removed byremoveEventListener() method.
   */
  const manageSearchBarOnClickOutsideOfSearchBar = useCallback((event)=>{

    let anchorElementFound = false;
    let eventPropogationPathElement = event.target;
    while (eventPropogationPathElement) {
      //traverse elements starting from clicked element to every next ancestor.
      //If search bar beginning element is found, don't do anytning as we have clicked inside of search bar
      if (eventPropogationPathElement === beginningOfSearchBarRef.current) {
        return;
      }

      //if one of ancestors is anchor element <a></a>, remember that, click was on element inside anchor
      if (eventPropogationPathElement.nodeName === "A" && anchorElementFound === false) {
        anchorElementFound = true;
      }

      eventPropogationPathElement = eventPropogationPathElement.parentNode;
    }

    //we have clicked outside of search bar div - 
    //hide search results bar - set menu opened state to false. It might be already be
    //hidden (state is 'false'), setting it to 'false' again won't cause re-render, don't check "if it is already 'false'"
    //(we can't check current React's components state variable conveniently in event handler attached
    //outside of component because of React lifecycle; possible could with some additional hacks, but we won't do it this time)
    setIsSearchResultBarVisible(false);
    

    //if the click was inside anchor element, also set search term input field's value to empty string and clear search results.
    //A click on link outside of search bar means a user is navigated to same page according to react-router setup but search
    //bar remains unchanged. Here result list is removed and input field is cleared to make user feel as he is traditionally
    //navigated to other page. Also remove current event handler as search bar is not used when navigated to new page
    if (anchorElementFound) {
      setSearchTerm("");
      setSearchResult([]);
      documentRef.current.removeEventListener('click', manageSearchBarOnClickOutsideOfSearchBar);
    }  
  }, [])


  /**
   * depending on current search text input field value, performs search, displays result list in popup div
   * @param {*} event 
   */

  function handleSearchTermInputChange(event) {
    let searchTermOriginal = event.target.value;
    //original text goes to state (controller input in React)
    setSearchTerm(searchTermOriginal);
    
    //when user inputs some string in search bar, we need to add an event lister that hides search bar on click anywhere in doc 
    //(except on search bar) and additionally clears search input field if the element user clicked is an anchor (link)
    //to make user feel the same as traditional page is navigated to page according to link (we need those actions
    //as links are react-router managed)
    if(searchTermOriginal.length === 0) {
      documentRef.current.removeEventListener('click',manageSearchBarOnClickOutsideOfSearchBar);
    }else{
      documentRef.current.addEventListener('click', manageSearchBarOnClickOutsideOfSearchBar);
    }

    //for performing searching use trimmed input string
    let filterText = event.target.value.trim();

    //search phrase length is less than three symbols - searching is not performed in such case.
    //If search results div is currently displayed, hide it, remove any results from results state 
    //(search bar visiblity state var might be "true" in situations when there were results from previous search input 
    //string when length was three or more symbols)
    if (filterText.length < 3) {  
      if (isSearchResultBarVisible) {
        setIsSearchResultBarVisible(false);
        setSearchResult([]);
      }

    //try to find books by title
    } else {
      //here Redux store is used directly. As a first reason this is done instead of using react-redux.useSelector hook
      //is technical - data in this component from store in needed only in case when user performs searching, searching is 
      //processed in event handler function and in here we can't invoke React hooks. 
      //We could get data from state using useSelector hook in render() method of component, but it would be waste of resources
      //as user might even not perform searching, also this component would unnecesarry re-render when books state changes, like
      //book gets added, deleted      
      let searchResultTemp = selectBooksListByTitle(store.getState(), filterText);

      //set current search result to state (it might be also an empty array if nothing found)  
      setSearchResult(searchResultTemp);

      //if we have search results, then show the result bar
      if (searchResultTemp.length > 0) {
        setIsSearchResultBarVisible(true);

        //if search result is empty with current input, hide result bar, it might be visible 
        //because in previous input where something matched search text;
      } else {
        if (isSearchResultBarVisible) {
          setIsSearchResultBarVisible(false);
        }
      }
    }
  }


  /**
   * set all state variables of search bar to initial state, and removes related  event listener
   * Does following:
   * 1) Sets search term text input field value to empty string
   * 2) hides results bar (migth be visible from current input) 
   * 3) sets search results to empty array (migth be present with current search string input)
   * 4) removes event listener from window.document that hides result list on search bar when user clicks anywhere in 
   * documet except on search bar
   */
  function resetSearchBar(){
    setSearchTerm('');
    setIsSearchResultBarVisible(false);
    setSearchResult([]);
    documentRef.current.removeEventListener('click',manageSearchBarOnClickOutsideOfSearchBar);
  }

  /**
   * when use clicks "clear input field" button then resets search bar and focus on search phrase input field
   */
  function handleSearchInputClearing() {
    searchInputFieldRef.current.focus();
    resetSearchBar();
  }

  /**
    * when search string input field becomes focused and there are search results then display resut list
    * (search results might be present with current string in input field, but hidden as user removed focus 
    * from input field)
    */
  function handleSearchInputFocus() { 
    if (searchResult.length > 0) {
      setIsSearchResultBarVisible(true);
    }
  }

  /**
   * Removes entered string from search input field and clears related state variables when user clicks on link in 
   * search bar result list.
   * 
   * When user clicks on a link in search result list, the page does not refresh as links are react-router managed, 
   * the seach bar does not change anyway visually and technically - result list is visible, input field contains endred string.
   * To make user feel the same as traditional page is navigated to page according to link, we must hide result list and 
   * clear input field.
   * This metod resets all state variables in search bar:
   * - set search term text input field value to empty string,
   * - hide result list
   * - set search results to empty array
   * - remove event listener to document that manages search bar when user clicks anywhere in doc except on search bar
   * 
   * The click bubbles from a clicked react-rounter link, this method must be set as click event handler to a parent element
   * of react-router created link to immidiatelly capture the click event and be executed. React router manages routing as needed
   * and displays content in dedicated section, but it this event handler search bar ir cleared
   */
  function handleSearchResultLinkClick() {
    resetSearchBar();
  }



  const navigate = useNavigate();

  /**
   * Removes entered string from search input field and clears related state variables when user submits search form
   * and redirects to book list url with added "search" query parameter with value as string that is entered in
   * search bar input field.
   * 
   * The redirection after form submittion is done using react-router, the page is not navigated or redirected, 
   * the seach bar does not change anyway visually and technically - result list is visible, input field contains endred string.
   * To make user feel the same as traditional page is navigated to page when submitted, we must hide result list and 
   * clear input field.
   * This metod resets all state variables in search bar:
   * - set search term text input field value to empty string,
   * - hide result list
   * - set search results to empty array
   * - remove event listener to document that manages search bar when user clicks anywhere in doc except on search bar
   * 
   * @param {*} event - form submit event - used to prevent submitting of page (from navigating to submitting url)
   */
  function handleSubmit(event) {
    event.preventDefault();
    //reset search bar after we add current searchTerm to url as resetting search bar sets searchTerm to empty string
    resetSearchBar();
    navigate(bookListWithSearchResultUrl);
  }

  //calculate search bar class
  let searchResultsCssClassName = "search-results";
  if (isSearchResultBarVisible) {
    searchResultsCssClassName += " active";
  }


  //result bar displays not more than defined items count. If there are more items in results, display link to all
  //results listing page which leads to book list url with entered search string
  let searchResultArrForOutput;
  let maxItemsCountForOutput = 5;
  let resultCountExceedsMaxOutputCount = false;
  if(searchResult.length > maxItemsCountForOutput){
    searchResultArrForOutput = searchResult.slice(0, maxItemsCountForOutput);
    resultCountExceedsMaxOutputCount = true;
  }else{
    searchResultArrForOutput = searchResult;
  }

  return (
    <div className="search-bar">
      {/*close opened search bar by clicking outside div that contains form and result list (they will be visible to
        user bounded in rectangle), the area outside this rectangle is "outside" */}
      <div className='form_and_results_container' ref={beginningOfSearchBarRef}>
        <form onSubmit={handleSubmit} autoComplete="off" className="search-form">
          <input type='text'
            value={searchTerm}
            onChange={handleSearchTermInputChange}
            onFocus={handleSearchInputFocus} 
            ref={searchInputFieldRef}/>

          <div className='actions'>
            {searchTerm &&
              //show input clear button only when input is not empty
              <button onClick={handleSearchInputClearing}
                className='clear' type='button' />}
            <button className='submit' type='submit' />
          </div>
        </form>

        <div className={searchResultsCssClassName}>
          
          {searchResultArrForOutput.map((book) => {
            //display result list as book titles with link to their edit page.
            //replace bookId segment in book edit route pattern
            let editUrl = routes.bookEditPath.replace(":bookId", book.id);
            return (
              <div  key={book.id} 
                    className="result_item"
                    onClick={handleSearchResultLinkClick}>
                <Link to={editUrl}>{book.title}</Link>
              </div>
            )}
          )}

          {resultCountExceedsMaxOutputCount &&
            <div className="result_item list_all_results_link" onClick={handleSearchResultLinkClick}>
              <Link to={bookListWithSearchResultUrl}>
                Show all {searchResult.length} found items...
              </Link>
            </div>
          }
        </div>
      </div>
    </div>
  );
}
export default SearchBar;