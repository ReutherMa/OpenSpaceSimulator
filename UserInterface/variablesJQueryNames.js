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

{"saturn5":{
"stages":{
"stage1":{
"mass_empty":"31000",
"mass_fuel":"1869000",
"fuel_type":"kerosin",
"oxidizer":"oxygen",
"thrust":"34000000"},

"stage2":{
"mass_empty":"36000",
"mass_fuel":"444000",
"fuel_type":"hydrogen",
"oxidizer":"oxygen",
"thrust":"4900000"},

"stage3":{
"mass_empty":"10000",
"mass_fuel":"109000",
"fuel_type":"hydrogen",
"oxidizer":"oxygen",
},
},
"height":"111",
"diameter":"10",
"mass_total":"2800000",
"thrust_launch":"34500000",

"
}
}
 //kg, m, N
// Speichern in anderer Seite bsp. universe.input 
// Events für Range z.b. MouseMove
// console.log -> Ausgabe für EntwicklerModus F12
 //WASD: Steuerung, QE: Rollen, Space: Gas (Beschleunigungswerte), B: Bremse, Enter: Pause
 //Rakete über Z-Achse x und y Ebene
 //RotationsMatrix um Achsen Quaternionen (Wie viel Grad um welche Achse gedreht)
 //Bild Einfügen, Rakete abschießen, Rakete Steuern, Pause (SpeedLab, TimeLab)
 // Doppelt Belegen Anzeige und Tasten
 // Hover-Tooltips