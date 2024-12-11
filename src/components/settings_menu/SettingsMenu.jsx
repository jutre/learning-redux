/**
 * displays or hides data source settings menu. Menu can be closed by click on same element that opened 
 * the menu or on any element in page except menu itself
 */
import {useState, useRef, useCallback} from 'react';
import { closeDivOnClickOutsideOfDiv } from '../../utils/utils';
import SettingsForm from './SettingsForm';

function SettingsMenu(){
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
  const hideDivOnClickOutsideOfDiv = useCallback((event)=>{
    
    //to close info div, we need to set state in component to false. Event attribute is not used
    const closeMenuAction = (event) =>{
      setIsMenuOpened(false)
    };

    closeDivOnClickOutsideOfDiv(event, beginningOfMenuRef, documentRef, hideDivOnClickOutsideOfDiv, closeMenuAction)
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
      documentRef.current.addEventListener('click', hideDivOnClickOutsideOfDiv);
    }else{
      setIsMenuOpened(false);
      documentRef.current.removeEventListener('click', hideDivOnClickOutsideOfDiv);
    }
  }

  /**
   * function for hiding menu. Intended to pass to settings form to use for closing menu after new
   * settings are choosen
   */
  function closeMenuHandler(){
      setIsMenuOpened(false);
      documentRef.current.removeEventListener('click', hideDivOnClickOutsideOfDiv);
  }

  //actually settings form could be shown/hidden by outputting or not  outputting form component depending
  //on hidden or shown status because not planning to use any css transitions while showing/hiding but
  //in such case form is completely mounted/unmounted and previously selected selected radio button selection
  //state (React.useState) is completely lost and using React state requires less code than it would if storing 
  //such state in Redux
  let menuCssClassName = "body";
  if(isMenuOpened) { 
    menuCssClassName += " active";
  }

  return (
    <div className="settings_menu" ref={beginningOfMenuRef}>
      <button onClick={handleMenuToggle} className="settings_icon"></button>
      <div className={menuCssClassName}>
        <SettingsForm closeMenuHandler={closeMenuHandler}/>
      </div>
    </div>
  )
}

export default SettingsMenu;