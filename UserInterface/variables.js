var globalInterfaceValues = {throttle:0, oxigen:0, kerosene:0, step:1, emptyMass:0, fuelMass:0, totalMass:0, planetName:"Earth", planetSize:1, engine:"Engine1", timeFactor:0};

$(function(){

    $('input').change(inputChange);
    inputChange();
    
}); 

function inputChange(){
    
 // "+" means parseInt   
    globalInterfaceValues.throttle = + $('input[name=throttleRange]').val();
    globalInterfaceValues.oxigen = + $('input[name=oxigenRange]').val();
    globalInterfaceValues.step = + $('input[name=stepRange]').val();
    globalInterfaceValues.emptyMass = + $('input[name=emptyMassRange]').val();
    globalInterfaceValues.fuelMass = + $('input[name=fuelMassRange]').val();
    globalInterfaceValues.totalMass = emptyMass + fuelMass;
    $("#totalMass").text(totalMass);
    globalInterfaceValues.planetSize = + $('input[name=planetSizeRange]').val;
    globalInterfaceValues.planetName = $('input[name=planetSelect]').val;
    globalInterfaceValues.engine = $('input[name=engineRange]').val();
    globalInterfaceValues.timeFactor = $('input[name=timeFactorRange]').val();
    console.log(typeof(globalInterfaceValues.engine));
}
