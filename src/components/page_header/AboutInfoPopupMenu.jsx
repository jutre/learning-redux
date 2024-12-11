import {useState, useRef, useCallback} from 'react';
import { closeDivOnClickOutsideOfDiv } from '../../utils/utils';

function AboutInfoPopupMenu(){
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  //for closing popup div by click on any element in document except menu itself 
  //we need to track the beginning of menu element
  const beginningOfMenuRef = useRef(null);

  //ref to window.document for adding click event listener when menu is opened and 
  //removing it when menu is closed (for performance issues don't use directly
  //document.addEventListener()/removeEventListener())
  const documentRef = useRef(document);


  /**
   * detect if we have clicked an element outside of menu and close it in such case.
   * 
   * Event listerner function is created using useCallback() hook. This is done to be able to remove
   * previously attached event handler when needeed as on each render of React component a defined  
   * function inside component, which is defined withous using useCallback() hook, is created as 
   * new function and such function won't be removed by a document.removeEventListener() call. 
   * Using useCallback() creates memorized function which can be later removed by removeEventListener() method.
   * @param {*} event 
   * @returns 
   */
  const hideInfoDivOnClickOutsideOfDiv = useCallback((event)=>{
    
    //to close info div, we need to set state in component to false. Event attribute is not used
    const closeMenuAction = (event) =>{
      setIsMenuOpened(false)
    };

    closeDivOnClickOutsideOfDiv(event, beginningOfMenuRef, documentRef, hideInfoDivOnClickOutsideOfDiv, closeMenuAction)
  }, [])

  /**
   * toggles menu state variable to opposite; adds event handler to window.document 
   * when the menu is opened, removes that handler when menu is closed
   * 
   * @param {*} event 
   */
  function handleMenuToggle(){
    if(!isMenuOpened){
      setIsMenuOpened(true);
      documentRef.current.addEventListener('click', hideInfoDivOnClickOutsideOfDiv);
    }else{
      setIsMenuOpened(false);
      documentRef.current.removeEventListener('click',hideInfoDivOnClickOutsideOfDiv);
    }
  }


  function closeOpenedInfoDiv(event){
    if(isMenuOpened){
      setIsMenuOpened(false);
      documentRef.current.removeEventListener('click',hideInfoDivOnClickOutsideOfDiv);
    }
  }


  let menuCssClassName = "about-info-pane";
  if(isMenuOpened) { 
    menuCssClassName += " active";
  }
  

  return (
    <div className={menuCssClassName} ref={beginningOfMenuRef}>

      {/*when info div is displayed it must be possible to hide it by clicking an area
      to the right from actuator tab horizontally. As this area technically is inside
      menu containing div where only actuator tab closes/opens info div, we need to add 
      an own click handler to div after tab because visually it is an area outside of
      actuator tab and info div and belongs to an area on which a click closes an opened 
      info div*/}
      <div onClick={closeOpenedInfoDiv} className="tab-row-supplement"></div>
      <button onClick={handleMenuToggle} className="tab">
        About this app <span className='icon'></span>
      </button>

      <div className="collapsible_body_wrapper">
        <div className="body">
          This app was created to get experience with Redux. Redux Toolkit is used, data is fetched from REST api using thunks. <br />
          Other technical features used:
          <ul>
            <li>React router</li>
            <li>CSS used to create typical UI elements: popup menu, modal dialog, autocomplete search box,
              styled checkboxes, responsive design
            </li>
            <li>a function created that lets easily generate HTML form by defining it's structure using
              array of objects</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AboutInfoPopupMenu;