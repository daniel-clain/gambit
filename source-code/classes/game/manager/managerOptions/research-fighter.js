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
var ResearchFighter = /** @class */ (function (_super) {
    __extends(ResearchFighter, _super);
    function ResearchFighter() {
        var _this = _super.call(this) || this;
        _this.name = 'Research fighter';
        _this.cost = 0;
        return _this;
    }
    return ResearchFighter;
}(managerOptions_1.ManagerOption));
exports.ResearchFighter = ResearchFighter;
