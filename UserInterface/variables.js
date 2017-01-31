var globalInterfaceValues = {
    throttle: 0,
    oxigen: 0,
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
    $("#slider").slider({
        // min: 0,
        max: valMap.length - 1,
        slide: function(event, ui) {
            $("#val").text(ui.value);
            $("#timeFactor").text(valMap[ui.value]);
        },
        change: inputChange
    });
    $('input').change(inputChange);
    $('select').change(inputChange);


    //checkRessources();
    //calculateTotalMass();
    //inputChange();

});

function inputChange() {

    // "+" means parseInt   
    globalInterfaceValues.throttle = +$('input[name=throttleRange]').val();
    globalInterfaceValues.oxigen = +$('input[name=oxigenRange]').val();
    globalInterfaceValues.step = +$('input[name=stepRange]').val();
    globalInterfaceValues.emptyMass = +$('input[name=emptyMassRange]').val();
    globalInterfaceValues.fuelMass = +$('input[name=fuelMassRange]').val();
    globalInterfaceValues.totalMass = globalInterfaceValues.emptyMass + globalInterfaceValues.fuelMass;
    $("#totalMass").text(globalInterfaceValues.totalMass);
    globalInterfaceValues.planetSize = +$('input[name=planetSizeRange]').val();
    globalInterfaceValues.planetName = $('select[name=planetSelect]').val();
    //console.log("ist sie gecheckt?" + $("#check").prop("checked"))
    if ($("#check").prop("checked")) {
        globalInterfaceValues.planetAllSelected = true;
        $('select[name=planetSelect]').prop("disabled", true);
    } else {
        globalInterfaceValues.planetAllSelected = false;
        $('select[name=planetSelect]').prop("disabled", false);
    }
    globalInterfaceValues.planetSelectAll = $('input[name=planetSizeRange]').val();
    globalInterfaceValues.engine = $('select[name=engineRange]').val();
    globalInterfaceValues.timeFactor = $("#timeFactor").val();
    globalInterfaceValues.planetCamera = $('select[name=planetCamera]').val();
    globalInterfaceValues.reset = $('input[name=reset]').val();
    globalInterfaceValues.changed = true;
    console.log("ja");
    console.log(valMap[ui.value]);

    //console.log("selected" + globalInterfaceValues.planetAllSelected);

    //console.log(typeof(globalInterfaceValues.engine));
    //console.log(globalInterfaceValues.planetCamera);
}

function slide() {}

//function calculatTotalMass