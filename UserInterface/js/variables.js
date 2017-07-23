/* 
This program is licensed under the GNU General Public License as described in the file „LICENSE“
Copyright (C) 2017 TH Nürnberg
Authors: Marius Reuther Franziska Braun, Lea Uhlenbrock, Selina Forster, Theresa Breitenhuber, Marco Lingenhöl
Contact: openspacesimulation@gmail.com
*/




var globalInterfaceValues = {
    // User Einstellungen

    // RocketInterface
    rocketName: "saturnV",
    stage: 3,
    stages: [{
        mass_empty: 0,
        mass_fuel: 0,
        mass_total: 0,
        thrust: 0,
        burningtime: 0
    }, {
        mass_empty: 0,
        mass_fuel: 0,
        mass_total: 0,
        thrust: 0,
        burningtime: 0
    }, {
        mass_empty: 0,
        mass_fuel: 0,
        mass_total: 0,
        thrust: 0,
        burningtime: 0
    }/*, {
        mass_empty: 0,
        mass_fuel: 0,
        mass_total: 0,
        thrust: 0,
        burningtime: 0
    }*/],
    currentStage: 1,
    height: 0,
    fuel_total: 0,
    rocketTotalMass: 0,
    customRocketUsage: false,
    fuelCheat: false,

    // DeveloperInterface
    planetName: "earth",
    planetSize: 1,
    planetAllSelected: false,
    planetCamera: "earth",
    timeFactor: 1,
    changed: true,

    // Anzeige

    // GameInteface
    throttle: 0,
    speed: 0,
    fuel: 0
};