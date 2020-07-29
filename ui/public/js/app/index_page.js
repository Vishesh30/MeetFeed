$(document).ready(function () {
});

window.addQuestion = function(){
    const inputs = $('#add_question :input');
    const form_data = {};
    inputs.each(function () {
        form_data[this.id] = $(this).val();
    });

    const post_data = {
        "postContent": form_data.question,
        "upVotes": 0,
        "downVotes": 0
    }
    console.log(post_data);

    $.post("api/post",
        JSON.stringify(post_data))
        .done(function () {
            alert("question added... reload page");
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            //console.log({ status: textStatus, error_message: jqXHR.responseText });
            const msgData = JSON.parse(jqXHR.responseText);
            alert("Error in adding question: " + msgData);
        });
}