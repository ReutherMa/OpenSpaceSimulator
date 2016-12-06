var globalInterfaceValues = {throttle:0, oxigen:0, kerosene:0, step:1, emptyMass:0, fuelMass:0, totalMass:0, planetSize:1, engine:"Engine1"};

$(function(){

    $('input').change(inputChange);
    inputChange();
    
}); 

function inputChange(){
    
    globalInterfaceValues.throttle = + $('input[name=throttleRange]').val();
    var oxigen = + $('input[name=oxigenRange]').val();
    var kerosene = + $('input[name=keroseneRange]').val();
    var step = + $('input[name=stepRange]').val();
    var emptyMass = + $('input[name=emptyMassRange]').val();
    var fuelMass = + $('input[name=fuelMassRange]').val();
    var totalMass = emptyMass + fuelMass;
    $("#totalMass").text(totalMass);
    var planetSize = + $('input[name=planetSizeRange]').val;
    globalInterfaceValues.engine = + $('input[name=engineRange]').val();
    console.log(typeof(globalInterfaceValues.engine));
}
