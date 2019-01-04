// --------------------------Global Vars----------------------------//

// keeps track of previous search
var lastButton;
// current search
var searchTerm = "not used yet";
// how many times same search was made in a row
var timesPressed = 0;

var lower = false;

// Buttons everyone starts with, passed into JSON for local storage
var myButtons = [
    { name: "JEAN-LUC PICARD" },
    { name: "WILLIAM RIKER" },
    { name: "DATA" },
    { name: "WORF" },
    { name: "GEORDI LA FORGE" },

];

function FavGif(still, gif, title) {
    this.still = still;
    this.gif = gif;
    this.title = title;
    this.flipped = false;
};

var myFav = new FavGif("https://media2.giphy.com/media/XdreKrQI1LjcQ/giphy_s.gif", "https://media2.giphy.com/media/XdreKrQI1LjcQ/giphy.gif", "Try");

// Array of buttons to diplay, will change how this works
var showButtons = [];

var favArray = [];

// ------------------------End Global Vars---------------------//

// ------------------------Functions---------------------------//

// Gets the buttons saved from local storage or creates local storage, then runs displayButtons function
function getButtons() {
    // load the favorite gifs to the page
    getFavoriteGifs();
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

function getFavoriteGifs() {
    if (JSON.parse(localStorage.getItem("favoriteGIFS")) === null || JSON.parse(localStorage.getItem("favoriteGIFS")).length < 1) {
        favArray.push(myFav);
        console.log(favArray);
        localStorage.setItem("favoriteGIFS", JSON.stringify(favArray));
        showFavGifs();
    } else {
        console.log("favoriteGIFS exist in local storage");
        showFavGifs();
    }
}

function showFavGifs() {
    $(".favOutArea").html("");
    var savedGifs = JSON.parse(localStorage.getItem("favoriteGIFS"));
    console.log(savedGifs);
    for (var i = 0; i < savedGifs.length; i++) {
        var newItem = $("<div>").attr("class", "col-lg-3 col-md-4 col-sm-6 col-12 outputCard");
        var title = $("<h6>").text(savedGifs[i].title).attr("class", "text-center");
        var gifImg = $("<img>").attr("class", "gifPic")
            .attr("src", savedGifs[i].still)
            .prop("data-flipped", false)
            .attr("data-still", savedGifs[i].still)
            .attr("data-gif", savedGifs[i].gif);
        var delBtn = $("<button>").attr("class", "btn btn-danger favDelBtn").text("Delete")
            .attr("data-still", savedGifs[i].still);
        var box = $("<div>").attr("class", "infoBox");
        box.append(delBtn);
        newItem.append(title).append(gifImg).append(box);
        $(".favOutArea").append(newItem);
    }
}

// I want buttons that are saved to local storage to have a class of btn-something different than primary
function displayButtons() {
    // clears buttonArea html
    $(".buttonArea").html("");
    var saveButtons = JSON.parse(localStorage.getItem("buttons"));

    var names = [];

    for (var i = 0; i < saveButtons.length; i++) {
        names.push(saveButtons[i].name);
    }
    console.log("saveButton names = " + names);

    for (var i = 0; i < showButtons.length; i++) {
        console.log(names.indexOf(showButtons[i].name))
        if (names.indexOf(showButtons[i].name) >= 0) {
            var newBtn = $("<button>").attr("class", "btn btn-primary gifName").text(showButtons[i].name);
            $(".buttonArea").append(newBtn);
        } else {
            var newBtn = $("<button>").attr("class", "btn btn-secondary gifName").text(showButtons[i].name);
            $(".buttonArea").append(newBtn);
        }
    }
}

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

// Very simmilar to previous, this one checks if saveBtn should be shown or hidden
function whichButton() {
    var saveButtons = JSON.parse(localStorage.getItem("buttons"));
    var names = [];
    for (var i = 0; i < saveButtons.length; i++) {
        names.push(saveButtons[i].name);
    }
    if (names.indexOf(searchTerm) === -1) {
        $(".saveBtn").fadeIn();

    } else {
        console.log("already saved");
        $(".saveBtn").fadeOut();
    }
    localStorage.setItem("buttons", JSON.stringify(saveButtons));
}

// Getting into the meat and potatoes

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
                    .html("<h6 class='gifTitle'>" + searchTerm.toLowerCase() + "</h6>");
            } else {
                // else use gif title
                var gifTitleHolder = $("<div>").attr("class", "text-center gifTitleHolder")
                    .html("<h6 class='gifTitle'>" + response.data[i].title + "</h6>");
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
            // ----------------------------------------------------------------------------------
            // create button for downloading gif, need to change to <a>
            // var downBtn = $("<a>").attr("class", "btn btn-success downBtn").text("Download")
            //     .attr("href", response.data[i].images.original.url)
            //     .attr("download", "").attr("target", "_blank");
            // couldn't get that to work
            // ----------------------------------------------------------------------------------
            var favBtn = $("<button>").attr("class", "btn btn-success favBtn").text("Favorite")
                .prop("data-flipped", false)
                .attr("data-name", response.data[i].title)
                // store data for both still img url and gif url
                .attr("data-still", response.data[i].images.original_still.url)
                .attr("data-gif", response.data[i].images.original.url);


            // add img to newGif div
            newGif.append(gifImg);
            // add rating and download btn to infoBox div
            infoBox.append(rating).append(favBtn);
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
        };
        if (!lower) {
            $(".outputArea").slideDown();
            lower = true;
        }
    });
};
// -------------------------End Functions -----------------------------//

