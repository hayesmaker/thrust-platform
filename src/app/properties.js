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
  collideWorldBounds: true,
  enableJoypad: false,
  fatalCollisions: true,
  drawBackground: true,
  width: 800,
  height: 500,
  scale: {
    bestFit: true,
    web: Phaser.ScaleManager.NO_SCALE,
    device: Phaser.ScaleManager.NO_SCALE
  },
  dev: {
    debugPhysics: false,
    debugPositions: false,
    stats: true,
    mode: false,
    skipIntro: false,
    skipSplashScreen: false
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
    startLevel: 1,
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
        mapDataKey: 'level-1',
        mapScale: 2,
        world: {
          width: 1536,
          height: 1000
        },
        mapPosition: {
          x: 0,
          y: 150
        },
        startPosition: {
          x: 0,
          y: -50
        },
        orbPosition: {x: 915, y: 852},
        orbHolder: {
          x: 915,
          y: 890
        },
        enemies: [
          {
            x: 705,
            y: 869,
            rotation: 30
          }
        ],
        fuels: [
          {
            x: 550,
            y: 816
          }
        ],
        enemyFireRate: 400,
        powerStation: {
          x: 1100,
          y: 800
        }
      },
      {
        missionSwipe: {
          title: 'Mission 2',
          desc: 'Recover the orb',
          color: "rgba(62, 217, 42, 0.7)"
        },
        mapImgUrl: 'assets/levels/level-2.png',
        mapImgKey: 'level-2',
        mapDataUrl: 'assets/levels/level-2.json',
        mapDataKey: 'level-2',
        mapScale: 2,
        world: {width: 1536, height: 2000},
        mapPosition: {x: 0, y: 600},
        startPosition: {x: 0, y: 0},
        powerStation: {
          x: 600,
          y: 825
        },
        orbPosition: {x: 730, y: 1700},
        orbHolder: {
          x: 730,
          y: 1738
        },
        enemies: [
          {
            x: 675,
            y: 1405,
            rotation: 152
          },
          {
            x: 1055,
            y: 1310,
            rotation: 207
          }
        ],
        fuels: [
          {
            x: 820,
            y: 1735
          }
        ],
        enemyFireRate: 500
      },
      {
        missionSwipe: {
          title: 'Mission 3',
          desc: 'Recover the orb',
          color: "rgba(29, 192, 222, 0.7)"
        },
        mapImgUrl: 'assets/levels/level-3.png',
        mapImgKey: 'level-3',
        mapDataUrl: 'assets/levels/level-3.json',
        mapDataKey: 'level-3',
        mapScale: 2,
        world: {width: 1920, height: 3000},
        mapPosition: {x: 0, y: 600},
        startPosition: {x: 250, y: 0},
        powerStation: {
          x: 1440,
          y: 700
        },
        orbPosition: {x: 408, y: 2220},
        orbHolder: {
          x: 408,
          y: 2255
        },
        enemies: [
          {
            x: 1030,
            y: 1200,
            rotation: 155
          },
          {
            x: 1635,
            y: 1255,
            rotation: 327
          },
          {
            x: 550,
            y: 1488,
            rotation: 150
          },
          {
            x: 357,
            y: 1678,
            rotation: 152
          },
          {
            x: 600,
            y: 1840,
            rotation: 327
          }
        ],
        fuels: [
          {
            x: 912,
            y: 569
          },
          {
            x: 1370,
            y: 1265
          },
          {
            x: 1440,
            y: 1265
          },
          {
            x: 1510,
            y: 1265
          },
          {
            x: 1080,
            y: 1602
          },
          {
            x: 745,
            y: 1791
          }
        ],
        enemyFireRate: 600
      },
      {
        missionSwipe: {
          title: 'Mission 4',
          desc: 'Recover the orb',
          color: "rgba(148, 24, 206, 0.7)"
        },
        mapImgUrl: 'assets/levels/level-4.png',
        mapImgKey: 'level-4',
        mapDataUrl: 'assets/levels/level-4.json',
        mapDataKey: 'level-4',
        mapScale: 2,
        world: {width: 1726, height: 3000},
        mapPosition: {x: 0, y: 1000},
        startPosition: {x: 250, y: 200},
        powerStation: {
          x: 326,
          y: 1612
        },
        orbPosition: {x: 984, y: 2553},
        orbHolder: {
          x: 984,
          y: 2593
        },
        enemies: [
          {
            x: 495,
            y: 1138,
            rotation: 152
          },
          {
            x: 357,
            y: 1310,
            rotation: 28
          },
          {
            x: 330,
            y: 1425,
            rotation: 152
          },
          {
            x: 700,
            y: 1472,
            rotation: 205
          },
          {
            x: 595,
            y: 1695,
            rotation: 28
          },
          {
            x: 1375,
            y: 2420,
            rotation: 332
          },
          {
            x: 910,
            y: 2238,
            rotation: 152
          }
        ],
        fuels: [
          {
            x: 1170,
            y: 1850
          }
        ],
        enemyFireRate: 700
      },
      {
        missionSwipe: {
          title: 'Mission 5',
          desc: 'Recover the orb',
          color: "rgba(156, 77, 0, 0.7)"
        },
        mapImgUrl: 'assets/levels/level-5.png',
        mapImgKey: 'level-5',
        mapDataUrl: 'assets/levels/level-5.json',
        mapDataKey: 'level-5',
        mapScale: 2,
        world: {width: 1920, height: 2810},
        mapPosition: {x: 0, y: 1185},
        startPosition: {x: 250, y: 0},
        orbPosition: {x: 1560, y: 2400},
        powerStation: {
          x: 1290,
          y: 1140
        },
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
        enemyFireRate: 800
      },
      {
        missionSwipe: {
          title: 'Mission 6',
          desc: 'You know what you\'re doing by now',
          color: "rgba(246, 0, 255, 0.7)"
        },
        mapImgUrl: 'assets/levels/level-6.png',
        mapImgKey: 'level-6',
        mapDataUrl: 'assets/levels/level-6.json',
        mapDataKey: 'level-6',
        mapScale: 2,
        world: {width: 2306, height: 2700},
        mapPosition: {x: 0, y: 960},
        startPosition: {x: 0, y: 0},
        powerStation: {
          x: 1870,
          y: 2474
        },
        orbPosition: {x: 1755, y: 2345},
        orbHolder: {
          x: 1755,
          y: 2384
        },
        enemies: [
          {
            x: 1032,
            y: 900,
            rotation: 208
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
            y: 1500,
            rotation: 332
          },
          {
            x: 1105,
            y: 1741,
            rotation: 210
          },
          {
            x: 1133,
            y: 1856,
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
            x: 1702,
            y: 2169,
            rotation: 153
          },
          {
            x: 1848,
            y: 2289,
            rotation: 332
          },
          {
            x: 1990,
            y: 2219,
            rotation: 332
          }
        ],
        enemyFireRate: 1200
      }
    ]

  }
};
