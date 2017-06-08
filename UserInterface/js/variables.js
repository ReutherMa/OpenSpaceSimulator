var globalInterfaceValues = {
    // User Einstellungen

    // RocketInterface

    // TODO: Stages-Array mit Stages-Objekten
    stage: 1,
    stages: [{
        emptyMass: 0,
        fuelMass: 0,
        totalMass: 0,
        thrust: 0,
        burningTime: 0
    }, {
        emptyMass: 0,
        fuelMass: 0,
        totalMass: 0,
        thrust: 0,
        burningTime: 0
    }, {
        emptyMass: 0,
        fuelMass: 0,
        totalMass: 0,
        thrust: 0,
        burningTime: 0
    }, {
        emptyMass: 0,
        fuelMass: 0,
        totalMass: 0,
        thrust: 0,
        burningTime: 0
    }],
    height: 0,
    rocketTotalMass: 0,

    // DeveloperInterface
    planetName: "earth",
    planetSize: 1,
    planetAllSelected: false,
    planetCamera: "earth",
    timeFactor: 1,
    changed: true,

    // Anzeige

    // GameInteface
    throttle: 0,
    speed: 0,
    fuel: 0
};

$(function() {


    // inputChange();


    //checkRessources();
    //calculateTotalMass();
    //inputChange();

});

function inputChange() {

    // "+" means parseInt   
    // RocketInterface
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
        var emptyMass = +$("#emptyMass" + i + "Label").text();
        var fuelMass = +$("#fuelMass" + i + "Label").text();
        var totalMass = emptyMass + fuelMass;
        var thrust = +$("#thrust" + i + "Label").text();
        var burningTime = +$("#burningTime" + i + "Label").text();
        currentStage = {
            emptyMass: emptyMass,
            fuelMass: fuelMass,
            totalMass: totalMass,
            thrust: thrust,
            burningTime: burningTime
        };
        $("#totalMass" + i + "Label").text(currentStage.totalMass);
        rocketTotalMass += currentStage.totalMass;
    }
     $("#rocketTotalMassLabel").text(rocketTotalMass);

    globalInterfaceValues.burningTime = +$("#burningTimeLabel").text();
    globalInterfaceValues.thrust = +$("#thrustLabel").text();

    // DeveloperInterface
    globalInterfaceValues.planetSize = +$("#planetSizeLabel").text();
    globalInterfaceValues.planetName = $('select[name=planetSelect]').val();
    if ($("#check").is(':checked')) {
        globalInterfaceValues.planetAllSelected = true;
        $("#planetSelect").selectmenu("option", "disabled", true);
    } else {
        globalInterfaceValues.planetAllSelected = false;
        $("#planetSelect").selectmenu("option", "disabled", false);
    }
    //globalInterfaceValues.engine = $('select[name=engineSelect]').val();
    globalInterfaceValues.timeFactor = +$("#timeFactorLabel").text();
    globalInterfaceValues.planetCamera = $('select[name=planetCamera]').val();
    //globalInterfaceValues.reset = $('input[name=reset]').val();
    globalInterfaceValues.changed = true;

    $(".ui-slider-handle").blur();
    $("#planetCamera-button").blur();
    $("#planetSelect-button").blur();

}