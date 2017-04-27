$(function() {
    //var valMap = [0.1, 0.2, 0.5, 1, 10, 100, 1000, 10000, 100000];

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

    // Sliders
    slide("throttle", 1, 10, 1, 5);
    slide("oxygen", 1, 10, 1, 5);
    slide("kerosene", 1, 10, 1, 5);
    slide("emptyMass", 1, 3, 1, 2);
    slide("fuelMass", 1, 3, 1, 2);
    slide("planetSize", 1, 1000, 1, 1);
    slide("stages", 1, 3, 1, 2);

    // Selects
    $("#planetCamera, #engineSelect, #planetSelect, #rocketSelect").selectmenu({
        change: inputChange
    });

    // Labels
    $("#speedLabel").text(globalInterfaceValues.speed);
    $("#fuelLabel").text(globalInterfaceValues.speed);

    // Gauges
    $('#speed .gauge-arrow').cmGauge();
    $('#fuel .gauge-arrow').cmGauge();

    $('#speed .gauge-arrow').trigger('updateGauge', globalInterfaceValues.speed);
    $('#fuel .gauge-arrow').trigger('updateGauge', globalInterfaceValues.fuel);

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