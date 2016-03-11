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
    skipIntro: true,
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
    startLevel: 3,
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
        enemyFireRate: 500,
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
        enemyFireRate: 1000,
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
        enemyFireRate: 1000,
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
        orbPosition: {x: 730, y: 1620},
        orbHolder: {
          x: 730,
          y: 1650
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
            x: 1170,
            y: 1311
          }
        ],
        powerStation: {
          x: 1100,
          y: 1040
        },
        enemyFireRate: 1000
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
        orbPosition: {x: 730, y: 1620},
        orbHolder: {
          x: 730,
          y: 1650
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
            y: 1860
          },
          {
            x: 1050,
            y: 2000
          },
          {
            x: 1200,
            y: 2005
          },
          {
            x: 1200,
            y: 2005
          },
          {
            x: 1200,
            y: 2005
          }
        ],
        powerStation: {
          x: 1100,
          y: 1040
        },
        enemyFireRate: 1000
      },

      {
        missionSwipe: {
          title: 'Mission 6',
          desc: 'Recover the orb',
          color: "rgba(255, 0, 0, 0.7)"
        },
        mapImgUrl: 'assets/levels/level_6_x2.png',
        mapImgKey: 'thrustmapImage',
        mapDataUrl: 'assets/levels/level_6.json',
        mapDataKey: 'thrustmap',
        world: {width: 3072, height: 4000},
        mapPosition: {x: 0, y: 500},
        startPosition: {x: 0, y: 0},
        orbPosition: {x: 1000, y: 1000},
        orbHolder: {
          x: 1000,
          y: 1030
        },
        enemyFireRate: 1000,
        powerStation: {
          x: 1100,
          y: 1040
        }
      }
    ]

  }
};
