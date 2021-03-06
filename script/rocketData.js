/* 
This program is licensed under the GNU General Public License as described in the file „LICENSE“
Copyright (C) 2017 TH Nürnberg
Authors: Marius Reuther Franziska Braun, Lea Uhlenbrock, Selina Forster, Theresa Breitenhuber, Marco Lingenhöl
Contact: openspacesimulation@gmail.com
*/



var rockets = loadRocketData("data/rockets.json");
var rocketJSON = rockets.saturn5;
var customRocketUsage = false;
var saturnV = {};
//from saturnV:
var emptyWeightToThrustRatio = 0.006;

//in m/s: data from saturnV
var specificImpulse = 3000;

var gravity = 9.81;

initializeRocket();

function initializeRocket() {
    saturnV = {
        fuel_total: rocketJSON.stage1.mass_fuel + rocketJSON.stage2.mass_fuel + rocketJSON.stage3.mass_fuel,
        stage1: {
            mass_empty: rocketJSON.stage1.mass_empty,
            mass_fuel: rocketJSON.stage1.mass_fuel,
            burningtime: rocketJSON.stage1.burningtime,
            thrust: rocketJSON.stage1.thrust
        },
        stage2: {
            mass_empty: rocketJSON.stage2.mass_empty,
            mass_fuel: rocketJSON.stage2.mass_fuel,
            burningtime: rocketJSON.stage2.burningtime,
            thrust: rocketJSON.stage2.thrust
        },
        stage3: {
            mass_empty: rocketJSON.stage3.mass_empty,
            mass_fuel: rocketJSON.stage3.mass_fuel,
            burningtime: rocketJSON.stage3.burningtime,
            thrust: rocketJSON.stage3.thrust
        },
        height: rocketJSON.height,
        mass_total: rocketJSON.mass_total,
        thrust_launch: rocketJSON.thrust_launch
    };
}

/*function loadRocket(){
if(!customRocketUsage){
var rockets = loadRocketData("data/rockets.json");
var rocket = rockets.saturn5;
}*/
//custom Rocket creation

/*if(customRocketUsage){
    
var customRocket={};

for(s in globalInterfaceValues.stages){
    var stage = "stage"+s;
    customRocket.stages[s].mass_empty = globalInterfaceValues.stages[s-1].mass_empty;
    customRocket.stages[s].mass_fuel = globalInterfaceValues.customRocket[stage].mass_fuel;
    customRocket.stages[s].burningtime = globalInterfaceValues.customRocket[stage].burningtime;
    customRocket.stages[s].thrust = globalInterfaceValues.customRocket[stage].thrust;
}
//customRocket.height = globalInterfaceValues.fuel_total;
customRocket.fuel_total = globalInterfaceValues.customRocket.fuel_total;
customRocket.mass_total = globalInterfaceValues.customRocket.mass_total;
customRocket.thrust_launch = 9.81 * customRocket.mass_total;
}*/

function fuelMassChanged(stage) {
    if (globalInterfaceValues.stages[stage - 1].thrust == 0) {
        globalInterfaceValues.stages[stage - 1].burningtime = 0;
    } else {
        globalInterfaceValues.stages[stage - 1].burningtime = parseInt((globalInterfaceValues.stages[stage - 1].mass_empty + globalInterfaceValues.stages[stage - 1].mass_fuel) / (globalInterfaceValues.stages[stage - 1].thrust / (specificImpulse * gravity)));
    }
    //customRocket.thrust_launch = globalInterfaceValues.customRocket.mass_total * gravity;
}

/*function burningtimeChanged(stage) {
    globalInterfaceValues.stages[stage].mass_fuel = globalInterfaceValues.stages[stage].burningtime * ( globalInterfaceValues.stages[stage].thrust / ( specificImpulse * gravity ) ) - globalInterfaceValues.stages[stage].mass_empty;
    
    for(s in globalInterfaceValues.stages){
        var stage = "stage"+s;
        globalInterfaceValues.customRocket.fuel_total += globalInterfaceValues.stages[stage].mass_fuel;
        globalInterfaceValues.customRocket.mass_total += globalInterfaceValues.stages[stage].mass_fuel + globalInterfaceValues.stages[stage].mass_empty;
    }
    customRocket.thrust_launch = globalInterfaceValues.customRocket.mass_total * gravity;
}*/

function emptyMassChanged(stage) {

    globalInterfaceValues.stages[stage - 1].burningtime = parseInt((globalInterfaceValues.stages[stage - 1].mass_empty + globalInterfaceValues.stages[stage - 1].mass_fuel) / (globalInterfaceValues.stages[stage - 1].thrust / (specificImpulse * gravity)));

    var thrust = parseInt(( globalInterfaceValues.stages[stage - 1].mass_empty) / emptyWeightToThrustRatio);
    if(thrust < globalInterfaceValues.stages[stage - 1].thrust){
        globalInterfaceValues.stages[stage - 1].thrust = thrust;
    }
}

function thrustChanged(stage) {
    if (globalInterfaceValues.stages[stage - 1].thrust == 0) {
        globalInterfaceValues.stages[stage - 1].mass_empty = 0;
        globalInterfaceValues.stages[stage - 1].burningtime = 0;
    } else {
        globalInterfaceValues.stages[stage - 1].mass_empty = parseInt(globalInterfaceValues.stages[stage - 1].thrust * emptyWeightToThrustRatio);

        globalInterfaceValues.stages[stage - 1].burningtime = parseInt((globalInterfaceValues.stages[stage - 1].mass_empty + globalInterfaceValues.stages[stage - 1].mass_fuel) / (globalInterfaceValues.stages[stage - 1].thrust / (specificImpulse * gravity)));
    }

    /*customRocket.thrust_launch = globalInterfaceValues.customRocket.mass_total * gravity;*/
}

/*Formulas:

F: thrust
t: burning time (burn time)
me: empty mass
mf: fuel mass
m: total mass of this stage
mt: total mass of rocket
g: gravitational acceleration of earth (9,81m/s)
ft: total fuel mass
Flaunch: thrust needed for the rocket to take off
Isp: specific Impulse of saturn V

F = m / t * Isp * g
t = m / ( F / ( Isp * g ) )
me = m - mf = F * 0.006
mf = m - me 
m = F / g (minimum needed fuel mass)
mt = m1 + m2 + m3 +...
ft = mf1 + mf2 +...
Flaunch = g * mt

*/

/*globalInterfaceValues.customRocket[stage].mass_empty = globalInterfaceValues.customRocket[stage].thrust * emptyWeightToThrustRatio;

globalInterfaceValues.customRocket[stage].mass_fuel = globalInterfaceValues.customRocket[stage].thrust / gravity - globalInterfaceValues.customRocket[stage].mass_empty;

globalInterfaceValues.customRocket[stage].burningtime = ( globalInterfaceValues.customRocket[stage].mass_empty + globalInterfaceValues.customRocket[stage].mass_fuel ) / ( globalInterfaceValues.customRocket[stage].thrust / ( specificImpulse * gravity ) );

globalInterfaceValues.customRocket[stage].thrust = ( globalInterfaceValues.customRocket[stage].mass_fuel + globalInterfaceValues.customRocket[stage].mass_empty ) / globalInterfaceValues.customRocket[stage].burningtime * specificImpulse * gravity;
*/