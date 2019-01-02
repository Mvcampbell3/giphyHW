// Global Vars

// keeps track of previous search
var lastButton;
// current search
var searchTerm = "not used yet";
// how many times same search was made in a row
var timesPressed = 0;

// Buttons everyone starts with, passed into JSON for local storage
var myButtons = [
    {name: "bisping"},
    {name: "baseball"},
    {name: "cars"},
    {name: "buffalo wings"},
];

// Array of buttons to diplay, will change how this works
var showButtons = [];

// --------------End Global Vars---------------------


// Gets the buttons saved from local storage or creates local storage, then runs displayButtons function
function getButtons() {
    // checks if local storage has my list or if my list has zero items inside
    if (JSON.parse(localStorage.getItem("buttons")) === null || JSON.parse(localStorage.getItem("buttons")).length < 1) {
        // May want to get rid of the or check, if they don't want my buttons then so be it.

        // set the showButtons array for button display
        showButtons = myButtons;

        // save array into local storage using JSON
        localStorage.setItem("buttons", JSON.stringify(showButtons));
        
        displayButtons();
    } else {

        console.log("aleady have some buttons");
        // sets showArray from my list in local storage
        showButtons = JSON.parse(localStorage.getItem("buttons"));
        displayButtons();
    }
}

// Will change how this works, right now every button has same class
// I want buttons that are saved to local storage to have a class of btn-something different than primary
function displayButtons() {
    // clears buttonArea html
    $(".buttonArea").html("");
    // loops through showButton Array
    for (var i = 0; i < showButtons.length; i++) {
        // creates new button for each object, class and text defined
        var newBtn = $("<button>").attr("class", "btn btn-primary gifName").text(showButtons[i].name);
        // adds button to buttonArea html
        $(".buttonArea").append(newBtn);
    }
}

// My submit button function
$(".submitBtn").on("click", function(event){
    // Stops pafe reload
    event.preventDefault();
    // Set new object, this is for if they want to save searchTerm to local storage
    var newItem = {
        name: $("#wordSearch").val().trim(),
    };
    // add to showButtons array
    showButtons.push(newItem);
    // put buttons in buttonArea
    displayButtons();
    // clear text from input
    $("#wordSearch").val("");
});

// my delete button function
$(".deleteBtn").on("click", function(){
    // loops through showButton array
    for(var i = 0; i < showButtons.length; i++) {
        // finds where the last used button is located in array
        if (searchTerm === showButtons[i].name) {
            console.log(i + " index at want to delete");
            // removes from showButton array
            showButtons.splice(i, 1);
        }
    }
    // updates buttonArea
    displayButtons();
    // hides the save button
    $(".saveBtn").hide();
    // runs function to remove from local storage
    checkSavedDelete();
    // clear gifs from screen
    $(".outputArea").html("");
});

// removes button from local storage
function checkSavedDelete(){
    // grab array from local storage
    var saveButtons = JSON.parse(localStorage.getItem("buttons"));
    console.log(saveButtons);
    // same thing as above function, find object to delete
    for(var i = 0; i < saveButtons.length; i++) {
        if (searchTerm === saveButtons[i].name) {
            console.log(i + " index at want to delete");
            saveButtons.splice(i, 1);
        }
    };
    // update local storage list
    localStorage.setItem("buttons", JSON.stringify(saveButtons));
}

$(".saveBtn").on("click", function(){
    var newItem = {
        name: searchTerm,
    }
    var saveButtons = JSON.parse(localStorage.getItem("buttons"));
    var names = [];
    for (var i = 0; i < saveButtons.length; i ++) {
        names.push(saveButtons[i].name);
    }
    if (names.indexOf(searchTerm) === -1) {
        saveButtons.push(newItem);
    } else {
        console.log("already saved");
    }
    localStorage.setItem("buttons", JSON.stringify(saveButtons));
    $(".saveBtn").hide();
})

function whichButton() {
    var saveButtons = JSON.parse(localStorage.getItem("buttons"));
    var names = [];
    for (var i = 0; i < saveButtons.length; i ++) {
        names.push(saveButtons[i].name);
    }
    if (names.indexOf(searchTerm) === -1) {
        $(".saveBtn").show();
        
    } else {
        console.log("already saved");
        $(".saveBtn").hide();
    }
    localStorage.setItem("buttons", JSON.stringify(saveButtons));
}

$(".buttonArea").on("click", ".gifName", function () {
    lastButton = searchTerm;
    searchTerm = $(this).text();
    console.log("this is the name of the old btn " + lastButton)
    console.log("this is the name of the new btn " + searchTerm);
    whichButton();

    if (lastButton === searchTerm) {
        timesPressed++;
        ajaxCall();
    } else {
        timesPressed = 0;
        $(".outputArea").html("");
        ajaxCall();
    }
});

function ajaxCall(){
    var offset = (timesPressed * 1) * 10;
    console.log(offset + " offset")
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=d7kvX0voWdIu8foSOpdhIvesiVLi8dsN&q=" + searchTerm + "&limit=10&offset="+offset;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        for (var i = 0; i < response.data.length; i++) {
            var newGif = $("<div>").attr("class", "col-lg-3 col-md-4 col-sm-6 col-12 outputCard");
            var gifImg = $("<img>").attr("class", "gifPic")
                .attr("src", response.data[i].images.original_still.url)
                .prop("data-flipped", false)
                .attr("data-still", response.data[i].images.original_still.url)
                .attr("data-gif", response.data[i].images.original.url);
            var infoBox = $("<div>").attr("class", "infoBox");
            var rating = $("<button>").attr("class", "btn btn-light").text("Rating: " + response.data[i].rating);
            var downBtn = $("<button>").attr("class", "btn btn-success downBtn").text("Download");
            newGif.append(gifImg);
            infoBox.append(rating).append(downBtn);
            newGif.append(infoBox);
            if (offset > 0){
                $(".outputArea").prepend(newGif);
            } else{
                $(".outputArea").append(newGif);
            }
        }
    });
};

$(".outputArea").on("click", ".gifPic", function () {
    console.log($(this).prop("data-flipped"));
    console.log(typeof $(this).prop("data-flipped"));
    if (!$(this).prop("data-flipped")) {
        console.log("would switch to moving gif");
        $(this).prop("data-flipped", true);
        $(this).attr("src", $(this).attr("data-gif"));
    } else {
        console.log("would flip back to still");
        $(this).prop("data-flipped", false);
        $(this).attr("src", $(this).attr("data-still"));
    }
});