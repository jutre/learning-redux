# Learning Redux
### About this repository
This repository contains code created while learning Redux, Redux Toolkit.
A single page application is built which exchanges data using REST api. Lots of Redux and Redux Toolkit features are employed: interaction between state residing in multiple separate slices, async thunks accessing remote api. UI app works in conjunction with react-router library and is constructed optimal way in terms of absence of redundant re-renders.\
The implemented application is a book list with ability to create, update, delete books, add or remove them from favorites list. 

No data sending over network is happening when Redux thunks are working with REST api client functions, instead of that those functions return data
that would be returned when received over network. REST client simulates working with a remote server returning data with some delay, for some cases returning responses with errors.

Application has almost all typical UI elements that a web page can have: dropdown menu, modal dialog, a settings menu that can be
activated by control icon, multiple list items selection functionality, page has search form which displays results in dynamic way. There are data sending indicators, data sending failure messages.
Design is responsive on all devices. Accessibility also is concerned - all interactive elements are highlighted when page elements are
navigated using TAB key.\
A component was created that lets easily generate HTML form by defining it's structure using array of objects.


### Live demostration
The completed page can be viewed at [Codesandbox](https://codesandbox.io/p/sandbox/redux-training-app-pspzwz)

