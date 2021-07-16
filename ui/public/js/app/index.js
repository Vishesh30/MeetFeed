$(document).ready(function () {

    $('.upVote-Button').on('click', function () {
        const postId = $(this).attr('post-id');
        upVote(postId);
    });

    $('.downVote-Button').on('click', function () {
        const postId = $(this).attr('post-id');
        downVote(postId);
    });

    $('#sort-by-votes').on('click', function () {
        document.cookie = "sortOrder=votes";
        location.reload();
    });

    $('#sort-by-time').on('click', function () {
        document.cookie = "sortOrder=time";
        location.reload();
    });

});

window.addQuestion = function(){
    const inputs = $('#add_question :input');
    const form_data = {};
    inputs.each(function () {
        form_data[this.id] = $(this).val();
    });
    let eventId = $('#variableJSON').text().replace(/\s/g, '');
    const post_data = { 
        "postContent": form_data.question,
        "upVotes": 0,
        "downVotes": 0,
        "voters": []
    }
    //console.log(post_data);

    $.ajaxSetup({
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let url = window.location.origin + "/api/event/" + eventId + "/post";
    $.post(url,
        JSON.stringify(post_data))
        .done(function () {
            location.reload(); //alert("question added... reload page");
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            //console.log({ status: textStatus, error_message: jqXHR.responseText });
            const msgData = JSON.parse(jqXHR.responseText);
            alert("Error in adding question: " + msgData);
        });
}

function upVote(postId){

    console.log(postId);
    let eventId = $('#variableJSON').text().replace(/\s/g, '');
    let url = window.location.origin + "/api/event/" + eventId + "/post/" + postId + "/upVote";
    $.post(url)
        .done(function () {
            location.reload(); //alert("upvote done... reload page");
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            //console.log({ status: textStatus, error_message: jqXHR.responseText });
            const msgData = JSON.parse(jqXHR.responseText);
            alert("Error in adding vote: " + msgData);
        });
}

function downVote(postId){

    console.log(postId);
    let eventId = $('#variableJSON').text().replace(/\s/g, '');
    let url = window.location.origin + "/api/event/" + eventId + "/post/" + postId + "/downVote";
    $.post(url)
        .done(function () {
            location.reload(); //alert("downVote done... reload page");
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            //console.log({ status: textStatus, error_message: jqXHR.responseText });
            const msgData = JSON.parse(jqXHR.responseText);
            alert("Error in adding vote: " + msgData);
        });

}