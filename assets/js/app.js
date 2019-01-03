// Global Vars

// keeps track of previous search
var lastButton;
// current search
var searchTerm = "not used yet";
// how many times same search was made in a row
var timesPressed = 0;

// Buttons everyone starts with, passed into JSON for local storage
var myButtons = [
    { name: "BISPING" },
    { name: "BASEBALL" },
    { name: "CARS" },
    { name: "BUFFALO WINGS" },
    { name: "TRY" },
];

// Array of buttons to diplay, will change how this works
var showButtons = [];

// --------------End Global Vars---------------------//


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
$(".submitBtn").on("click", function (event) {
    // Stops pafe reload
    event.preventDefault();
    var nameIn = $("#wordSearch").val().trim();
    // Set new object, this is for if they want to save searchTerm to local storage
    var newItem = {
        name: nameIn.toUpperCase(),
    };

    // Need to check if there is already a button for this
    var names = [];

    for (var i = 0; i < showButtons.length; i++) {
        names.push(showButtons[i].name);
    }

    if (names.indexOf(newItem.name) === -1) {
        // add to showButtons array
        showButtons.push(newItem);
        // put buttons in buttonArea
        displayButtons();
        // clear text from input
        $("#wordSearch").val("");
    } else {
        console.log("already a button");
    }

});

// my delete button function
$(".deleteBtn").on("click", function () {
    // loops through showButton array
    for (var i = 0; i < showButtons.length; i++) {
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
    $(".mainTitle").text("Pick a Gif!");
    $(".deleteBtn").hide();
});

// removes button from local storage
function checkSavedDelete() {
    // grab array from local storage
    var saveButtons = JSON.parse(localStorage.getItem("buttons"));
    console.log(saveButtons);
    // same thing as above function, find object to delete
    for (var i = 0; i < saveButtons.length; i++) {
        if (searchTerm === saveButtons[i].name) {
            console.log(i + " index at want to delete");
            saveButtons.splice(i, 1);
        }
    };
    // update local storage list
    localStorage.setItem("buttons", JSON.stringify(saveButtons));
}


// Save button to local storage function
$(".saveBtn").on("click", function () {
    // create object
    var newItem = {
        name: searchTerm,
    }

    // get array of save botton objects from local storage
    var saveButtons = JSON.parse(localStorage.getItem("buttons"));

    // declare place for name values from the button object to go
    var names = [];

    // place the name from each save button to names array
    for (var i = 0; i < saveButtons.length; i++) {
        names.push(saveButtons[i].name);
    }

    // check if the button is already saved to local storage
    if (names.indexOf(searchTerm) === -1) {
        // if not, push original object to saveButtons array
        saveButtons.push(newItem);
    } else {
        // if already saved, do nothing
        console.log("already saved");
    }
    // reset the buttons list in local storage
    localStorage.setItem("buttons", JSON.stringify(saveButtons));
    // hide saveBtn from window
    $(".saveBtn").hide();
})

// Very simmilar to previous, this one checks if saveBtn should be shown or hidden
function whichButton() {
    var saveButtons = JSON.parse(localStorage.getItem("buttons"));
    var names = [];
    for (var i = 0; i < saveButtons.length; i++) {
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

// Getting into the meat and potatoes

// What happends when you click the buttons that have search names in them
$(".buttonArea").on("click", ".gifName", function () {
    $(".deleteBtn").show();
    // store previous search
    lastButton = searchTerm;
    // update search to pressed button text
    searchTerm = $(this).text();
    $(".mainTitle").text(searchTerm.toUpperCase());
    console.log("this is the name of the old btn " + lastButton)
    console.log("this is the name of the new btn " + searchTerm);
    // see if saveBtn should be shown or hidden
    whichButton();

    // Check is same button was pressed
    if (lastButton === searchTerm) {
        // if true add 1 to timesPressed var
        timesPressed++;
        ajaxCall();
    } else {
        // if false, reset timesPressed to zero, clear outputArea html
        timesPressed = 0;
        $(".outputArea").html("");
        ajaxCall();
    }
});


// Gettings the gifs through giphy api
function ajaxCall() {
    // offset used to add to outputArea html if button pressed more than once
    // every iteration of timesPressed will add ten to the offset, starts at zero
    var offset = (timesPressed * 1) * 10;
    console.log(offset + " offset")
    // Url used in ajax call, searchTerm global, set through $(".buttonArea").on("click")
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=d7kvX0voWdIu8foSOpdhIvesiVLi8dsN&q=" + searchTerm + "&limit=10&offset=" + offset;
    // actual ajax call
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        // loop through response.data, for each returned do:
        for (var i = 0; i < response.data.length; i++) {
            // create new div that has responsive bootstrap classes
            var newGif = $("<div>").attr("class", "col-lg-3 col-md-4 col-sm-6 col-12 outputCard");
            // check if gif has a title
            if (response.data[i].title == "") {
                // if empty, make searchTerm title
                var gifTitleHolder = $("<div>").attr("class", "text-center gifTitleHolder")
                .html("<h6 class='gifTitle'>"+ searchTerm.toLowerCase() + "</h6>");
            } else {
                // else use gif title
                var gifTitleHolder = $("<div>").attr("class", "text-center gifTitleHolder")
                .html("<h6 class='gifTitle'>"+ response.data[i].title + "</h6>");
            }
            // add title to newGif
            newGif.append(gifTitleHolder);

            // create new img with class of gifPic, css sets height & width
            var gifImg = $("<img>").attr("class", "gifPic")
                // set starting src to still from data.images
                .attr("src", response.data[i].images.original_still.url)
                // give boolean value used for when clicked
                .prop("data-flipped", false)
                // store data for both still img url and gif url
                .attr("data-still", response.data[i].images.original_still.url)
                .attr("data-gif", response.data[i].images.original.url);
            // create div
            var infoBox = $("<div>").attr("class", "infoBox");
            // create button with text og gif rating, might change to badge with different padding
            var rating = $("<button>").attr("class", "btn btn-light").text("Rating: " + response.data[i].rating);
            // create button for downloading gif, need to change to <a>
            var downBtn = $("<a>").attr("class", "btn btn-success downBtn").text("Download")
                .attr("href", response.data[i].images.original.url)
                .attr("download", "").attr("target", "_blank");


            // add img to newGif div
            newGif.append(gifImg);
            // add rating and download btn to infoBox div
            infoBox.append(rating).append(downBtn);
            // add infoBox div to newGif div
            newGif.append(infoBox);
            // check if this was first time searchTerm button was pressed
            // I want the first time to append so the top gifs are at the top
            // I want the subsequent times to prepend so the new gifs are above previous gifs
            if (offset > 0) {
                $(".outputArea").prepend(newGif);
            } else {
                $(".outputArea").append(newGif);
            }
        }
    });
};

// Change from still to gif urls and back when img clicked
$(".outputArea").on("click", ".gifPic", function () {
    console.log($(this).prop("data-flipped"));
    console.log(typeof $(this).prop("data-flipped"));
    // If current flipped state is false, switch to gif url and set state to true
    if (!$(this).prop("data-flipped")) {
        console.log("would switch to moving gif");
        $(this).prop("data-flipped", true);
        $(this).attr("src", $(this).attr("data-gif"));
    } else {
        // If current flipped state is true, switch to still url and set state to false
        console.log("would flip back to still");
        $(this).prop("data-flipped", false);
        $(this).attr("src", $(this).attr("data-still"));
    }
});