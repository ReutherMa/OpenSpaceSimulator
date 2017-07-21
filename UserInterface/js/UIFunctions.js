/* 
This program is licensed under the GNU General Public License as described in the file „LICENSE“
Copyright (C) 2017 TH Nürnberg
Authors: Marius Reuther Franziska Braun, Lea Uhlenbrock, Selina Forster, Theresa Breitenhuber, Marco Lingenhöl
Contact: openspacesimulation@gmail.com
*/



var prompty = 0;


function prompt(errorstring) {
    //allert(errorstring);
    if (prompty == 0) {
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
    if ($("#" + button.id).hasClass("activeInterface")) {
        $("#" + button.id).removeClass("activeInterface");
    } else {
        $("#" + button.id).addClass("activeInterface");
    }
    $(".btn").blur();
}

// Move Body around another body
function m_circ(time, circtime, difftime) {
    var bx = 0,
        by = 0;
    if (this.parent && objects[this.parent].x !== undefined) {
        bx = objects[this.parent].x;
        by = objects[this.parent].y;
    }
    this.x = bx + this.dist * Math.sin(circtime * this.speed);
    this.y = by - this.dist * Math.cos(circtime * this.speed);
}

function developerChange() {

    // "+" means parseInt

    // DeveloperInterface
    globalInterfaceValues.planetSize = +$("#planetSizeLabel").text();
    globalInterfaceValues.planetName = $('select[name=planetSelect]').val();
    //globalInterfaceValues.engine = $('select[name=engineSelect]').val();
    globalInterfaceValues.timeFactor = +$("#timeFactorLabel").text();
    globalInterfaceValues.planetCamera = $('select[name=planetCamera]').val();
    //globalInterfaceValues.reset = $('input[name=reset]').val();
    globalInterfaceValues.changed = true;


    $(".ui-slider-handle").blur();
    $("#planetCamera-button").blur();
    $("#planetSelect-button").blur();

}

function rocketChange() {
    // RocketInterface
    // Bearbeitung
    globalInterfaceValues.rocketName = $('select[name=rocketSelect]').val();
    if (globalInterfaceValues.rocketName == "spaceTaxi") {
        $("#editBox").hide();
    } else {
        $("#editBox").show();
        if (!globalInterfaceValues.rocketName == "saturnV") {
            // build CustomRocket
        }
    }

    if (this == "mass_fuel1" || this == "mass_fuel2" || this == "mass_fuel3" || this == "mass_fuel4") {
        var stage = parseInt(this.substring(9, 10));
        // console.log(stage);
        //fuelMassChanged(stage);
    }
    globalInterfaceValues.changed = true;
    globalInterfaceValues.customRocketUsage = true;
    globalInterfaceValues.stage = +$("#stagesLabel").text();

    hideShowTabs();

    // update stages-array
    globalInterfaceValues.rocketTotalMass = 0;
    for (var i = 1; i <= globalInterfaceValues.stage; i++) {
        //var globalInterfaceValues.stages[i - 1] = globalInterfaceValues.stages[i - 1];
        var mass_empty = +$("#mass_empty" + i + "Label").text();
        var mass_fuel = +$("#mass_fuel" + i + "Label").text();
        var mass_total = mass_empty + mass_fuel;
        var thrust = +$("#thrust" + i + "Label").text();
        var burningtime = +$("#burningtime" + i + "Label").text();
        globalInterfaceValues.stages[i - 1] = {
            mass_empty: mass_empty,
            mass_fuel: mass_fuel,
            mass_total: mass_total,
            thrust: thrust,
            burningtime: burningtime
        };
        // set labels for each stage
        /*$("#mass_empty" + i + "Label").text(globalInterfaceValues.stages[i - 1].mass_empty);
        $("#mass_fuel" + i + "Label").text(globalInterfaceValues.stages[i - 1].mass_fuel);
       
        $("#burningtime" + i + "Label").text(globalInterfaceValues.stages[i - 1].burningtime);
        $("#thrust" + i + "Label").text(globalInterfaceValues.stages[i - 1].thrust);*/
        $("#mass_total" + i + "Label").text(globalInterfaceValues.stages[i - 1].mass_total);
        globalInterfaceValues.rocketTotalMass += globalInterfaceValues.stages[i - 1].mass_total;
    }
    $("#rocketTotalMassLabel").text(globalInterfaceValues.rocketTotalMass);

    globalInterfaceValues.burningtime = +$("#burningtimeLabel").text();
    globalInterfaceValues.thrust = +$("#thrustLabel").text();


    $(".ui-slider-handle").blur();
    $("#rocketSelect-button").blur();
    $(".ui-tabs").blur();
    //console.log(globalInterfaceValues);


}

function soundOnOff(button) {    
    if ($(button).hasClass("fa-volume-up")) {        
        $(button).removeClass('fa-volume-up').addClass('fa-volume-off');    
    } else if ($(button).hasClass("fa-volume-off")) {      
        $(button).removeClass("fa-volume-off").addClass("fa-volume-up")    
    }
}

function startNew(button) {
    $("#startNewDialog").text("Are you sure you want to reload the entire game? Everything will be set to default. Your custom rockets will still be available after reloading.");
    $("#startNewDialog").dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Reload Game": function() {
                $(this).dialog("close");
                //window.open("OpenSpace.html","_self")
                location.href = "OpenSpace.html";
            },
            "Cancel": function() {
                $(this).dialog("close");
            }
        }
    });
}

