function prompt(errorstring) {
    //allert(errorstring);
    $("#dialog").text(errorstring);
    $("#dialog").dialog();
}