/* 
This program is licensed under the GNU General Public License as described in the file „LICENSE“
Copyright (C) 2017 TH Nürnberg
Authors: Marius Reuther Franziska Braun, Lea Uhlenbrock, Selina Forster, Theresa Breitenhuber, Marco Lingenhöl
Contact: openspacesimulation@gmail.com
*/




$(function() {
    //var valMap = [0.1, 0.2, 0.5, 1, 10, 100, 1000, 10000, 100000];

    // build Sliders
    // RocketInterface


    // fill stages-array with stage-objects and create sliders
    var stages = globalInterfaceValues.stages;
    var rocketTotalMass = 0;

    var stage = globalInterfaceValues.stage = 3;
    rocketSlide("stages", 1, 4, 1, stage);
    for (var i = 1; i <= globalInterfaceValues.stages.length; i++) {
        var currentStage = globalInterfaceValues.stages[i - 1];
        if (i < 4) {
            // get variables from SaturnV-Object
            var mass_empty = saturnV["stage" + i].mass_empty;
            var mass_fuel = saturnV["stage" + i].mass_fuel;
            var mass_total = mass_empty + mass_fuel;
            var thrust = saturnV["stage" + i].thrust;
            var burningtime = saturnV["stage" + i].burningtime;
        } else {
            // get variables for Stage4-Slider
            var mass_empty = currentStage.mass_empty;
            var mass_fuel = currentStage.mass_fuel;
            var mass_total = mass_empty + mass_fuel;
            var thrust = currentStage.thrust;
            var burningtime = currentStage.burningtime;
        }
        // store variables in global variable
        currentStage = {
            mass_empty: mass_empty,
            mass_fuel: mass_fuel,
            mass_total: mass_total,
            thrust: thrust,
            burningtime: burningtime
        };

        // build slider with variables from global variable
        rocketSlide("mass_empty" + i, 0, 100000, 100, currentStage.mass_empty);
        rocketSlide("mass_fuel" + i, 0, 3000000, 1000, currentStage.mass_fuel);
        rocketSlide("burningtime" + i, 0, 6000, 10, currentStage.burningtime);
        rocketSlide("thrust" + i, 0, 50000000, 1000, currentStage.thrust);

        // set labels for each stage
        $("#mass_empty" + i + "Label").text(currentStage.mass_empty);
        $("#mass_fuel" + i + "Label").text(currentStage.mass_fuel);
        $("#mass_total" + i + "Label").text(currentStage.mass_total);
        $("#burningtime" + i + "Label").text(currentStage.burningtime);
        $("#thrust" + i + "Label").text(currentStage.thrust);
        $("#mass_total" + i + "Label").text(currentStage.mass_total);
        rocketTotalMass += currentStage.mass_total;
    }

    // DeveloperInterface
    developerSlide("planetSize", 1, 1000, 1, globalInterfaceValues.planetSize);
    // build Time Factor Slider
    var valMap = [0.1, 0.2, 0.5, 1, 10, 100, 1000, 10000, 100000, 1000000];
    $("#timeFactor").slider({
        // min: 0,
        max: valMap.length - 1,
        value: 3,
        slide: function(event, ui) {
            $("#val").text(ui.value);
            $("#timeFactorLabel").text(valMap[ui.value]);
        },
        change: developerChange
    });

    // build Selects
    $("#planetCamera, #planetSelect").selectmenu({
        change: developerChange
    });
    $("#rocketSelect").selectmenu({
        change: rocketChange
    })

    // build Labels
    // RocketInterface
    /*$("#speedLabel").text(globalInterfaceValues.speed);
    $("#fuelLabel").text(globalInterfaceValues.fuel);*/
    $("#stagesLabel").text(globalInterfaceValues.stage);
    // set labels from stages-array
    /*for (var i = 1; i <= stages.length; i++) {
        var currentStage = globalInterfaceValues.stages[i - 1];
        $("#mass_empty" + i + "Label").text(currentStage.mass_empty);
        $("#mass_fuel" + i + "Label").text(currentStage.mass_fuel);
        $("#mass_total" + i + "Label").text(currentStage.mass_total);
        $("#burningtime" + i + "Label").text(currentStage.burningtime);
        $("#thrust" + i + "Label").text(currentStage.thrust);
    }*/

    globalInterfaceValues.rocketTotalMass = rocketTotalMass;
    $("#rocketTotalMassLabel").text(globalInterfaceValues.rocketTotalMass);

    // DeveloperInterface 
    $("#planetSizeLabel").text(globalInterfaceValues.planetSize);
    $("#timeFactorLabel").text(globalInterfaceValues.timeFactor);


    // build Gauges
    $('#speedGauge .gauge-arrow').cmGauge();
    $('#fuelGauge .gauge-arrow').cmGauge();
    $('#throttleGauge .gauge-arrow').cmGauge();

    /*if(watchglob(globalInterfaceValues.throttle)){ $("#throttleGaugeLabel").text(globalInterfaceValues.throttle);
    }*/
    $('#throttleGauge .gauge-arrow').trigger('updateGauge', globalInterfaceValues.throttle);
    $("#throttleGaugeLabel").text(globalInterfaceValues.throttle);

    /*if(watchglob(globalInterfaceValues.speed)){
    $("#speedLabel").text(globalInterfaceValues.speed);
    }*/
    $('#speedGauge .gauge-arrow').trigger('updateGauge', globalInterfaceValues.speed);
    $("#speedGaugeLabel").text(globalInterfaceValues.speed);

    /*if(watchglob(globalInterfaceValues.fuel)){
    $("#fuelLabel").text(globalInterfaceValues.fuel); 
    }*/
    $('#fuelGauge .gauge-arrow').trigger('updateGauge', globalInterfaceValues.fuel);
    $("#fuelGaugeLabel").text(globalInterfaceValues.fuel);

    // build Tabs
    $("#tabs").tabs();

    // hide all stages-tabs
    for (var i = 1; i <= 4; i++) {
        $("#stage" + i).hide();
    }
    // show stages-tabs for selected stages
    for (var i = 1; i <= globalInterfaceValues.stage; i++) {
        $("#stage" + i).show();
    }

    // pad height-number with zero and parse to string
    var height = zeroFill(globalInterfaceValues.height, 9);

    // build Height-Flapper
    var $heightDisplay = $('#heightDisplay');
    $heightDisplay.flapper({
        width: 9,
        chars_preset: 'num'
    });
    $heightDisplay.val(height).change();

    var $currentStageDisplay = $('#currentStageDisplay');
    $currentStageDisplay.flapper({
        width: 1,
        chars_preset: 'num'
    });
    $currentStageDisplay.val(globalInterfaceValues.currentStage).change();

    // reset Editor
    $("#resetEditor").click(function() {
        loadRocketSlider();
    });

    /*setTimeout(function() {
        $header_display.val(000000000).change();
        var toggle = true;
        setInterval(function() {
            if (toggle) {
                $header_display.val(000000000).change();
            } else {
                $header_display.val(999999999).change();
            }
            toggle = !toggle;
        }, 5000);
    }, 1000);*/


    //inputChange();

    //$("#check").checkboxradio();
});

function developerSlide(name, min, max, step, val) {
    $("#" + name).slider({
        min: min,
        max: max,
        value: val,
        step: step,
        slide: function(event, ui) {
            $("#" + name + "Label").text(ui.value);
        },
        change: developerChange
    });
}

function rocketSlide(name, min, max, step, val) {
    $("#" + name).slider({
        min: min,
        max: max,
        value: val,
        step: step,
        slide: function(event, ui) {
            $("#" + name + "Label").text(ui.value);
        },
        change: rocketChange.bind(name)
    });
}

/*function watchglob(glob) {
    var tmp_glob = glob;
    setTimeout(function() {
        if (tmp_glob == glob) {
            console.log("The value hasn't changed." + glob);
            return false;
        } else {
            console.log("The value has changed" + glob);
            tmp_glob = glob;
            return true;
        }
    }, 10000);
}*/

function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
}