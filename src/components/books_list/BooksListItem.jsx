import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { selectBookFullInfoById } from "../../features/booksSlice";
import { bookFavoriteStateToggled } from "../../features/favoriteBooksSlice";
import { bookCollectionAddedToSelection, singleBookRemovedFromSelection } from "../../features/uiControlsSlice";


export function BookListItem({bookId, editUrl, deleteUrl}) {
  
  let book = useSelector(state => selectBookFullInfoById(state, bookId));
  
  const dispatch = useDispatch();

  /**
   * handles checbox checking/unchecking event for a single book by adding or removing that book to selection for deleging.
   * Adds to deletable books selection whne checkbox is checked and removes from selection if checbox is unchecked
   * @param {change event object} event 
   */
  function handleBookSelectionForDeleting(event){
    let isCheckboxChecked = event.target.checked;
    if(isCheckboxChecked){
      //a general function for adding a collection of books is used to add single book to selection, action.payload value must be 
      //an array consisting of single element which value is bookId 
      dispatch(bookCollectionAddedToSelection([bookId]));
    
    }else{
      //to remove a book from selection, action.payload value must be integer - bookId to be removed from selection
      dispatch(singleBookRemovedFromSelection(bookId));
    }
  }

  /**
   * when cliking on favourites icon, add or remove from favourites
   */
  function handleAddToFavoritesClick(){
    dispatch(bookFavoriteStateToggled(bookId));
  }

  
  //calculate favourites icon class depending on book presence in favourites
  let addToFavoritesDivClassName = "action_button ";
  if(book.isAddedToFavorites){
    addToFavoritesDivClassName += "is-added-to-favorites";
  }else{
    addToFavoritesDivClassName += "add-to-favorites";
  }

  
  return  (
    <div className="item">
      <div className="checkbox_wrapper">
        <label>
          <input  type="checkbox" 
                  checked={book.isSelectedForDeleting}
                  onChange={handleBookSelectionForDeleting}/>
          <div className="custom_checkbox"></div>
          </label>
      </div>
      <div className="book_info">
        <div className="author">{book.author}</div>
        <div className='title'>{book.title}</div>
      </div>
      <div className="actions">
        <button className={addToFavoritesDivClassName} 
                onClick={handleAddToFavoritesClick}></button>
        <div className="action_button edit"><Link to={editUrl}></Link></div>
        <div className="action_button delete"><Link to={deleteUrl}></Link></div>
      </div>
    </div>
  )
}
