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
    
    globalInterfaceValues.fuelCheat = true;
    console.log(globalInterfaceValues.fuelCheat);

    $(".ui-slider-handle").blur();
    $("#planetCamera-button").blur();
    $("#planetSelect-button").blur();

}

function rocketChange() {
    // RocketInterface
    // Bearbeitung
    if (this == "mass_fuel1" || this == "mass_fuel2" || this == "mass_fuel3" || this == "mass_fuel4") {
        var stage = parseInt(this.substring(9, 10));
        console.log(stage);
        //fuelMassChanged(stage);
    }
    globalInterfaceValues.changed = true;
    globalInterfaceValues.customRocketUsage = true;
    globalInterfaceValues.rocketName = $('select[name=rocketSelect]').val();
    globalInterfaceValues.stage = +$("#stagesLabel").text();
    // hide all stages-tabs
    for (var i = 1; i <= 4; i++) {
        $("#stage" + i).hide();
    }
    // show stages-tabs for selected stages
    for (var i = 1; i <= globalInterfaceValues.stage; i++) {
        $("#stage" + i).show();
    }

    // update stages-array
    var rocketTotalMass = globalInterfaceValues.rocketTotalMass;
    for (var i = 1; i <= globalInterfaceValues.stage; i++) {
        var currentStage = globalInterfaceValues.stages[i - 1];
        var mass_empty = +$("#mass_empty" + i + "Label").text();
        var mass_fuel = +$("#mass_fuel" + i + "Label").text();
        var mass_total = mass_empty + mass_fuel;
        var thrust = +$("#thrust" + i + "Label").text();
        var burningtime = +$("#burningtime" + i + "Label").text();
        currentStage = {
            mass_empty: mass_empty,
            mass_fuel: mass_fuel,
            mass_total: mass_total,
            thrust: thrust,
            burningtime: burningtime
        };
        $("#mass_total" + i + "Label").text(currentStage.mass_total);
        rocketTotalMass += currentStage.mass_total;
    }
    $("#rocketTotalMassLabel").text(rocketTotalMass);

    globalInterfaceValues.burningtime = +$("#burningtimeLabel").text();
    globalInterfaceValues.thrust = +$("#thrustLabel").text();

    $(".ui-slider-handle").blur();
    console.log(globalInterfaceValues.rocketTotalMass);
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
    inputChange();
}


var customRocketButtonsString = "";

/*function saveCustomRocket(button) {
    var customRocketName = document.getElementById("customRocketNameTextfield").value;
    var customRocketFullName = "customRocket" + customRocketName;
    var customRocketValues = globalInterfaceValues.timeFactor;
    localStorage.setItem(customRocketFullName, customRocketValues);
    customRocketButtonsString += "<input type='button' id='" + customRocketFullName + "' class='btn ui-button ui-widget ui-corner-all' value='" + customRocketName + "' title='Use Custom Rocket' onclick='loadCustomRocket(this)'>";
    showCustomRocketButtons();
}*/

function saveCustomRocket(button) {
    var customRocketName = document.getElementById("customRocketNameTextfield").value;
    var customRocketFullName = "customRocket" + customRocketName;
    //var customRocketValues = globalInterfaceValues.timeFactor;
    localStorage.setItem(customRocketFullName, JSON.stringify(globalInterfaceValues));
    customRocketButtonsString += "<input type='button' id='" + customRocketFullName + "' class='btn ui-button ui-widget ui-corner-all' value='" + customRocketName + "' title='Use Custom Rocket' onclick='loadCustomRocket(this)'>";
    showCustomRocketButtons();
}

function showCustomRocketButtons() {
    $("#useCustomRocketButton").html(customRocketButtonsString);
}

document.addEventListener('DOMContentLoaded', function() {
    for (var key in localStorage){
        if (key.startsWith("customRocket")) {
            var customRocketName = key.replace("customRocket", "");
            customRocketButtonsString += "<input type='button' id='" + key + "' class='btn ui-button ui-widget ui-corner-all' value='" + customRocketName + "' title='Use Custom Rocket' onclick='loadCustomRocket(this)'>";
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
}

function deleteLocalStorage() {
    localStorage.clear();
    $("#useCustomRocketButton").html("");
    customRocketButtonsString = "";
    
}