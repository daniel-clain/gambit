"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var managerOptions_1 = require("../../../../models/game/managerOptions");
var TrainFighter = /** @class */ (function (_super) {
    __extends(TrainFighter, _super);
    function TrainFighter(fighters) {
        var _this = _super.call(this) || this;
        _this.fighters = fighters;
        _this.name = 'Train fighter';
        _this.cost = 20;
        return _this;
    }
    TrainFighter.prototype.effect = function (fighter) {
        var targetFighter = this.fighters.find(function (f) { return f.name == fighter.name; });
        var randomVal = Math.floor(Math.random() * 3);
        switch (randomVal) {
            case 0:
                {
                    targetFighter.maxStamina++;
                    console.log(targetFighter.name + " max stamina increased");
                }
                break;
            case 1:
                {
                    targetFighter.strength++;
                    console.log(targetFighter.name + " strength increased");
                }
                break;
            case 2:
                {
                    targetFighter.speed++;
                    console.log(targetFighter.name + " speed increased");
                }
                break;
        }
    };
    return TrainFighter;
}(managerOptions_1.ManagerOption));
exports.TrainFighter = TrainFighter;