function cheatFuel() {
    $("#dialog").text("Congrats! You have unlimited fuel!");
    $("#dialog").dialog();
    globalInterfaceValues.fuelCheat = true;
}

var defaultRocketsString = "<option value='saturnV'>Saturn V</option><option value='spaceTaxi'>Space Taxi</option>";
var customRocketButtonsString = "";

/*function saveCustomRocket(button) {
    var customRocketName = document.getElementById("customRocketNameTextfield").value;
    var customRocketFullName = "customRocket" + customRocketName;
    var customRocketValues = globalInterfaceValues.timeFactor;
    localStorage.setItem(customRocketFullName, customRocketValues);
    customRocketButtonsString += "<input type='button' id='" + customRocketFullName + "' class='btn ui-button ui-widget ui-corner-all' value='" + customRocketName + "' title='Use Custom Rocket' onclick='loadCustomRocket(this)'>";
    showCustomRocketButtons();
}*/

/*function saveCustomRocket(button) {
    var customRocketName = document.getElementById("customRocketNameTextfield").value;
    var customRocketFullName = "customRocket" + customRocketName;
    //var customRocketValues = globalInterfaceValues.timeFactor;
    localStorage.setItem(customRocketFullName, JSON.stringify(globalInterfaceValues));
    customRocketButtonsString += "<input type='button' id='" + customRocketFullName + "' class='btn ui-button ui-widget ui-corner-all' value='" + customRocketName + "' title='Use Custom Rocket' onclick='loadCustomRocket(this)'>";
    $(".btn").blur();
    showCustomRocketButtons();
}*/

function saveCustomRocket(button) {
    var customRocketName = document.getElementById("customRocketNameTextfield").value;
    var customRocketFullName = "customRocket" + customRocketName;
    //var customRocketValues = globalInterfaceValues.timeFactor;
    localStorage.setItem(customRocketFullName, JSON.stringify(globalInterfaceValues));
    customRocketButtonsString += "<option id='" + customRocketFullName + "'  value='" + customRocketName + "' title='Use Custom Rocket' onclick='loadCustomRocket(this)'>" + customRocketName + "</option>";
    $(".btn").blur();
    $("#customRocketNameTextfield").blur();
    showCustomRocketButtons();
}

function showCustomRocketButtons() {
    //$("#useCustomRocketButton").html(customRocketButtonsString);
    var fullRocketSelectString = defaultRocketsString + customRocketButtonsString;
    $("#rocketSelect").html(fullRocketSelectString);
    $("#rocketSelect").selectmenu("destroy").selectmenu({ style: "dropdown" });
}

document.addEventListener('DOMContentLoaded', function() {
    for (var key in localStorage) {
        if (key.startsWith("customRocket")) {
           var customRocketName = key.replace("customRocket", "");
           /*  customRocketButtonsString += "<input type='button' id='" + key + "' class='btn ui-button ui-widget ui-corner-all' value='" + customRocketName + "' title='Use Custom Rocket' onclick='loadCustomRocket(this)'>";*/
        customRocketButtonsString += "<option id='" + key + "'  value='" + customRocketName + "' title='Use Custom Rocket' onclick='loadCustomRocket(this)'>" + customRocketName + "</option>";
        showCustomRocketButtons();
        }
    }
}, false);

