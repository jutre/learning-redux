import AboutInfoPopupMenu from './AboutInfoPopupMenu';
import SearchBar from './SearchBar';

function PageHeader(){
  return (
    <div className="header">
      <div className="wrapper">
        <AboutInfoPopupMenu/>
        <SearchBar/>
      </div>
    </div>
  )
}

export default PageHeader;