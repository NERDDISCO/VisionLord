"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Animation = require("./Animation");

var _Animation2 = _interopRequireDefault(_Animation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Handle all animations and keep a reference to them.
 */
var AnimationManager = function () {
  function AnimationManager(param) {
    _classCallCheck(this, AnimationManager);

    // A list of animations
    this.list = new Map();

    // Handle devices
    this.deviceManager = param.deviceManager;

    this.config = param.config;
  }

  _createClass(AnimationManager, [{
    key: "register",
    value: function register() {
      var _this = this;

      this.config.animations.forEach(function (element, index, array) {

        var animation = new _Animation2.default({
          animationId: element.animationId,
          duration: element.duration,
          timeline: element.timeline,
          deviceManager: _this.deviceManager,
          devices: element.devices
        });

        _this.add(element.animationId, animation);
      });
    }
  }, {
    key: "add",
    value: function add(animationId, animation) {
      this.list.set(animationId, animation);
    }
  }, {
    key: "get",
    value: function get(animationId) {
      return this.list.get(animationId);
    }
  }]);

  return AnimationManager;
}();

exports.default = AnimationManager;