// -----------------------Event Listeners and Functions-----------------//

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

$(".favOutArea").on("click", ".gifPic", function () {
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

$(".outputArea").on("click", ".favBtn", function () {
    var savedGifs = JSON.parse(localStorage.getItem("favoriteGIFS"));

    var addFav = new FavGif($(this).attr("data-still"), $(this).attr("data-gif"), $(this).attr("data-name"));

    var names = [];

    for (var i = 0; i < savedGifs.length; i++) {
        names.push(savedGifs[i].still);
    }

    if (names.indexOf($(this).attr("data-still")) === -1) {

        savedGifs.push(addFav);
        localStorage.setItem("favoriteGIFS", JSON.stringify(savedGifs));
        showFavGifs();
        $(this).fadeOut();
    } else {
        console.log("already in favorites");
    }
});

$(".favOutArea").on("click", ".favDelBtn", function () {
    var savedGifs = JSON.parse(localStorage.getItem("favoriteGIFS"));

    for (var i = 0; i < savedGifs.length; i++) {
        if ($(this).attr("data-still") === savedGifs[i].still) {
            savedGifs.splice(i, 1);
            localStorage.setItem("favoriteGIFS", JSON.stringify(savedGifs));
            showFavGifs();
        }
    }
});

// What happends when you click the buttons that have search names in them
$(".buttonArea").on("click", ".gifName", function () {
    $(".deleteBtn").fadeIn();
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
    displayButtons();
    // hide saveBtn from window
    $(".saveBtn").fadeOut();
});

// My submit button function
$(".submitBtn").on("click", function (event) {
    // Stops pafe reload
    event.preventDefault();
    if ($("#wordSearch").val() != "") {
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
    }
});

// my delete button for buttons function
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
    $(".saveBtn").fadeOut();
    // runs function to remove from local storage
    checkSavedDelete();
    // clear gifs from screen
    $(".outputArea").html("");
    $(".mainTitle").text("Star Trek: The Next Generation GIFS");
    $(".deleteBtn").fadeOut();
});

// Open Favorites Modal
$(".favModalBtn").on("click", function () {
    $(".favorites").slideDown();
    $(".outputArea").fadeOut();
});

$(".closeModal").on("click", function () {
    $(".favorites").slideUp();
    $(".outputArea").fadeIn();
});
