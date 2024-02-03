"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.passage = exports.stairs = exports.exit = exports.destination = exports.node = exports.floor = exports.building = void 0;
var building = /** @class */ (function () {
    function building(floors, groundLvl, exits) {
        this.floors = floors;
        this.groundLvl = groundLvl;
        this.exits = exits;
    }
    return building;
}());
exports.building = building;
var floor = /** @class */ (function () {
    function floor(id, nodes) {
        this.id = id;
        this.nodes = nodes;
    }
    return floor;
}());
exports.floor = floor;
var node = /** @class */ (function () {
    function node(id, near, dist, priv) {
        this.id = id;
        this.near = near;
        this.dist = dist;
        this.priv = priv;
    }
    return node;
}());
exports.node = node;
var destination = /** @class */ (function (_super) {
    __extends(destination, _super);
    function destination(id, near, dist, priv) {
        return _super.call(this, id, near, dist, priv) || this;
    }
    return destination;
}(node));
exports.destination = destination;
var exit = /** @class */ (function (_super) {
    __extends(exit, _super);
    function exit(id, near, dist, priv, lockedFrom, frontDoor) {
        var _this = _super.call(this, id, near, dist, priv) || this;
        _this.frontDoor = frontDoor;
        _this.lockedFrom = lockedFrom;
        return _this;
    }
    return exit;
}(node));
exports.exit = exit;
var stairs = /** @class */ (function (_super) {
    __extends(stairs, _super);
    function stairs(id, near, dist, priv) {
        return _super.call(this, id, near, dist, priv) || this;
    }
    return stairs;
}(node));
exports.stairs = stairs;
var passage = /** @class */ (function (_super) {
    __extends(passage, _super);
    function passage(id, near, dist, priv) {
        return _super.call(this, id, near, dist, priv) || this;
    }
    return passage;
}(node));
exports.passage = passage;
