$(function() {
    //var valMap = [0.1, 0.2, 0.5, 1, 10, 100, 1000, 10000, 100000];

    // Sliders
    // RocketInterface
    slide("emptyMass", 0, 3, 1, globalInterfaceValues.emptyMass);
    slide("fuelMass", 0, 3, 1, globalInterfaceValues.fuelMass);
    slide("stages", 1, 4, 1, globalInterfaceValues.stage);
    slide("burningTime", 0, 10, 1, globalInterfaceValues.burningTime);
    slide("thrust", 0, 10, 1, globalInterfaceValues.thrust);
    // DeveloperInterface
    slide("planetSize", 1, 1000, 1, globalInterfaceValues.planetSize);
    // Time Factor Slider
    var valMap = [0.1, 0.2, 0.5, 1, 10, 100, 1000];
    $("#timeFactor").slider({
        // min: 0,
        max: valMap.length - 1,
        value: 3,
        slide: function(event, ui) {
            $("#val").text(ui.value);
            $("#timeFactorLabel").text(valMap[ui.value]);
        },
        change: inputChange
    });

    // Selects
    $("#planetCamera, #engineSelect, #planetSelect, #rocketSelect").selectmenu({
        change: inputChange
    });

    // Labels
    // RocketInterface
    /*$("#speedLabel").text(globalInterfaceValues.speed);
    $("#fuelLabel").text(globalInterfaceValues.fuel);*/
    $("#stagesLabel").text(globalInterfaceValues.stage);
    $("#emptyMassLabel").text(globalInterfaceValues.emptyMass);
    $("#fuelMassLabel").text(globalInterfaceValues.fuelMass);
    $("#totalMassLabel").text(globalInterfaceValues.totalMass);
    $("#burningTimeLabel").text(globalInterfaceValues.burningTime);
    $("#thrustLabel").text(globalInterfaceValues.thrust)
    //DeveloperInterface 
    $("#planetSizeLabel").text(globalInterfaceValues.planetSize);
    $("#timeFactorLabel").text(globalInterfaceValues.timeFactor);


    // Gauges
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



    //inputChange();

    //$("#check").checkboxradio();
});

function slide(name, min, max, step, val) {
    $("#" + name).slider({
        min: min,
        max: max,
        value: val,
        step: step,
        slide: function(event, ui) {
            $("#" + name + "Label").text(ui.value);
        },
        change: inputChange
    });
}

function watchglob(glob) {
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
}