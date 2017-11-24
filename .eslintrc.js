module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "globals": {
    "global": false,
    "Container": false,
    "FPSMeter": false,
    "Sprite": false,
    "Graphics": false,
    "Rectangle": false,
    "TweenLite": false,
    "autoDetectRenderer": false,
    "loader": false
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "indent": [
      "error",
      2,
      {
        "SwitchCase": 1
      }
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ]
  }
};