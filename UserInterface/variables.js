var globalInterfaceValues = {
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
    timeFactor: 0,
    changed: false
};

$(function() {

    $("#planetCamera, #engineSelect").selectmenu({
        change: inputChange
    });
    $("#planetSelect").selectmenu({
        change: inputChange
    });

    //$("#check").checkboxradio();

    $('input').change(inputChange);
    $('select').change(inputChange);
    inputChange();


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
    //console.log("ist sie gecheckt?" + $("#check").prop("checked"))
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
   /* console.log("ja");
    console.log(globalInterfaceValues.timeFactor);
    console.log(globalInterfaceValues.planetCamera);
    console.log(globalInterfaceValues.planetSize);
    console.log(globalInterfaceValues.planetName);
*/
    //console.log("selected" + globalInterfaceValues.planetAllSelected);

    //console.log(typeof(globalInterfaceValues.engine));
    //console.log(globalInterfaceValues.planetCamera);
}