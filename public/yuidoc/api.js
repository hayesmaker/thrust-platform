YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Background",
        "Collisions",
        "FiringStrategy",
        "ForwardsFire",
        "Groups",
        "StatsModule",
        "UserControl",
        "actors.LimpetGun",
        "actors.Map",
        "actors.Orb",
        "actors.Player",
        "actors.TractorBeam",
        "actors.Turret",
        "beamFilter",
        "lives",
        "score",
        "states.boot",
        "states.fuel",
        "states.play",
        "thrust-engine."
    ],
    "modules": [
        "Actors",
        "boot",
        "filters",
        "fuel",
        "level-manager",
        "lives",
        "load",
        "main",
        "menu",
        "mission-swipe",
        "play",
        "properties",
        "socre",
        "states",
        "ui"
    ],
    "allModules": [
        {
            "displayName": "Actors",
            "name": "Actors",
            "description": "LimpetGun\n\nThe enemy of the game are stationary gun turrets which\nfire at random angles (Spread strategy) and at a rate which should increase with difficulty"
        },
        {
            "displayName": "boot",
            "name": "boot",
            "description": "The boot state"
        },
        {
            "displayName": "filters",
            "name": "filters"
        },
        {
            "displayName": "fuel",
            "name": "fuel",
            "description": "Manages the fuel display"
        },
        {
            "displayName": "level-manager",
            "name": "level-manager",
            "description": "Want to know what time it is? you came to wrong place... Want to know what level it is?\nThis is what you want! :)"
        },
        {
            "displayName": "lives",
            "name": "lives",
            "description": "Manages the lives display"
        },
        {
            "displayName": "load",
            "name": "load",
            "description": "The load state"
        },
        {
            "displayName": "main",
            "name": "main",
            "description": "Main game entry point\n* called on window.onload to make sure fonts registered to html page are loaded first.\n* initilise the Phaser.Game and register game states\n* start state: boot."
        },
        {
            "displayName": "menu",
            "name": "menu",
            "description": "The menu state"
        },
        {
            "displayName": "mission-swipe",
            "name": "mission-swipe"
        },
        {
            "displayName": "play",
            "name": "play",
            "description": "The play state"
        },
        {
            "displayName": "properties",
            "name": "properties",
            "description": "Defines build settings for the thrust-engine"
        },
        {
            "displayName": "socre",
            "name": "socre",
            "description": "Manages the score display"
        },
        {
            "displayName": "states",
            "name": "states"
        },
        {
            "displayName": "ui",
            "name": "ui"
        }
    ],
    "elements": []
} };
});