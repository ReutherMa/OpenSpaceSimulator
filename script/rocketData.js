var rockets = loadRocketData("data/rockets.json");
var rocket = rockets.saturn5;
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
}
//custom Rocket creation
/*
if(customRocketUsage){
var customRocket={};
customRocket.fuel_total = ...;
for(s in stages){
    stages[s].mass_empty = ...;
    stages[s]mass_fuel = ...;
    stages[s]burningtime = ...;
    stages[s]thrust = ...;
}
customRocket.height = ...;
customRocket.mass_total = ...;
customRocket.thrust_launch = ...;
}

}*/