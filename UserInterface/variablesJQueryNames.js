$(function(){

    $('input').change(inputChange);
    inputChange();
    
}); 

function inputChange(){
    
    var throttle = + $('input[name=throttleRange]').val();
    var oxigen = + $('input[name=oxigenRange]').val();
    var kerosene = + $('input[name=keroseneRange]').val();
    var step = + $('input[name=stepRange]').val();
    var emptyMass = + $('input[name=emptyMassRange]').val();
    var fuelMass = + $('input[name=fuelMassRange]').val();
    var totalMass = emptyMass + fuelMass;
    $("#totalMass").text(totalMass);
    var engine = + $('input[name=engineRange]').val();
}

// Speichern in anderer Seite bsp. universe.input 