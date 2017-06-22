var prompt = 0;

function prompt(errorstring) {
    //allert(errorstring);
    if (prompt==0) {
        $("#dialog").text(errorstring);
        $("#dialog").dialog();
        prompt=1;
    }
}


function doToggle(button) {
    $(".interfaceTab").hide(100);
    if ($("#" + button.id + "Interface").is(':visible')) {
        $("#" + button.id + "Interface").hide(100);
    } else {
        $("#" + button.id + "Interface").show(100);
    }
    //$("#" + button.id + "Interface").slideToggle();
    $(".btn").blur();
}

function doToggleGame(button) {
    $("#gameInterface").toggle(100);
    $(".btn").blur();
}

function soundOnOff(button) {
    /*if ($(button).val() == "&#xf028") {
        $(button).val("&#xf026");
    } else if ($(button).val() == "&#xf026") {
      $(button).val("&#xf028");
    } 
    if ($(button).val() == "hi") {
        $(button).val("bye");
    } else if ($(button).val() == "bye") {
      $(button).val("hi");
    } */
    if ($(button).hasClass("fa-volume-up")) {
        $(button).removeClass('fa-volume-up').addClass('fa-volume-off');
    } else if ($(button).hasClass("fa-volume-off")) {
      $(button).removeClass("fa-volume-off").addClass("fa-volume-up")
    }
} 