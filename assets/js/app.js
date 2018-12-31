$(".submitBtn").on("click", function (event) {
    event.preventDefault();
    var search = $("#wordSearch").val().trim();
    console.log(search);
    if (search === "") {
        alert("Please enter something into the search bar");
        return;
    } else {
        console.log("working");
        var newBtn = $("<button>").attr("class", "btn btn-primary gifName").attr("data-name", search).text(search);
        $(".buttonArea").append(newBtn);
        $("#wordSearch").val("");
    }
});

$(".buttonArea").on("click", ".gifName", function () {
    var search = $(this).attr("data-name");
    console.log("this is the name of the btn " + search);
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=d7kvX0voWdIu8foSOpdhIvesiVLi8dsN&q=" + search + "&limit=12";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        for (var i = 0; i < response.data.length; i++) {
            // var newGif = $("<div>").attr("class", "card outputCard").css({ "width": response.data[i].images.fixed_height.width });
            // var gifImg = $("<img>").attr("src", response.data[i].images.fixed_height_still.url);
            var newGif = $("<div>").attr("class", "col-lg-3 col-md-6 col-sm-12 card outputCard");
            var gifImg = $("<img>").attr("class", "gifPic")
                .attr("src", response.data[i].images.fixed_width_still.url)
                .prop("data-flipped", false)
                .attr("data-still", response.data[i].images.fixed_width_still.url)
                .attr("data-gif", response.data[i].images.fixed_width.url);
            var downBtn = $("<button>").attr("class", "btn btn-danger downBtn").text("Download");
            newGif.append(downBtn);
            newGif.append(gifImg);
            $(".outputArea").append(newGif);
        }

    });
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

