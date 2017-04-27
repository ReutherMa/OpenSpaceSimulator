function prompt(errorstring) {
    //allert(errorstring);
    $("#dialog").text(errorstring);
    $("#dialog").dialog();
}


function doToggle(button) {
    $("#" + button.id + "Interface").slideToggle();
}