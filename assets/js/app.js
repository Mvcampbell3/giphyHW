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
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=d7kvX0voWdIu8foSOpdhIvesiVLi8dsN&q=" + search + "&limit=10";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        for (var i = 0; i < response.data.length; i++) {
            var newGif = $("<div>").attr("class", "card outputCard").css({ "width": response.data[i].images.fixed_height.width });
            var gifImg = $("<img>").attr("src", response.data[i].images.fixed_height_still.url);
            newGif.append(gifImg);
            $(".outputArea").append(newGif);
        }
        
    });
})