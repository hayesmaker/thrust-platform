module.exports = {
  "actorsScale": 0.5,
  "hiscoreLayout": {
    "margin": 0,
    "padding": 0.05
  },
  "training": {
    "mapImgUrl": "assets/levels/training.png",
    "mapImgKey": "training",
    "mapDataUrl": "assets/physics/training.json",
    "mapDataKey": "training",
    "mapScale": 1,
    "useAtlas": false,
    "mapPosition": {
      "x": 0,
      "y": 850
    },
    "missionSwipe": {
      "title": "Flight Training",
      "desc": "Welcome to flight training pilot",
      "color": "rgba(124, 255, 0, 0.7)"
    },
    "world": {
      "width": 1500,
      "height": 1500
    },
    "player": {
      "scale": 0.5,
      "spawns": [{
        "x": 750,
        "y": 750,
        "orb": false
      }]
    },
    "orb": {
      "scale": 0.5,
      "x": 1300,
      "y": 866
    },
    "orbHolder": {
      "scale": 0.5,
      "x": 1300,
      "y": 885
    }
  },
  "data": [
    {
      "missionSwipe": {
        "title": "Mission %n",
        "desc": "Recover the orb %s1 %s2",
        "color": "rgba(255, 0, 0, 0.7)"
      },
      "mapScale": 1,
      "world": {
        "width": 768,
        "height": 700
      },
      "mapPosition": {
        "x": 0,
        "y": 500
      },
      "player": {
        "spawns": [
          {
            "x": 300,
            "y": 300,
            "orb": false
          }
        ],
        "scale": 0.5
      },
      "orb": {
        "scale": 0.5,
        "x": 478,
        "y": 560
      },
      "orbHolder": {
        "scale": 0.5,
        "x": 478,
        "y": 580
      },
      "enemies": [
        {
          "scale": 0.5,
          "x": 353,
          "y": 570,
          "rotation": 30
        }
      ],
      "fuels": [
        {
          "scale": 0.5,
          "x": 263,
          "y": 542
        }
      ],
      "powerStation": {
        "x": 550,
        "y": 535,
        "scale": 0.5
      }
    },
    {
      "enemyFireRate": 100,
      "useAtlas": true,
      "missionSwipe": {
        "title": "Mission %n",
        "desc": "Recover the orb %s1 %s2",
        "color": "rgba(62, 217, 42, 0.7)"
      },
      "atlasData": {
        "levelKey": "level-2",
        "imageKey": "levels-atlas"
      },
      "mapDataUrl": "assets/physics/level-2.json",
      "mapDataKey": "level-2",
      "mapScale": 1,
      "world": {
        "width": 768,
        "height": 1000
      },
      "mapPosition": {
        "x": 0,
        "y": 370
      },
      "player": {
        "scale": 0.5,
        "spawns": [
          {
            "x": 300,
            "y": 225,
            "orb": false
          }
        ]
      },
      "powerStation": {
        "scale": 0.5,
        "x": 300,
        "y": 412
      },
      "orb": {
        "scale": 0.5,
        "x": 360,
        "y": 850
      },
      "orbHolder": {
        "scale": 0.5,
        "x": 360,
        "y": 869
      },
      "enemies": [
        {
          "scale": 0.5,
          "x": 338,
          "y": 703,
          "rotation": 152
        },
        {
          "scale": 0.5,
          "x": 522,
          "y": 655,
          "rotation": 207
        }
      ],
      "fuels": [
        {
          "scale": 0.5,
          "x": 415,
          "y": 868
        }
      ]
    },
    {
      "enemyFireRate": 150,
      "useAtlas": true,
      "missionSwipe": {
        "title": "Mission %n",
        "desc": "Recover the orb %s1 %s2",
        "color": "rgba(29, 192, 222, 0.7)"
      },
      "atlasData": {
        "levelKey": "level-3",
        "imageKey": "levels-atlas"
      },
      "mapDataUrl": "assets/physics/level-3.json",
      "mapDataKey": "level-3",
      "mapScale": 1,
      "world": {
        "width": 960,
        "height": 1600
      },
      "mapPosition": {
        "x": 0,
        "y": 395
      },
      "player": {
        "scale": 0.5,
        "spawns": [
          {
            "x": 388,
            "y": 330,
            "orb": false,
            "enemies": 0
          },
          {
            "x": 555,
            "y": 780,
            "orb": true,
            "enemies": 2
          },
          {
            "x": 208,
            "y": 1025,
            "orb": false,
            "enemies": 5
          }
        ]
      },
      "powerStation": {
        "scale": 0.5,
        "x": 720,
        "y": 475
      },
      "orb": {
        "scale": 0.5,
        "x": 204,
        "y": 1235
      },
      "orbHolder": {
        "scale": 0.5,
        "x": 204,
        "y": 1253
      },
      "enemies": [
        {
          "scale": 0.5,
          "x": 818,
          "y": 753,
          "rotation": 327
        },
        {
          "scale": 0.5,
          "x": 515,
          "y": 725,
          "rotation": 155
        },
        {
          "scale": 0.5,
          "x": 275,
          "y": 869,
          "rotation": 150
        },
        {
          "scale": 0.5,
          "x": 179,
          "y": 964,
          "rotation": 152
        },
        {
          "scale": 0.5,
          "x": 300,
          "y": 1045,
          "rotation": 327
        }
      ],
      "fuels": [
        {
          "scale": 0.5,
          "x": 456,
          "y": 410
        },
        {
          "scale": 0.5,
          "x": 685,
          "y": 758
        },
        {
          "scale": 0.5,
          "x": 720,
          "y": 758
        },
        {
          "scale": 0.5,
          "x": 755,
          "y": 758
        },
        {
          "scale": 0.5,
          "x": 540,
          "y": 926
        },
        {
          "scale": 0.5,
          "x": 745,
          "y": 2041
        }
      ]
    },
    {
      "enemyFireRate": 200,
      "useAtlas": true,
      "missionSwipe": {
        "title": "Mission %n",
        "desc": "Recover the orb %s1 %s2",
        "color": "rgba(148, 24, 206, 0.7)"
      },
      "atlasData": {
        "levelKey": "level-4",
        "imageKey": "levels-atlas"
      },
      "mapDataUrl": "assets/physics/level-4.json",
      "mapDataKey": "level-4",
      "gateImgKey": "level-4-gate",
      "gateImgUrl": "assets/levels/level-4-gate.png",
      "gateDataKey": "level-4-gate",
      "gateDataUrl": "assets/physics/level-4-gate.json",
      "mapScale": 1,
      "world": {
        "width": 864,
        "height": 1500
      },
      "mapPosition": {
        "x": 0,
        "y": 440
      },
      "gateTweenTo": {
        "x": 605,
        "y": 1000
      },
      "gatePosition": {
        "scale": 0.5,
        "x": 695,
        "y": 1000
      },
      "switches": [
        {
          "scale": 0.5,
          "x": 744,
          "y": 925,
          "rotation": 0
        },
        {
          "scale": 0.5,
          "x": 744,
          "y": 1075,
          "rotation": 0
        }
      ],
      "player": {
        "scale": 0.5,
        "spawns": [
          {
            "x": 350,
            "y": 350,
            "orb": false,
            "enemies": 0
          },
          {
            "x": 387,
            "y": 529,
            "orb": true,
            "enemies": 2
          },
          {
            "x": 665,
            "y": 850,
            "orb": false,
            "enemies": 7
          }
        ]
      },
      "powerStation": {
        "scale": 0.5,
        "x": 163,
        "y": 806
      },
      "orb": {
        "scale": 0.5,
        "x": 492,
        "y": 1277
      },
      "orbHolder": {
        "scale": 0.5,
        "x": 492,
        "y": 1297
      },
      "enemies": [
        {
          "scale": 0.5,
          "x": 248,
          "y": 569,
          "rotation": 152
        },
        {
          "scale": 0.5,
          "x": 179,
          "y": 655,
          "rotation": 28
        },
        {
          "scale": 0.5,
          "x": 165,
          "y": 713,
          "rotation": 152
        },
        {
          "scale": 0.5,
          "x": 350,
          "y": 736,
          "rotation": 205
        },
        {
          "scale": 0.5,
          "x": 298,
          "y": 848,
          "rotation": 28
        },
        {
          "scale": 0.5,
          "x": 688,
          "y": 1210,
          "rotation": 332
        },
        {
          "scale": 0.5,
          "x": 455,
          "y": 1119,
          "rotation": 152
        }
      ]
    },
    {
      "enemyFireRate": 225,
      "useAtlas": true,
      "missionSwipe": {
        "title": "Mission %n",
        "desc": "Recover the orb %s1 %s2",
        "color": "rgba(228, 215, 11, 0.7)"
      },
      "atlasData": {
        "levelKey": "level-5",
        "imageKey": "levels-atlas"
      },
      "mapDataUrl": "assets/physics/level-5.json",
      "mapDataKey": "level-5",
      "gateImgKey": "level-5-gate",
      "gateImgUrl": "assets/levels/level-5-gate.png",
      "gateDataKey": "level-5-gate",
      "gateDataUrl": "assets/physics/level-5-gate.json",
      "mapScale": 1,
      "world": {
        "width": 960,
        "height": 1405
      },
      "mapPosition": {
        "x": 0,
        "y": 348
      },
      "gateTweenTo": {
        "x": 653,
        "y": 1035
      },
      "gatePosition": {
        "scale": 0.5,
        "x": 735,
        "y": 1035
      },
      "switches": [
        {
          "scale": 0.5,
          "x": 779,
          "y": 969,
          "rotation": 0
        },
        {
          "scale": 0.5,
          "x": 552,
          "y": 1150,
          "rotation": 180
        }
      ],
      "player": {
        "scale": 0.5,
        "spawns": [
          {
            "x": 250,
            "y": 200,
            "orb": false,
            "enemies": 0
          },
          {
            "x": 735,
            "y": 664,
            "orb": true,
            "enemies": 3
          },
          {
            "x": 170,
            "y": 845,
            "orb": true,
            "enemies": 4
          },
          {
            "x": 603,
            "y": 903,
            "orb": false,
            "enemies": 9
          }
        ]
      },
      "orb": {
        "scale": 0.5,
        "x": 780,
        "y": 1200
      },
      "powerStation": {
        "scale": 0.5,
        "x": 645,
        "y": 570
      },
      "orbHolder": {
        "scale": 0.5,
        "x": 780,
        "y": 1219
      },
      "enemies": [
        {
          "scale": 1,
          "x": 1126,
          "y": 1020,
          "rotation": 152
        },
        {
          "scale": 0.5,
          "x": 744,
          "y": 488,
          "rotation": 207
        },
        {
          "scale": 0.5,
          "x": 815,
          "y": 690,
          "rotation": 208
        },
        {
          "scale": 0.5,
          "x": 178,
          "y": 973,
          "rotation": 28
        },
        {
          "scale": 0.5,
          "x": 615,
          "y": 848,
          "rotation": 210
        },
        {
          "scale": 0.5,
          "x": 694,
          "y": 894,
          "rotation": 210
        },
        {
          "scale": 0.5,
          "x": 573,
          "y": 983,
          "rotation": 28
        },
        {
          "scale": 0.5,
          "x": 803,
          "y": 1087,
          "rotation": 205
        },
        {
          "scale": 0.5,
          "x": 574,
          "y": 1189,
          "rotation": 28
        }
      ],
      "fuels": [
        {
          "scale": 0.5,
          "x": 575,
          "y": 401
        },
        {
          "scale": 0.5,
          "x": 551,
          "y": 568
        },
        {
          "scale": 0.5,
          "x": 587,
          "y": 568
        },
        {
          "scale": 0.5,
          "x": 612,
          "y": 761
        },
        {
          "scale": 0.5,
          "x": 485,
          "y": 929
        },
        {
          "scale": 0.5,
          "x": 520,
          "y": 929
        },
        {
          "scale": 0.5,
          "x": 635,
          "y": 989
        }
      ]
    },
    {
      "enemyFireRate": 250,
      "useAtlas": true,
      "missionSwipe": {
        "title": "Mission %n",
        "desc": "Recover the final orb %s1 %s2",
        "color": "rgba(246, 0, 255, 0.7)"
      },
      "atlasData": {
        "levelKey": "level-6",
        "imageKey": "combined"
      },
      "mapImgKey": "level-6-img",
      "mapImgUrl": "assets/levels/level-6.png",
      "mapDataUrl": "assets/physics/level-6.json",
      "mapDataKey": "level-6",
      "gateImgKey": "level-6-gate",
      "gateImgUrl": "assets/levels/level-6-gate.png",
      "gateDataKey": "level-6-gate",
      "gateDataUrl": "assets/physics/level-6-gate.json",
      "mapScale": 1,
      "world": {
        "width": 1152,
        "height": 1350
      },
      "mapPosition": {
        "x": 0,
        "y": 330
      },
      "gateTweenTo": {
        "x": 905,
        "y": 969
      },
      "gatePosition": {
        "scale": 0.5,
        "x": 998,
        "y": 969
      },
      "switches": [
        {
          "scale": 0.5,
          "x": 1044,
          "y": 903,
          "rotation": 0
        },
        {
          "scale": 0.5,
          "x": 877,
          "y": 1036,
          "rotation": 180
        }
      ],
      "player": {
        "scale": 0.5,
        "spawns": [
          {
            "x": 200,
            "y": 200,
            "orb": false,
            "enemies": 0
          },
          {
            "x": 510,
            "y": 641,
            "orb": true,
            "enemies": 4
          },
          {
            "x": 494,
            "y": 926,
            "orb": true,
            "enemies": 6
          },
          {
            "x": 391,
            "y": 1098,
            "orb": true,
            "enemies": 8
          },
          {
            "x": 958,
            "y": 1015,
            "orb": false,
            "enemies": 11
          }
        ]
      },
      "powerStation": {
        "scale": 0.5,
        "x": 935,
        "y": 1237
      },
      "orb": {
        "scale": 0.5,
        "x": 878,
        "y": 1173
      },
      "orbHolder": {
        "scale": 0.5,
        "x": 878,
        "y": 1192
      },
      "enemies": [
        {
          "scale": 0.5,
          "x": 516,
          "y": 450,
          "rotation": 208
        },
        {
          "scale": 0.5,
          "x": 478,
          "y": 604,
          "rotation": 150
        },
        {
          "scale": 0.5,
          "x": 698,
          "y": 653,
          "rotation": 210
        },
        {
          "scale": 0.5,
          "x": 540,
          "y": 750,
          "rotation": 332
        },
        {
          "scale": 0.5,
          "x": 553,
          "y": 871,
          "rotation": 210
        },
        {
          "scale": 0.5,
          "x": 567,
          "y": 928,
          "rotation": 332
        },
        {
          "scale": 0.5,
          "x": 323,
          "y": 1110,
          "rotation": 155
        },
        {
          "scale": 0.5,
          "x": 455,
          "y": 1106,
          "rotation": 210
        },
        {
          "scale": 0.5,
          "x": 851,
          "y": 1085,
          "rotation": 153
        },
        {
          "scale": 0.5,
          "x": 924,
          "y": 1145,
          "rotation": 332
        },
        {
          "scale": 0.5,
          "x": 995,
          "y": 1110,
          "rotation": 332
        }
      ]
    }
  ]
};