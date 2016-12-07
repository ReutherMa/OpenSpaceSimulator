var globalInterfaceValues = {throttle:0, oxigen:0, kerosene:0, step:1, emptyMass:0, fuelMass:0, totalMass:0, planetName:"earth", planetSize:1000, engine:"Engine1", timeFactor:0};

$(function(){

    $('input').change(inputChange);
    $('select').change(inputChange);
    inputChange();
    
}); 

function inputChange(){
    
    // "+" means parseInt   
    globalInterfaceValues.throttle = + $('input[name=throttleRange]').val();
    globalInterfaceValues.oxigen = + $('input[name=oxigenRange]').val();
    globalInterfaceValues.step = + $('input[name=stepRange]').val();
    globalInterfaceValues.emptyMass = + $('input[name=emptyMassRange]').val();
    globalInterfaceValues.fuelMass = + $('input[name=fuelMassRange]').val();
    globalInterfaceValues.totalMass = globalInterfaceValues.emptyMass + globalInterfaceValues.fuelMass;
    $("#totalMass").text(globalInterfaceValues.totalMass);
    globalInterfaceValues.planetSize = + $('input[name=planetSizeRange]').val();
    globalInterfaceValues.planetName = $('select[name=planetSelect]').val();
    globalInterfaceValues.engine = $('select[name=engineRange]').val();
    globalInterfaceValues.timeFactor = $('input[name=timeFactorRange]').val();
    globalInterfaceValues.planetCamera = $('select[name=planetCamera]').val();
    //console.log(typeof(globalInterfaceValues.engine));
    //console.log(globalInterfaceValues.planetCamera);
}