function loadCustomRocket(button) {
    var customRocket = button.id;
    globalInterfaceValues = JSON.parse(localStorage.getItem(customRocket));
    console.log(globalInterfaceValues);
    console.log(globalInterfaceValues.timeFactor);
    console.log(globalInterfaceValues.rocketTotalMass);
    console.log(globalInterfaceValues);
    $(".btn").blur();
}

function deleteLocalStorage() {
    localStorage.clear();
    //$("#useCustomRocketButton").html("");
    customRocketButtonsString = "";
    $(".btn").blur();
    showCustomRocketButtons();
    
}

function resetEditor() {
    globalInterfaceValues.rocketName = "saturnV";
    $("#rocketSelect").val(globalInterfaceValues.rocketName);
    $("#rocketSelect").selectmenu("refresh");
    globalInterfaceValues.stage = 3;
    $("#stagesLabel").text(globalInterfaceValues.stage);
    $("#stages").slider("option", "value", globalInterfaceValues.stage);


    initDefaultValuesAndCreateLabels();
    for (var i = 1; i <= globalInterfaceValues.stages.length; i++) {
        $("#mass_empty" + i).slider("option", "value", globalInterfaceValues.stages[i - 1].mass_empty);
        $("#mass_fuel" + i).slider("option", "value", globalInterfaceValues.stages[i - 1].mass_fuel);
        $("#burningtime" + i).slider("option", "value", globalInterfaceValues.stages[i - 1].burningtime);
        $("#thrust" + i).slider("option", "value", globalInterfaceValues.stages[i - 1].thrust);
    }

    //console.log(globalInterfaceValues);
    //rocketChange();
}

function hideShowTabs() {
    // hide all stages-tabs
    for (var i = 1; i <= 4; i++) {
        $("#stage" + i).hide();
    }
    // show stages-tabs for selected stages
    for (var i = 1; i <= globalInterfaceValues.stage; i++) {
        $("#stage" + i).show();
    }
}

function initDefaultValuesAndCreateLabels() {
    globalInterfaceValues.rocketTotalMass = 0;
    for (var i = 1; i <= globalInterfaceValues.stages.length; i++) {
        if (i < 4) {
            // get variables from SaturnV-Object
            var mass_empty = saturnV["stage" + i].mass_empty;
            var mass_fuel = saturnV["stage" + i].mass_fuel;
            var mass_total = mass_empty + mass_fuel;
            var thrust = saturnV["stage" + i].thrust;
            var burningtime = saturnV["stage" + i].burningtime;
        } else {
            // get variables for Stage4-Slider
            var mass_empty = globalInterfaceValues.stages[i - 1].mass_empty;
            var mass_fuel = globalInterfaceValues.stages[i - 1].mass_fuel;
            var mass_total = mass_empty + mass_fuel;
            var thrust = globalInterfaceValues.stages[i - 1].thrust;
            var burningtime = globalInterfaceValues.stages[i - 1].burningtime;
        }
        // store variables in global variable
        globalInterfaceValues.stages[i - 1] = {
            mass_empty: mass_empty,
            mass_fuel: mass_fuel,
            mass_total: mass_total,
            thrust: thrust,
            burningtime: burningtime
        };
        // set labels for each stage
        $("#mass_empty" + i + "Label").text(globalInterfaceValues.stages[i - 1].mass_empty);
        $("#mass_fuel" + i + "Label").text(globalInterfaceValues.stages[i - 1].mass_fuel);
        $("#mass_total" + i + "Label").text(globalInterfaceValues.stages[i - 1].mass_total);
        $("#burningtime" + i + "Label").text(globalInterfaceValues.stages[i - 1].burningtime);
        $("#thrust" + i + "Label").text(globalInterfaceValues.stages[i - 1].thrust);
        globalInterfaceValues.rocketTotalMass += globalInterfaceValues.stages[i - 1].mass_total;
    }
}

function updateLoading(percentage) {
    $("#loadingRocket").attr("src", "UserInterface/img/rocket" + percentage + ".png");
    $("#loadingPercentage").text(percentage);
}

/*function preventBubbling(evt) {
    console.log("no bubbling yay")
    evt.stopPropagation();
}*/
/*
$(document).ready(function() {
$( "#customRocketNameTextfield" ).keydown(function( e ) {
  e.stopPropagation();
  console.log("no bubbling yayy");
});
    });*/
