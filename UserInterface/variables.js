var globalInterfaceValues = {
    // User Einstellungen

    // RocketInterface
    stage: 1,
    emptyMass: 0,
    fuelMass: 0,
    totalMass: 0,
    thrust: 0,
    burningTime: 0,
    
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
    globalInterfaceValues.emptyMass = +$("#emptyMassLabel").text();
    globalInterfaceValues.fuelMass = +$("#fuelMassLabel").text();
    globalInterfaceValues.totalMass = globalInterfaceValues.emptyMass + globalInterfaceValues.fuelMass;
    $("#totalMass").text(globalInterfaceValues.totalMass);
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