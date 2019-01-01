var lastButton;
var searchTerm;
var timesPressed = 1;

var allButtons = ["baseball", "buffalo wings", "england", "sherlock"];

function displayButtons(){
    $(".buttonArea").html("");
    for (var i = 0; i < allButtons.length; i++) {
        var newBtn = $("<button>").attr("class", "btn btn-primary gifName")
            .attr("data-name", allButtons[i])
            .text(allButtons[i]);
        $(".buttonArea").append(newBtn);
    }
}

$(".submitBtn").on("click", function (event) {
    event.preventDefault();
    var search = $("#wordSearch").val().trim();
    console.log(search);
    if (search === "") {
        alert("Please enter something into the search bar");
        return;
    } else {
        console.log("working");
        allButtons.push(search);
        displayButtons();
        $("#wordSearch").val("");
    }
});

$(".buttonArea").on("click", ".gifName", function () {
    lastButton = searchTerm;
    searchTerm = $(this).attr("data-name");
    console.log("this is the name of the old btn " + lastButton)
    console.log("this is the name of the new btn " + searchTerm);

    // Add to see if same button was pressed here
    // if else with else being what is below...i think
    if (lastButton != searchTerm) {
        timesPressed = 1;
        $(".outputArea").html("");
        var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=d7kvX0voWdIu8foSOpdhIvesiVLi8dsN&q=" + searchTerm + "&limit=10";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            
            for (var i = 0; i < response.data.length; i++) {
                var newGif = $("<div>").attr("class", "col-lg-2 col-md-3 col-sm-4 col-6 outputCard");
                var gifImg = $("<img>").attr("class", "gifPic")
                    .attr("src", response.data[i].images.fixed_width_still.url)
                    .prop("data-flipped", false)
                    .attr("data-still", response.data[i].images.fixed_width_still.url)
                    .attr("data-gif", response.data[i].images.fixed_width.url);
                var downBtn = $("<button>").attr("class", "btn btn-success downBtn").text("Download");
                newGif.append(gifImg);
                newGif.append(downBtn);
                $(".outputArea").append(newGif);
            }

        });
    } else {
        var offset = timesPressed * 10;
        timesPressed++;
        console.log("Same Button pressed");
        var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=d7kvX0voWdIu8foSOpdhIvesiVLi8dsN&q=" + searchTerm + "&limit=10&offset="+offset;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            
            for (var i = 0; i < response.data.length; i++) {
                var newGif = $("<div>").attr("class", "col-lg-2 col-md-3 col-sm-4 col-6 outputCard");
                var gifImg = $("<img>").attr("class", "gifPic")
                    .attr("src", response.data[i].images.fixed_width_still.url)
                    .prop("data-flipped", false)
                    .attr("data-still", response.data[i].images.fixed_width_still.url)
                    .attr("data-gif", response.data[i].images.fixed_width.url);
                var downBtn = $("<button>").attr("class", "btn btn-success downBtn").text("Download");
                newGif.append(gifImg);
                newGif.append(downBtn);
                $(".outputArea").prepend(newGif);
            }

        });
    }
});

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
})

