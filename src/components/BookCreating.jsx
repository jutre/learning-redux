import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {
  bookSavingStatusResetToIdle,
  sendNewBookDataToServer,
  selectBookSavingStatus,
  selectLastSavedBookId,
  selectBookFullInfoById,
  STATUS_LOADING,
  STATUS_REJECTED } from "../features/booksSlice";
import { 
  routes,
  bookCreatingFormFieldsDef  } from "../config";
import { FormBuilder } from '../utils/FormBuilder';
import { useTrackThunkSuccessfulFinishing } from "../hooks/useTrackThunkSuccessfulFinishing";
import DisappearingMessage from './DisappearingMessage';
import { setPageTitleTagValue } from "../utils/setPageTitleTagValue";


function BookCreating() {
  let lastSavedBookId = useSelector(state => selectLastSavedBookId(state));
  //actually needed only after successful saving, but useSelector hook must be called directly in component.
  //The result is ignored until the moment book data has been saved
  let createdBookInfo = useSelector(state => selectBookFullInfoById(state, lastSavedBookId));
  
  const dispatch = useDispatch();

  useEffect(() => {
    //for resetting "bookSavingStatus" state from "rejected" to "idle". It is needed in situation if submitting new book
    //ended up with "rejected" status and user navigated to other page and then came back. 
    //At the moment when user comes back to book creation page the previously set "rejected" book saving status remains unchanged,
    //it must be set to "idle" on first component render 
    dispatch(bookSavingStatusResetToIdle());
    setPageTitleTagValue("Create new book");
  }, []);

  let sendingToServerStatus = useSelector(state => selectBookSavingStatus(state));

  const [displaySuccessMsg, resetDisplaySuccessMsg] = useTrackThunkSuccessfulFinishing(sendingToServerStatus);

  let formDisabled = sendingToServerStatus === STATUS_LOADING;
    
  function saveSubmittedData(bookData){
    dispatch(sendNewBookDataToServer(bookData));
  }


  /**
   * when book data is successfully saved component displays saved book data with link "Add another book". That link
   * url is equal with current page link and when link is clicked component is not re-rendered anyway because
   * react router has no condition to re-render and bring component to initial state when it displays book creation form
   * as it is when user navigates to book creation url from another url. The component is forced to get to state when
   * book creation form is displayed by setting createdBook state to null, all other state variable are already reset to 
   * initial state in hook that tracks readux book data saving function execution state
   */
  function handleAddNewBookLinkClick(){
    resetDisplaySuccessMsg();
  }

  
  let mainContent;
  if(displaySuccessMsg){
    //in case book saving thunk execution finished successfully, display just create book
    let editUrl = routes.bookEditPath.replace(":bookId", createdBookInfo.id)
    mainContent = (
      <>
        <div className="add_book_link">
          <Link to={routes.createBookPath}
                onClick={handleAddNewBookLinkClick}>Add another book</Link>
        </div>

        <div className="content_section">
          <DisappearingMessage messageText="Book was added" initialDisplayDuration={1000}/>
          
          <div className="table">
            {/*output all fields of book. Loop through form definition array and get label for each field from
            it and field value from created book*/}
            {bookCreatingFormFieldsDef.map((field, index) =>
              <div className="row" key={index}>
                <div className="field_title">{field.label}:</div>
                <div>{createdBookInfo[field.name]}</div>
              </div>
            )}
          </div>
          
          {/*link for editing just created book*/} 
          <div className="edit_book_link_wrapper">
              <Link to={editUrl}>
                <span>Edit added book</span>
                <div className="action_button edit"></div>
              </Link>
          </div>
        </div>
      </>
    );
  }else{
    mainContent = 
      <FormBuilder  formFieldsDefinition={bookCreatingFormFieldsDef} 
                    successfulSubmitCallback={saveSubmittedData}
                    disableAllFields={formDisabled}/>;
  }

  return (
    <div className="create_book">
      <div className="navigation">
        <Link to={routes.bookListPath}>Back</Link>
      </div>
      
      <h1>Add book</h1>

      {/*if data sending has failed, display message*/}
      {sendingToServerStatus === STATUS_REJECTED &&
        <div className="loading_status_indicator">
          <div className="error">book saving has failed, try again later</div>
        </div>
      }
      
      {/*while data is being sent, show that data is loading*/}
      {sendingToServerStatus === STATUS_LOADING && 
        <div className="loading_status_indicator">adding...</div>
      }
      
      {mainContent}

    </div>
  )
}


export default BookCreating;