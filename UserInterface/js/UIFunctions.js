/* 
This program is licensed under the GNU General Public License as described in the file „LICENSE“
Copyright (C) 2017 TH Nürnberg
Authors: Marius Reuther Franziska Braun, Lea Uhlenbrock, Selina Forster, Theresa Breitenhuber, Marco Lingenhöl
Contact: openspacesimulation@gmail.com
*/



var prompty = 0;


function prompt(errorstring) {
    //allert(errorstring);
    if(prompty==0) {
        $("#dialog").text(errorstring);
        $("#dialog").dialog();
    }
    prompty = 1;  
}


function doToggle(button) {
    $(".interfaceTab").hide(100);
    $(".toggleMenuButton").removeClass("activeInterface");
    if ($("#" + button.id + "Interface").is(':visible')) {
        $("#" + button.id + "Interface").hide(100);
        $("#" + button.id).removeClass("activeInterface");
    } else {
        $("#" + button.id + "Interface").show(100);
        $("#" + button.id).addClass("activeInterface");
    }
    //$("#" + button.id + "Interface").slideToggle();
    $(".btn").blur();
}

function doToggleGame(button) {
    $("#gameInterface").toggle(100);
    if($( "#" + button.id ).hasClass( "activeInterface" )) {
        $("#" + button.id).removeClass("activeInterface");
    } else {
        $("#" + button.id).addClass("activeInterface");
    }
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
