/**
 * Defines build settings for the thrust-engine
 *
 * @namespace thrust-engine
 * @module properties
 * @class
 * @static
 * @type {Object}
 */
module.exports = {
  debugPhysics: false,
  debugPositions: false,
  collideWorldBounds: true,
  enableJoypad: false,
  fatalCollisions: true,
  stats: false,
  drawBackground: true,
  width: 800,
  height: 500,
  scale: {
    web: Phaser.ScaleManager.NO_SCALE,
    device: Phaser.ScaleManager.SHOW_ALL
  },
  dev: {
    mode: false,
    skipIntro: false,
    skipSplashScreen: true
  },
  gamePlay: {
    freeOrbLocking: false,
    autoOrbLocking: true,
    tractorBeamLength: 80,
    tractorBeamVariation: 10,
    lockingDuration: 900,
    parallax: true
  },
  mapSuffix: '-map',
  levels: {
    startLevel: 6,
    data: [
      {
        missionSwipe: {
          title: 'Mission 1',
          desc: 'Recover the orb',
          color: "rgba(255, 0, 0, 0.7)"
        },
        mapImgUrl: 'assets/levels/level-1.png',
        mapImgKey: 'level-1',
        mapDataUrl: 'assets/levels/level-1.json',
        mapDataKey: 'moo',
        mapScale: 2,
        world: {
          width: 1536,
          height: 1250
        },
        mapPosition: {
          x: 0,
          y: 140
        },
        startPosition: {
          x: 250,
          y: 650
        },
        orbPosition: {x: 915, y: 1100},
        orbHolder: {
          x: 915,
          y: 1130
        },
        enemies: [
          {
            x: 705,
            y: 1110,
            rotation: 30
          }
        ],
        fuels: [
          {
            x: 550,
            y: 1055
          }
        ],
        enemyFireRate: 400,
        powerStation: {
          x: 1100,
          y: 1040
        }
      },
      {
        missionSwipe: {
          title: 'Mission 2',
          desc: 'Recover the orb',
          color: "rgba(255, 0, 0, 0.7)"
        },
        mapImgUrl: 'assets/levels/level-2.png',
        mapImgKey: 'level-2',
        mapDataUrl: 'assets/levels/level-2.json',
        mapDataKey: 'level-2',
        mapScale: 2,
        world: {width: 1536, height: 1800},
        mapPosition: {x: 0, y: 400},
        startPosition: {x: 250, y: 0},
        orbPosition: {x: 730, y: 1595},
        orbHolder: {
          x: 730,
          y: 1625
        },
        enemies: [
          {
            x: 675,
            y: 1295,
            rotation: 152
          },
          {
            x: 1055,
            y: 1200,
            rotation: 207
          }
        ],
        fuels: [
          {
            x: 820,
            y: 1625
          }
        ],
        enemyFireRate: 500,
        powerStation: {
          x: 600,
            y: 715
        }
      },
      {
        missionSwipe: {
          title: 'Mission 3',
          desc: 'Recover the orb',
          color: "rgba(255, 0, 0, 0.7)"
        },
        mapImgUrl: 'assets/levels/level-3.png',
        mapImgKey: 'level-3',
        mapDataUrl: 'assets/levels/level-3.json',
        mapDataKey: 'level-3',
        mapScale: 2,
        world: {width: 1920, height: 3000},
        mapPosition: {x: 0, y: 500},
        startPosition: {x: 250, y: 0},
        orbPosition: {x: 408, y: 2480},
        orbHolder: {
          x: 408,
          y: 2515
        },
        enemies: [
          {
            x: 1030,
            y: 1460,
            rotation: 155
          },
          {
            x: 1635,
            y: 1515,
            rotation: 327
          },
          {
            x: 550,
            y: 1748,
            rotation: 150
          },
          {
            x: 357,
            y: 1938,
            rotation: 152
          },
          {
            x: 600,
            y: 2100,
            rotation: 327
          }
        ],
        fuels: [
          {
            x: 912,
            y: 827
          },
          {
            x: 1370,
            y: 1523
          },
          {
            x: 1440,
            y: 1523
          },
          {
            x: 1510,
            y: 1523
          },
          {
            x: 1080,
            y: 1860
          },
          {
            x: 745,
            y: 2050
          }
        ],
        enemyFireRate: 600,
        powerStation: {
          x: 1440,
          y: 960
        }
      },
      {
        missionSwipe: {
          title: 'Mission 4',
          desc: 'Recover the orb',
          color: "rgba(255, 0, 0, 0.7)"
        },
        mapImgUrl: 'assets/levels/level-4.png',
        mapImgKey: 'level-4',
        mapDataUrl: 'assets/levels/level-4.json',
        mapDataKey: 'level-4',
        mapScale: 2,
        world: {width: 1726, height: 2466},
        mapPosition: {x: 0, y: 600},
        startPosition: {x: 250, y: 0},
        orbPosition: {x: 984, y: 2015},
        orbHolder: {
          x: 984,
          y: 2053
        },
        enemies: [
          {
            x: 495,
            y: 600,
            rotation: 152
          },
          {
            x: 357,
            y: 770,
            rotation: 28
          },
          {
            x: 330,
            y: 885,
            rotation: 152
          },
          {
            x: 700,
            y: 934,
            rotation: 205
          },
          {
            x: 595,
            y: 1155,
            rotation: 28
          },
          {
            x: 1375,
            y: 1885,
            rotation: 330
          },
          {
            x: 910,
            y: 1700,
            rotation: 152
          }
        ],
        fuels: [
          {
            x: 1170,
            y: 1311
          }
        ],
        powerStation: {
          x: 326,
          y: 1072
        },
        enemyFireRate: 700
      },
      {
        missionSwipe: {
          title: 'Mission 5',
          desc: 'Recover the orb',
          color: "rgba(255, 0, 0, 0.7)"
        },
        mapImgUrl: 'assets/levels/level-5.png',
        mapImgKey: 'level-5',
        mapDataUrl: 'assets/levels/level-5.json',
        mapDataKey: 'level-5',
        mapScale: 2,
        world: {width: 1920, height: 2810},
        mapPosition: {x: 0, y: 600},
        startPosition: {x: 250, y: 0},
        orbPosition: {x: 1560, y: 2400},
        orbHolder: {
          x: 1560,
          y: 2438
        },
        enemies: [
          {
            x: 1126,
            y: 1020,
            rotation: 152
          },
          {
            x: 1487,
            y: 975,
            rotation: 207
          },
          {
            x: 1630,
            y: 1380,
            rotation: 208
          },
          {
            x: 355,
            y: 1945,
            rotation: 28
          },
          {
            x: 1230,
            y: 1695,
            rotation: 210
          },
          {
            x: 1388,
            y: 1788,
            rotation: 210
          },
          {
            x: 1146,
            y: 1966,
            rotation: 28
          },
          {
            x: 1148,
            y: 2378,
            rotation: 28
          },
          {
            x: 1606,
            y: 2174,
            rotation: 205
          }

        ],
        fuels: [
          {
            x: 1150,
            y: 802
          },
          {
            x: 1102,
            y: 1135
          },
          {
            x: 1174,
            y: 1135
          },
          {
            x: 1223,
            y: 1522
          },
          {
            x: 970,
            y: 1858
          },
          {
            x: 1040,
            y: 1858
          },
          {
            x: 1270,
            y: 1977
          }
        ],
        powerStation: {
          x: 1290,
          y: 1140
        },
        enemyFireRate: 800
      },
      {
        missionSwipe: {
          title: 'Mission 6',
          desc: 'Recover the orb',
          color: "rgba(255, 0, 0, 0.7)"
        },
        mapImgUrl: 'assets/levels/level-6.png',
        mapImgKey: 'level-6',
        mapDataUrl: 'assets/levels/level-6.json',
        mapDataKey: 'level-6',
        mapScale: 2,
        world: {width: 2306, height: 2500},
        mapPosition: {x: 0, y: 1000},
        startPosition: {x: 0, y: 0},
        orbPosition: {x: 1755, y: 2345},
        enemies: [
          {
            x: 1032,
            y: 900,
            rotation: 210
          },
          {
            x: 955,
            y: 1208,
            rotation: 150
          },
          {
            x: 1395,
            y: 1305,
            rotation: 210
          },
          {
            x: 1080,
            y: 1497,
            rotation: 332
          },
          {
            x: 1105,
            y: 1740,
            rotation: 210
          },
          {
            x: 1133,
            y: 1854,
            rotation: 332
          },
          {
            x: 645,
            y: 2219,
            rotation: 155
          },
          {
            x: 910,
            y: 2212,
            rotation: 210
          },
          {
            x: 1706,
            y: 2166,
            rotation: 152
          },
          {
            x: 1848,
            y: 2284,
            rotation: 332
          },
          {
            x: 2000,
            y: 2210,
            rotation: 332
          }
        ],
        orbHolder: {
          x: 1755,
          y: 2380
        },
        enemyFireRate: 1200,
        powerStation: {
          x: 1870,
          y: 2470
        }
      }
    ]

  }
};
