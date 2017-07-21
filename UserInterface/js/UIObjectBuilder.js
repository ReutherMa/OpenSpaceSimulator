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
    globalInterfaceValues.rocketTotalMass = 0;
    rocketSlide("stages", 1, 4, 1, globalInterfaceValues.stage);
    initDefaultValuesAndCreateLabels();
    for (var i = 1; i <= globalInterfaceValues.stages.length; i++) {
        // build slider with variables from global variable
        rocketSlide("mass_empty" + i, 0, 100000, 100, globalInterfaceValues.stages[i - 1].mass_empty);
        rocketSlide("mass_fuel" + i, 0, 3000000, 1000, globalInterfaceValues.stages[i - 1].mass_fuel);
        rocketSlide("burningtime" + i, 0, 6000, 10, globalInterfaceValues.stages[i - 1].burningtime);
        rocketSlide("thrust" + i, 0, 50000000, 1000, globalInterfaceValues.stages[i - 1].thrust);
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
        var globalInterfaceValues.stages[i - 1] = globalInterfaceValues.stages[i - 1];
        $("#mass_empty" + i + "Label").text(globalInterfaceValues.stages[i - 1].mass_empty);
        $("#mass_fuel" + i + "Label").text(globalInterfaceValues.stages[i - 1].mass_fuel);
        $("#mass_total" + i + "Label").text(globalInterfaceValues.stages[i - 1].mass_total);
        $("#burningtime" + i + "Label").text(globalInterfaceValues.stages[i - 1].burningtime);
        $("#thrust" + i + "Label").text(globalInterfaceValues.stages[i - 1].thrust);
    }*/
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

    hideShowTabs();

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
    //console.log(globalInterfaceValues);
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