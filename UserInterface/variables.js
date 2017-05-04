var globalInterfaceValues = {
    //Einstellungen
    throttle: 0,
    oxygen: 0,
    kerosene: 0,
    step: 1,
    emptyMass: 0,
    fuelMass: 0,
    totalMass: 0,
    planetName: "earth",
    planetSize: 1,
    planetAllSelected: false,
    planetCamera: "earth",
    engine: "Engine1",
    timeFactor: 1,
    changed: true,

    //Anzeige
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
    //globalInterfaceValues.throttle = +$("#throttleLabel").text();
    //globalInterfaceValues.oxygen = +$("#oxygenLabel").text();
    //globalInterfaceValues.kerosene = +$("#keroseneLabel").text();
    //globalInterfaceValues.step = +$('input[name=stepRange]').val();
    //globalInterfaceValues.emptyMass = +$("#emptyMassLabel").text();
    // globalInterfaceValues.fuelMass = +$("#fuelMassLabel").text();
    //globalInterfaceValues.totalMass = globalInterfaceValues.emptyMass + globalInterfaceValues.fuelMass;
    //$("#totalMass").text(globalInterfaceValues.totalMass);
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
    globalInterfaceValues.speed = +$("#speedLabel").text();

    $(".ui-slider-handle").blur();
    $("#planetCamera-button").blur();
    $("#planetSelect-button").blur();

}