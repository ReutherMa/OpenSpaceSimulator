/* 
This program is licensed under the GNU General Public License as described in the file „LICENSE“
Copyright (C) 2017 TH Nürnberg
Authors: Marius Reuther Franziska Braun, Lea Uhlenbrock, Selina Forster, Theresa Breitenhuber, Marco Lingenhöl
Contact: openspacesimulation@gmail.com
*/



//var prompty = 0;


function prompt(errorstring) {
    if (global.fuelPrompt == false) {
        $("#dialog").text(errorstring);
        $("#dialog").dialog({
            open: function(event, ui) {
                setTimeout("$('#dialog').dialog('close')", 2500);
            }
        });
        global.fuelPrompt == true;
    }
}

$(".ui-menu-item").click(function(e) {
    $("#rocketSelect-button").blur();
})

function blurSelectMenu() {
    $("#rocketSelect-button").blur();
    $("#planetCamera-button").blur();
    $("#planetSelect-button").blur();
    $(".ui-tabs-anchor").blur();
}

function deleteTextfieldValue() {
    $("#customRocketNameTextfield").val("");
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
        renderNavball = false;
    } else {
        $("#" + button.id).addClass("activeInterface");
        renderNavball = true;
    }
    $(".btn").blur();
}

function hideRocketInterface() {
    $("#rocketInterface").hide(100);
    $("#rocket").prop("disabled", true).removeClass("activeInterface").addClass("disabledInterfaceButton");

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

function rocketSelectChange() {
    globalInterfaceValues.rocketName = $('select[name=rocketSelect]').val();
    if (globalInterfaceValues.rocketName == "spaceTaxi") {
        $("#editBox").hide();
    } else if (globalInterfaceValues.rocketName == "saturnV") {
        $("#editBox").show();
        resetEditor();
    } else {
        var customRocket = "customRocket" + globalInterfaceValues.rocketName;
        $("#editBox").show();
        globalInterfaceValues = JSON.parse(localStorage.getItem(customRocket));
        globalInterfaceValues.customRocketUsage = true;
        setSliderValuesAndLabels();
    }
    rocketChange();
    $("#rocketSelect-button").blur();
}

function fuelChange() {
    var stage = parseInt(this.substring(9, 10));
    fuelMassChanged(stage);
    $("#burningtime" + stage + "Label").text(globalInterfaceValues.stages[stage - 1].burningtime);
    rocketChange();
}

function thrustChange() {
    var stage = parseInt(this.substring(6, 7));
    thrustChanged(stage);
    $("#burningtime" + stage + "Label").text(globalInterfaceValues.stages[stage - 1].burningtime);
    $("#mass_empty" + stage + "Label").text(globalInterfaceValues.stages[stage - 1].mass_empty);
    $("#mass_empty" + stage).slider("option", "value", globalInterfaceValues.stages[stage - 1].mass_empty);
    rocketChange();
}

function massChange() {
    console.log(this.substring(10, 11));
    var stage = parseInt(this.substring(10, 11));
    emptyMassChanged(stage);
    $("#burningtime" + stage + "Label").text(globalInterfaceValues.stages[stage - 1].burningtime);
    $("#thrust" + stage + "Label").text(globalInterfaceValues.stages[stage - 1].thrust);
    $("#thrust" + stage).slider("option", "value", globalInterfaceValues.stages[stage - 1].thrust);
    rocketChange();
}

function rocketChange() {
    // RocketInterface
    // Bearbeitung
    globalInterfaceValues.changed = true;
    globalInterfaceValues.stage = +$("#stagesLabel").text();
    hideShowTabs();
    // update stages-array
    globalInterfaceValues.fuel_total = 0;
    globalInterfaceValues.rocketTotalMass = 0;
    for (var i = 1; i <= globalInterfaceValues.stages.length; i++) {
        var mass_empty = 0;
        var mass_fuel = 0;
        var mass_total = 0;
        var thrust = 0;
        var burningtime = 0;
        if (i <= globalInterfaceValues.stage) {
            mass_empty = +$("#mass_empty" + i + "Label").text();
            mass_fuel = +$("#mass_fuel" + i + "Label").text();
            mass_total = mass_empty + mass_fuel;
            thrust = +$("#thrust" + i + "Label").text();
            burningtime = +$("#burningtime" + i + "Label").text();
        } 

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

        // set values for rocketObject
        var stage = "stage" + i;
        if (i <= globalInterfaceValues.stage) {
            saturnV[stage].mass_empty = globalInterfaceValues.stages[i - 1].mass_empty;
            saturnV[stage].mass_fuel = globalInterfaceValues.stages[i - 1].mass_fuel;
            saturnV[stage].burningtime = globalInterfaceValues.stages[i - 1].burningtime;
            saturnV[stage].thrust = globalInterfaceValues.stages[i - 1].thrust;
        } else {
            saturnV[stage].mass_empty = 0;
            saturnV[stage].mass_fuel = 0;
            saturnV[stage].burningtime = 0;
            saturnV[stage].thrust = 0;
        }
        // calculate rocketTotalMass
        globalInterfaceValues.rocketTotalMass += globalInterfaceValues.stages[i - 1].mass_total;
        // calculate fuelTotalMass
        globalInterfaceValues.fuel_total += globalInterfaceValues.stages[i - 1].mass_fuel;

    }

    // set values for rocketObject
    saturnV.fuel_total = globalInterfaceValues.fuel_total;
    saturnV.mass_total = globalInterfaceValues.rocketTotalMass;
    //$("#fuelTotalMassLabel").text(globalInterfaceValues.fuel_total);
    $("#rocketTotalMassLabel").text(globalInterfaceValues.rocketTotalMass);
        
    $(".ui-slider-handle").blur();
    $("#rocketSelect-button").blur();
    $(".ui-tabs").blur();
}




function soundOnOff(button) {    
    if ($(button).hasClass("fa-volume-up")) {        
        $(button).removeClass('fa-volume-up').addClass('fa-volume-off');    
    } else if ($(button).hasClass("fa-volume-off")) {      
        $(button).removeClass("fa-volume-off").addClass("fa-volume-up")    
    }
    $(".btn").blur();
}

var obstaclePromptDisplayed = false; //false means it hasnt been shown yet

function startNew(value) {
    $(".btn").blur();
    if (value == "button" || obstaclePromptDisplayed == false) {
        if (value == "button") {
            $("#startNewDialog").text("Are you sure you want to reload the entire game? Everything will be set to default. Your custom rockets will still be available after reloading.");
        } else if (value == "obstacle") {
            $("#startNewDialog").text("Looks like you hit an obstacle. Restart game.");
            obstaclePromptDisplayed = true;
        }
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
}

/*$(".btn").mouseup(function(e) {
    $(this).blur();
})*/

function cheatFuel() {
    $("#dialog").text("Congrats! You have unlimited fuel!");
    $("#dialog").dialog({
            open: function(event, ui) {
                setTimeout("$('#dialog').dialog('close')", 2500);
            }
        });
    globalInterfaceValues.fuelCheat = true;
}

var defaultRocketsString = "<option value='saturnV'>Saturn V</option><option value='spaceTaxi'>Space Taxi</option>";
var customRocketButtonsString = "";

function saveCustomRocket(button) {
    var customRocketName = document.getElementById("customRocketNameTextfield").value;
    $(".btn").blur();
    if(customRocketName != "") {
        var customRocketFullName = "customRocket" + customRocketName;
        globalInterfaceValues.rocketName = customRocketName;
        //var customRocketValues = globalInterfaceValues.timeFactor;
        localStorage.setItem(customRocketFullName, JSON.stringify(globalInterfaceValues));
        customRocketButtonsString += "<option id='" + customRocketFullName + "'  value='" + customRocketName + "' title='Use Custom Rocket' selected>" + customRocketName + "</option>";
        $("#customRocketNameTextfield").blur().val("");
        $("#dialog").html("Custom Rocket successfully saved! You can find it in the rocket selectbox. <br> Your custom rockets will still be available after reloading the game.").dialog({
            open: function(event, ui) {
                setTimeout("$('#dialog').dialog('close')", 2500);
            }
        });
    showCustomRocketButtons();
        } else {
           $("#dialog").html("Please give your rocket a name.").dialog({
            open: function(event, ui) {
                setTimeout("$('#dialog').dialog('close')", 2500);
            }
        }); 
        }
}

function createSelectString() {
    //$("#useCustomRocketButton").html(customRocketButtonsString);
    var fullRocketSelectString = defaultRocketsString + customRocketButtonsString;
    $("#rocketSelect").html(fullRocketSelectString);
}

function showCustomRocketButtons() {
    createSelectString();
    $("#rocketSelect").selectmenu("destroy").selectmenu({
        select: rocketSelectChange
    });
}

document.addEventListener('DOMContentLoaded', function() {
    $("#dialog").html("How to play: <br> <i class='fa fa-rocket' aria-hidden='true'></i>  Select or build a rocket in the rocket editor <br> <i class='fa fa-video-camera' aria-hidden='true'></i> Watch your rocket take off and fly or discover our solar system <br> <i class='fa fa-tachometer' aria-hidden='true'></i> Control your rocket <br><i class='fa fa-info' aria-hidden='true'></i> For further information and key assignments check out the infobox<br> <strong>Enjoy</strong>");
    $("#dialog").dialog();
    for (var key in localStorage) {
        if (key.startsWith("customRocket")) {
            var customRocketName = key.replace("customRocket", "");
            /*  customRocketButtonsString += "<input type='button' id='" + key + "' class='btn ui-button ui-widget ui-corner-all' value='" + customRocketName + "' title='Use Custom Rocket' onclick='loadCustomRocket(this)'>";*/
            customRocketButtonsString += "<option id='" + key + "'  value='" + customRocketName + "' title='Use Custom Rocket' onclick='loadCustomRocket(this)'>" + customRocketName + "</option>";
            createSelectString();
        }
    }
}, false);

function loadCustomRocket(button) {
    var customRocket = button.id;
    globalInterfaceValues = JSON.parse(localStorage.getItem(customRocket));
    $(".btn").blur();
}

function deleteLocalStorage() {
    localStorage.clear();
    //$("#useCustomRocketButton").html("");
    customRocketButtonsString = "";
    $(".btn").blur();
    $("#dialog").html("All Custom Rockets have been deleted.").dialog({
            open: function(event, ui) {
                setTimeout("$('#dialog').dialog('close')", 2500);
            }
        });
    showCustomRocketButtons();

}

function resetEditor() {
    $(".btn").blur();
    globalInterfaceValues.rocketName = "saturnV";
    $("#rocketSelect").val(globalInterfaceValues.rocketName);
    $("#rocketSelect").selectmenu("refresh");
    globalInterfaceValues.stage = 3;
    $("#stagesLabel").text(globalInterfaceValues.stage);
    $("#stages").slider("option", "value", globalInterfaceValues.stage);
    initializeRocket();
    initDefaultValuesAndCreateLabels();
    for (var i = 1; i <= globalInterfaceValues.stages.length; i++) {
        $("#mass_empty" + i).slider("option", "value", globalInterfaceValues.stages[i - 1].mass_empty);
        $("#mass_fuel" + i).slider("option", "value", globalInterfaceValues.stages[i - 1].mass_fuel);
        //$("#burningtime" + i).slider("option", "value", globalInterfaceValues.stages[i - 1].burningtime);
        $("#thrust" + i).slider("option", "value", globalInterfaceValues.stages[i - 1].thrust);
    }
    console.log(globalInterfaceValues);
    console.log(saturnV);
    
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
        }
        /*else {
            // get variables for Stage4-Slider
            var mass_empty = globalInterfaceValues.stages[i - 1].mass_empty;
            var mass_fuel = globalInterfaceValues.stages[i - 1].mass_fuel;
            var mass_total = mass_empty + mass_fuel;
            var thrust = globalInterfaceValues.stages[i - 1].thrust;
            var burningtime = globalInterfaceValues.stages[i - 1].burningtime;
        }*/
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


function setSliderValuesAndLabels() {
    globalInterfaceValues.rocketTotalMass = 0;
    for (var i = 1; i <= globalInterfaceValues.stage; i++) {
        if (i <= globalInterfaceValues.stage) {
            // get variables from SaturnV-Object
            var mass_empty = globalInterfaceValues.stages[i - 1].mass_empty;
            var mass_fuel = globalInterfaceValues.stages[i - 1].mass_fuel;
            var mass_total = mass_empty + mass_fuel;
            var thrust = globalInterfaceValues.stages[i - 1].thrust;
            var burningtime = globalInterfaceValues.stages[i - 1].burningtime;
        } else {
            // get variables for Stage4-Slider
            /*var mass_empty = globalInterfaceValues.stages[i - 1].mass_empty;
            var mass_fuel = globalInterfaceValues.stages[i - 1].mass_fuel;
            var mass_total = mass_empty + mass_fuel;
            var thrust = globalInterfaceValues.stages[i - 1].thrust;
            var burningtime = globalInterfaceValues.stages[i - 1].burningtime;*/
            globalInterfaceValues.stages[i - 1].mass_empty = 0;
            globalInterfaceValues.stages[i - 1].mass_fuel = 0;
            var mass_total = mass_empty + mass_fuel;
            globalInterfaceValues.stages[i - 1].thrust = 0;
            globalInterfaceValues.stages[i - 1].burningtime = 0;
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
    $("#rocketTotalMassLabel").text(globalInterfaceValues.rocketTotalMass);
    $("#stagesLabel").text(globalInterfaceValues.stage);
    $("#stages").slider("value", globalInterfaceValues.stage);
    for (var i = 1; i <= globalInterfaceValues.stages.length; i++) {
        $("#mass_empty" + i).slider("option", "value", globalInterfaceValues.stages[i - 1].mass_empty);
        $("#mass_fuel" + i).slider("option", "value", globalInterfaceValues.stages[i - 1].mass_fuel);
        //$("#burningtime" + i).slider("option", "value", globalInterfaceValues.stages[i - 1].burningtime);
        $("#thrust" + i).slider("option", "value", globalInterfaceValues.stages[i - 1].thrust);
    }
    
    //destroyAndRecreateSlider();
}

function destroyAndRecreateSlider(){
    rocketSlide("stages", 1, 3, 1, globalInterfaceValues.stage);
    initDefaultValuesAndCreateLabels();
    for (var i = 1; i <= globalInterfaceValues.stages.length; i++) {
        $( "#mass_empty" + i ).slider( "destroy" );
        $( "#mass_fuel" + i ).slider( "destroy" );
        $( "fuel" + i ).slider( "destroy" );
    }
    for (var i = 1; i <= globalInterfaceValues.stages.length; i++) {
    // build slider with variables from global variable
        rocketSlide("mass_empty" + i, 0, 100000, 100, globalInterfaceValues.stages[i - 1].mass_empty);
        fuelSlide("mass_fuel" + i, 0, 3000000, 1000, globalInterfaceValues.stages[i - 1].mass_fuel);
        //rocketSlide("burningtime" + i, 0, 6000, 10, globalInterfaceValues.stages[i - 1].burningtime);
        thrustSlide("thrust" + i, 0, 50000000, 1000, globalInterfaceValues.stages[i - 1].thrust);
    }
}