"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRefsArr = exports.getRefs = void 0;
var getRefs = function (origin) {
    var out = new Map();
    out[origin.id] = origin;
    reGetRefs(origin, out, [origin.id]);
    return out;
};
exports.getRefs = getRefs;
var reGetRefs = function (cur, out, pathId) {
    var nodesToRecurse = [];
    cur.near.forEach(function (e, i) {
        if (out.has(e.id))
            return;
        if (!pathId.includes(e.id)) {
            nodesToRecurse.push(i);
            out[e.id] = e;
        }
    });
    nodesToRecurse.forEach(function (e) {
        reGetRefs(cur.near[e], out, pathId.concat(cur.near[e].id));
    });
};
var getRefsArr = function (x) {
    var out = new Map();
    x.forEach(function (e) {
        out[e.id] = e;
    });
    return out;
};
exports.getRefsArr = getRefsArr;
