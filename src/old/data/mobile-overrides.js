module.exports = {

  data: [
    {
      "missionSwipe": {
        "title": "Mission %n mobile",
        "desc": "Recover the orb %s1 %s2",
        "color": "rgba(255, 255, 0, 0.7)"
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
        "spawns:": [
          {
            "x": 300,
            "y": 300,
            "orb": false
          }
        ],
        "scale": 0.5
      },
      "spawns": [
        {
          "x": 300,
          "y": 300,
          "orb": false
        }
      ],
      "orbPosition": {
        "x": 478,
        "y": 560
      },
      "orbHolder": {
        "x": 478,
        "y": 580
      },
      "enemies": [
        {
          "x": 353,
          "y": 570,
          "rotation": 30
        }
      ],
      "fuels": [
        {
          "x": 263,
          "y": 542
        }
      ],
      "powerStation": {
        "x": 550,
        "y": 535,
        "scale": 0.5
      }
    }
  ]

};