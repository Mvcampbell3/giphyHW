# giphyHW

## Version 3.141592

### More accurate Pi Edition:
- Funtionality
    - loads space theme and space themed buttons, favorite gifs
    - add buttons to button list, can save buttons from button list
    - remove buttons from list, will delete from both list and local storage
    - favorite button on gif will add gif to favorites tab
    - show favorites button will slide down favorite gif area, leave favorites to go back

### Changes

- scrapped star trek theme in favor of space theme
- changed starting buttons and fav gifs
- deleted unused images
- added favicon
- misc. style edits in background and gifs
- cleaned up code a bit

##Expected to be release version

## Version 3.14

### Pi Edition:
- Won't add gifs to favs if the url is the same as one in saves
- favorite button fades out on outputArea after successful add to favs
- made a favs modal, drops down on button press
- output area for gifs now slides down after first search

### Still to come:
- Styling time, decide theme to keep


## Version 3.00

### Added:
- Ability to save favorite gifs
- section to display favorite gifs, might change to new page or even modal

### Still to come:
- check to see if already in favs



## Version 2.50

### Added:
- Star Trek TNG theme
- buttons are assigned classes based on if saved to local storage or not

### Soon to be made so:
- pick the right background
- think about how you want gifs to appear in window, ie: animations?

## Version 2.25

### Added:
- titles to the gifs, if no title exists, makes searchTerm title
- body background img in parralax
- download button now loads new tab which brings up original url for gif, which is nice I guess

### To Do:
- Decide on a theme
- Implement array to index if saved or not, make classes of the newGif from there
- DOWNLOAD BUTTON IS DRIVING ME INSANE

## Version 27.304

### Changes:
- Swiched around html for better layout, may revist
- commented the js file
- you can't add buttons already there
- inputs are toUpperCase

### Still to come:
- Download download dowanmcndnaohaosdchalabutton
- decide what to do about button classes, new layout eases the need
- add title to gifs? Might makes them too big. Maybe a small title

## Version 2.02

### Back on Track:
- local storage works well
- save and delete buttons work well

### Still Need:
- Need to find a way to set class names differently based on saved to local storage or not
- Download Button? Is this going to happen? Maybe tomorrow
- Place to permanetly place save and del buttons, with maybe some text there

###### Campbell out

## Version 2.005
 
Yes we went backwards a little bit

### In transistion
- Trying to implement local storage
- Changed the way the buttons are loaded to the screen

### Needed:
- Have different classes for buttons based on if saved to local storage or not?
- Instead of just appending to html, push to showButtons then append that to html?
- Delete button that works on screen and local storage
- Save button that adds button text to the buttons JSON file
- Brain

## Version 2.01

### Added:
- Ratings Button, may change to a badge, need to play with padding
- Changed the source url to original and original_still
- Made output Gifs larger

### Tune in next time for
- Add Title Box into infoBox
- Finally make download button work
- Make it look pretty

## Version 2.00

### Added Features:
- Made original buttons load from array instead of HTML
- If button pressed more than once, gifs prepended to window, doesn't erase html

### In the Works:
- Access local storage through JSON
- Ability to save certain buttons to original button string
- download button that actually downloads

## Version 1.04

### Previously, in giphy hw...
- ditched the cards holding the gifs
- fixed mobile responsiveness
- added basic styling

### Still to come:
- need to use string to grab button names and data
- figure out which image key is for download
- have favorite section which will carry over into local storage
- add rating to gif box

## Version 1.03

### On this update
- Added click to go from still to gif and back
- made the gifs more resposive through class naming with col-yada yada
- Placed button to add the download url, still working on that

### Still to do

- Make it like nicer
- finish the data adding with the download buttons
- add ability to check if same button was pressed again
- clear html in outputArea if not 

## Version 1.02

### This Push:
- Added output to page through card divs;
- made responsive through bootstrap
- Made img src the fixed_height_still

### Still to do:

- Need to be able to click on img and change img src to gif url
- Make it not look like I put 5 mins of effort into it
- Add download gif button to each div

## Version 1.01

### Added all needed to version 1.00
- Pretty basic functionality

### What needs to be added next

- response from ajax to be added to html in gif form
- styling to make it look nice
- keep in mind the requirements such as
    - ability to tell if same button was pressed or not
    - add g rating
    

## Version 1.00

### Things to add:
- Ability to generate buttons to page from input val
- Output area for the buttons
- ajax call for the value of the buttons with giphy api    