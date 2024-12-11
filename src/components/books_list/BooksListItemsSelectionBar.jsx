import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {  bookCollectionAddedToSelection, 
          allBooksRemovedFromSelection, 
          selectIsAnyBookSelected,
          selectBooksInSelection } from "../../features/uiControlsSlice";

/**
 * This component creaters markup that displays multiple select "checkbox like" control and a delete button. Checkbox control is used
 * to do batch selecting of list items - selects all items when none is selected or deselects all if any item is selected.
 * When there are any items selected, delete button becomes active - if user clicks on it, browser url is set to deletion url
 * 
 * @param {array<int>} allDisplayedBooksIds - array of books ID currently displayed in list. In case user clicks "select all items"
 * control all of array elements are added to selected items state.
 * @param {string} searchGetParamVal - current search parameter value. After delete operation page will be redirected to list url with
 * search paramater preserved
 * @param {string} baseUrl - base path for current list (all books or favarite books list), needed to be included in delete url to
 * stay on current list when redirected to deletion url
 * @returns 
 */

function BooksListItemsSelectionBar({allDisplayedBooksIds, searchGetParamVal, baseUrl}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let isAnyBookSelected = useSelector(state => selectIsAnyBookSelected(state));
  let selectedBooks = useSelector(state => selectBooksInSelection(state));

  /**
   * process logic when user click batch selection checkbox control. 
   */
  function handleBatchSelectorClick(){
    //if at least one item in list is selected than multiple select checkbox removes all selected items from selection state
    //(and checkboxes are removed from all books)
    if(isAnyBookSelected){
      dispatch(allBooksRemovedFromSelection());

    //if no any book is selected then multiple select checkbox adds all list items to selection state (and checkboxes 
    //are displayed for each book in component that displays book info)
    }else{
      dispatch(bookCollectionAddedToSelection(allDisplayedBooksIds));
    }
  }
  

  /**
   * If there is any book selected then redirects to deletion url when user clicks on "Delete" button.
   * Creates delete parameter value by adding selected books ids to it. 
   * If list is filtered by searching string, adds search get parameter to url
   */
  function handleRedirectToDeletionUrl(){
    if(isAnyBookSelected){
      let deleteUrl = baseUrl + "?deleteId="+ selectedBooks.join(",");
      if(searchGetParamVal){
        deleteUrl += "&search=" + searchGetParamVal; 
      }
      navigate(deleteUrl);
    }
  }
  
  //if base path changes which means page is navigated from one type of list to other, like from all books to favarite books list,
  //remove currently selected books from state as a book selected in one list can be absent in other list but still residing among
  //selected books
  useEffect(() => {
    if(isAnyBookSelected){
      dispatch(allBooksRemovedFromSelection());
    }
  }, [baseUrl]);

  let batchSelectorClassName = "batch_select_control custom_checkbox";
  let batchSelectorModeTitle;
  let deleteButtonClassName = "action_button delete";

  if(isAnyBookSelected){
    batchSelectorModeTitle = "unselect all items";
    batchSelectorClassName += " all_items_deselector"; 

  }else{
    batchSelectorModeTitle = "select all items";
    batchSelectorClassName += " all_items_selector" ;
    //no any book is selected, make deletion button visually inactive
    deleteButtonClassName += " disabled";
  }

  return  (
    <div className="book_list_selection_bar">
      <div className="checkbox_wrapper">
        <button onClick={handleBatchSelectorClick}
                className={batchSelectorClassName}
                title={batchSelectorModeTitle}>
        </button>
      </div>
      
      <button className={deleteButtonClassName}
              onClick={handleRedirectToDeletionUrl}>
      </button>

    </div>
  )
}


export default BooksListItemsSelectionBar;
