var rockets = loadRocketData("data/rockets.json");
var rocket = rockets.saturn5;
var customRocketUsage = false;
var saturnV = {
    fuel_total: rocket.stage1.mass_fuel + rocket.stage2.mass_fuel + rocket.stage3.mass_fuel,
    stage1: {
        mass_empty: rocket.stage1.mass_empty,
        mass_fuel: rocket.stage1.mass_fuel,
        burningtime: rocket.stage1.burningtime,
        thrust: rocket.stage1.thrust
    },
    stage2: {
        mass_empty: rocket.stage2.mass_empty,
        mass_fuel: rocket.stage2.mass_fuel,
        burningtime: rocket.stage2.burningtime,
        thrust: rocket.stage2.thrust
    },
    stage3: {
        mass_empty: rocket.stage3.mass_empty,
        mass_fuel: rocket.stage3.mass_fuel,
        burningtime: rocket.stage3.burningtime,
        thrust: rocket.stage3.thrust
    },
    height: rocket.height,
    mass_total: rocket.mass_total,
    thrust_launch: rocket.thrust_launch
};

/*function loadRocket(){
if(!customRocketUsage){
var rockets = loadRocketData("data/rockets.json");
var rocket = rockets.saturn5;
}*/
//custom Rocket creation

if(customRocketUsage){
var customRocket={};

for(s in globalInterfaceValues.customRocket.stages){
    var stage = "stage"+s;
    customRocket.stages[s].mass_empty = globalInterfaceValues.customRocket[stage].mass_empty;
    customRocket.stages[s].mass_fuel = globalInterfaceValues.customRocket[stage].mass_fuel;
    customRocket.stages[s].burningtime = globalInterfaceValues.customRocket[stage].burningtime;
    customRocket.stages[s].thrust = globalInterfaceValues.customRocket[stage].thrust;
}
//customRocket.height = globalInterfaceValues.fuel_total;
customRocket.fuel_total = globalInterfaceValues.customRocket.fuel_total;
customRocket.mass_total = globalInterfaceValues.customRocket.mass_total;
customRocket.thrust_launch = 9.81 * customRocket.mass_total;
}

//custom rocket structure:


