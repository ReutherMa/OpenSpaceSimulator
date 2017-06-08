$(function() {
    //var valMap = [0.1, 0.2, 0.5, 1, 10, 100, 1000, 10000, 100000];

    // build Sliders
    // RocketInterface
    slide("stages", 1, 4, 1, globalInterfaceValues.stage);
    // fill stages-array with stage-objects and create sliders
    var stages = globalInterfaceValues.stages;
    for (var i = 1; i <= stages.length; i++) {
        var currentStage = stages[i - 1];
        slide("emptyMass" + i, 0, 3, 1, currentStage.emptyMass);
        slide("fuelMass" + i, 0, 3, 1, currentStage.fuelMass);
        slide("burningTime" + i, 0, 10, 1, currentStage.burningTime);
        slide("thrust" + i, 0, 10, 1, currentStage.thrust);
    }
    // DeveloperInterface
    slide("planetSize", 1, 1000, 1, globalInterfaceValues.planetSize);
    // build Time Factor Slider
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

    // build Selects
    $("#planetCamera, #engineSelect, #planetSelect, #rocketSelect").selectmenu({
        change: inputChange
    });

    // build Labels
    // RocketInterface
    /*$("#speedLabel").text(globalInterfaceValues.speed);
    $("#fuelLabel").text(globalInterfaceValues.fuel);*/
    $("#stagesLabel").text(globalInterfaceValues.stage);
    // set labels from stages-array
    for (var i = 1; i <= stages.length; i++) {
        var currentStage = stages[i - 1];
        $("#emptyMass" + i + "Label").text(currentStage.emptyMass);
        $("#fuelMass" + i + "Label").text(currentStage.fuelMass);
        $("#totalMass" + i + "Label").text(currentStage.totalMass);
        $("#burningTime" + i + "Label").text(currentStage.burningTime);
        $("#thrust" + i + "Label").text(currentStage.thrust);
    }

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