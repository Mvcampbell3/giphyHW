var lastButton;
var searchTerm = "not used yet";
var timesPressed = 0;

var myButtons = [
    {name: "bisping"},
    {name: "baseball"},
    {name: "cars"},
    {name: "buffalo wings"},
];

var showButtons = [];

function getButtons() {
    if (JSON.parse(localStorage.getItem("buttons")) === null || JSON.parse(localStorage.getItem("buttons")).length < 1) {
        // May want to get rid of the or check, if they don't want my buttons then so be it.
        showButtons = myButtons;
        localStorage.setItem("buttons", JSON.stringify(showButtons));
        displayButtons();
    } else {
        console.log("aleady have some buttons");
        showButtons = JSON.parse(localStorage.getItem("buttons"));
        displayButtons();
    }
}

function displayButtons() {
    $(".buttonArea").html("");
    for (var i = 0; i < showButtons.length; i++) {
        var newBtn = $("<button>").attr("class", "btn btn-primary gifName").text(showButtons[i].name);
        $(".buttonArea").append(newBtn);
    }
}

$(".submitBtn").on("click", function(event){
    event.preventDefault();
    var newItem = {
        name: $("#wordSearch").val().trim(),
    };
    showButtons.push(newItem);
    displayButtons();
    $("#wordSearch").val("");
});

$(".deleteBtn").on("click", function(){
    for(var i = 0; i < showButtons.length; i++) {
        if (searchTerm === showButtons[i].name) {
            console.log(i + " index at want to delete");
            showButtons.splice(i, 1);
        }
    }
    displayButtons();
    $(".saveBtn").hide();
    checkSavedDelete();
    $(".outputArea").html("");
});

function checkSavedDelete(){
    var saveButtons = JSON.parse(localStorage.getItem("buttons"));
    console.log(saveButtons);
    for(var i = 0; i < saveButtons.length; i++) {
        if (searchTerm === saveButtons[i].name) {
            console.log(i + " index at want to delete");
            saveButtons.splice(i, 1);
        }
    };
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
                // .attr("src", response.data[i].images.fixed_width_still.url)
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
            $(".outputArea").prepend(newGif);
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