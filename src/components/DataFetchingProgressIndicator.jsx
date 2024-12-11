
import { useSelector } from 'react-redux';
import {
  selectInitialDataFetchingStatus,
  STATUS_LOADING, 
  STATUS_REJECTED
} from "../features/booksSlice";


/**
 * This component displays state from books slice dedicated to execution state of async thunk which in 
 * fact is function that fetches book data from remote source. Two states may be displayed: "loading"
 * which means data fetching is in progress and "failed" which means data fetching has failed
 * @returns 
 */
function DataFetchingProgressIndicator () {
  let fetchingStatus = useSelector(state => selectInitialDataFetchingStatus(state));
    
  return (
    <>
      {/*if fetching has failed, display message*/}
      {fetchingStatus === STATUS_REJECTED &&
        <div className="loading_status_indicator">
          <div className="error">initial data fetching has failed</div>
        </div>
      }
      
      {/*while data is fetching, show that data is loading*/}
      {fetchingStatus === STATUS_LOADING && 
        <div className="loading_status_indicator">loading...</div>
      }
    </>
  )
}

export default DataFetchingProgressIndicator;