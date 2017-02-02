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
    planetCamera: "sun",
    engine: "Engine1",
    timeFactor: 0,
    changed: false
};

$(function() {

    var valMap = [0.1, 0.2, 0.5, 1, 10, 100, 1000, 10000, 100000];
    $("#timeFactor").slider({
        // min: 0,
        max: valMap.length - 1,
        slide: function(event, ui) {
            $("#val").text(ui.value);
            $("#timeFactorLabel").text(valMap[ui.value]);
        },
        change: inputChange
    });
    slide("throttle", 1, 10, 1, 5);
    slide("oxygen", 1, 10, 1, 5);
    slide("kerosene", 1, 10, 1, 5);
    slide("emptyMass", 1, 3, 1, 2);
    slide("fuelMass", 1, 3, 1, 2);
    slide("planetSize", 1, 1000, 1, 1);
    
    $( "#planetCamera, #engineSelect" ).selectmenu({
        change:inputChange
    });
    $( "#planetSelect" ).selectmenu({
        change:inputChange
    });
    
    $( "#check" ).checkboxradio();

    
    $('input').change(inputChange);
    $('select').change(inputChange);


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
    if ($("#check").is(':checked') ) {
        globalInterfaceValues.planetAllSelected = true;
        $("#planetSelect").selectmenu("option", "disabled", true);
    } else {
        globalInterfaceValues.planetAllSelected = false;
        $("#planetSelect").selectmenu("option", "disabled", false);
    }
    //globalInterfaceValues.engine = $('select[name=engineSelect]').val();
    globalInterfaceValues.timeFactor = $("#timeFactorLabel").text();
    globalInterfaceValues.planetCamera = $('select[name=planetCamera]').val();
    //globalInterfaceValues.reset = $('input[name=reset]').val();
    globalInterfaceValues.changed = true;
    console.log("ja");
    console.log(globalInterfaceValues.timeFactor);
    console.log(globalInterfaceValues.planetCamera);
    console.log(globalInterfaceValues.planetSize);
    console.log(globalInterfaceValues.planetName);

    //console.log("selected" + globalInterfaceValues.planetAllSelected);

    //console.log(typeof(globalInterfaceValues.engine));
    //console.log(globalInterfaceValues.planetCamera);
}

function slide(name, min, max, step, val) {
     $("#"+name).slider({
        min: min,
        max: max,
        step: step,
        slide: function(event, ui) {
            $("#"+name+"Label").text(ui.value);
        },
        change: inputChange
    });
}

//function calculatTotalMass