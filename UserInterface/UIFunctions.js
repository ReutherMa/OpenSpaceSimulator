function prompt(errorstring) {
    //allert(errorstring);
    $("#dialog").text(errorstring);
    $("#dialog").dialog();
}


function doToggle(button) {
    $(".interfaceTab").hide(100);
    if ($("#" + button.id + "Interface").is(':visible')) {
        $("#" + button.id + "Interface").hide(100);
    } else {
        $("#" + button.id + "Interface").show(100);
    }
    //$("#" + button.id + "Interface").slideToggle();
    
}

/*
$(".question").click(function () {
                var questionId = this.id;
                var answerId = "#" + questionId + "tab";
                $(".answer").hide(100);
                $(answerId).show(100);
                
            });
*/