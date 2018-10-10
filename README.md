# thrust-platform
![Build Status](https://travis-ci.org/hayesmaker/thrust-platform.svg?branch=master)
(https://travis-ci.org/hayesmaker/thrust-platform)
![Phase-2-e](https://img.shields.io/badge/e2e-phase--2--e-green.svg)
(https://github.com/hayesmaker/phase-2-e)

Game engine for creating thrust-a-likes...  Physics blasters which require brains.

http://thrust-platform.herokuapp.com/

Inspired and heavily copied from BBC Micro and Commodore 64 game "Thrust" by Jeremy Smith.  
https://en.wikipedia.org/wiki/Thrust_(video_game).

### Assets
Currently the Assets are protected, and not shared here, I will be deploying
assets for a single Thrust level only to demonstrate a game using the platform.

### Builds
Currently builds of Thrust 30 are tightly coupled here in the platform repo.
I'm planning to make the platform completely seperate from Thrust 30, so that
it can more easily be used as intended.
- To build Thrust 30 v2.0.0-pre-alpha (re-write which removes Phaserjs): `npm run build`
- To build Thrust 30 v1 (current production version): `npm run build:old`

### Features
- `Browserstack` Have been kind enough to support this open source project. https://www.browserstack.com/
- `Nightwatch` Really simple Selenium based End to end tests http://nightwatchjs.org/
- `Phase-2-e` Plugin for Nightwatch to support end to end testing canvas based HTML5 https://www.npmjs.com/package/phase-2-e
- `Phaser` Opensource HTML5 game framework for Canvas & WebGL http://phaser.io/
- `Mocha` Unit Testing https://mochajs.org/ with `sinon`, `chai` and `sinon-chai` bdd style unit testing
- `Yuidocs` Source code documentation
- `Node` Backend: Node, Express, Jade
- `Mobile Friendly` Touch control interface for touch enabled displays
- `Asset Pipeline` Using `TexturePacker` and `PhysicsEditor`

## Prerequisistes
- `node` & `npm`

## Install
- `npm install`

## Build
- `npm run build`

## Tests
- `npm test`

## Run
- `npm start`
- Load the launcher: http://localhost:4000

## Changelog
- See [CHANGELOG](CHANGELOG.md)

<iframe frameborder="0" src="https://itch.io/embed/107837?border_width=5&amp;bg_color=000000&amp;fg_color=e28fef&amp;link_color=34b2ac&amp;border_color=ed45ce" width="560" height="175"></iframe>

## Licence
- See [LICENCE](LICENCE.md)