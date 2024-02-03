"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var class_1 = require("./class");
var util_1 = require("./util");
var fs = require('fs');
var path = require('path');
var maps = new Map();
var init = function () {
    var jsonsInDir = fs.readdirSync('./testMaps').filter(function (file) { return path.extname(file) === '.json'; });
    jsonsInDir.forEach(function (file) {
        var fileData = fs.readFileSync(path.join('./testMaps', file));
        maps[file] = JSON.parse(fileData.toString());
    });
};
var dijkstra = function (origin, idList) {
    var out = {
        distF0: new Map(),
        pathF0: new Map(),
    };
    idList.forEach(function (id) {
        out.distF0[id] = Number.MAX_SAFE_INTEGER;
    });
    out.distF0[origin.id] = 0;
    out.pathF0[origin.id] = [-1];
    reDijkstra(origin, out, ["0"], [-1], 0);
    return out;
};
var reDijkstra = function (cur, out, pathId, pathIndex, tDist) {
    var distToNext;
    var nodesToRecurse = [];
    var distNTR = [];
    cur.near.forEach(function (e, i) {
        if (pathId.includes(e.id))
            return; // skips node, if already in current path
        distToNext = tDist + cur.dist[i];
        if (distToNext < out.distF0[e.id]) { // if first path or faster path to node
            out.distF0[e.id] = distToNext;
            out.pathF0[e.id] = pathIndex.concat([i]);
            if (e.priv === true)
                return;
            if (e.priv === 2)
                return;
            if (e.priv === 1 && e.lockedFrom.id === cur.id)
                return;
            nodesToRecurse.push(i);
        }
    });
    nodesToRecurse.forEach(function (e) {
        distNTR.push(cur.dist[e]);
    });
    sortIndexesByValue(distNTR).forEach(function (e) {
        var nextNode = cur.near[nodesToRecurse[e]];
        reDijkstra(nextNode, out, pathId.concat(nextNode.id), pathIndex.concat(nodesToRecurse[e]), tDist + distNTR[e]);
    });
};
var specDijkstra = function (origin, target, idList) {
    var out = {
        distF0: new Map(),
        pathF0: new Map(),
        pathF1: new Map()
    };
    idList.forEach(function (id) {
        out.distF0[id] = Number.MAX_SAFE_INTEGER;
    });
    out.distF0[origin.id] = 0;
    out.pathF0[origin.id] = [-1];
    specReDijkstra(origin, out, ["0"], [-1], 0, target);
    return { idPath: out.pathF1[target], idxPath: out.pathF0[target] };
};
var specReDijkstra = function (cur, out, pathId, pathIndex, tDist, target) {
    var distToNext;
    var nodesToRecurse = [];
    var distNTR = [];
    cur.near.forEach(function (e, i) {
        if (pathId.includes(e.id))
            return; // skips node, if already in current path
        distToNext = tDist + cur.dist[i];
        if (distToNext < out.distF0[e.id]) { // if first path or faster path to node
            out.distF0[e.id] = distToNext;
            out.pathF0[e.id] = pathIndex.concat([i]);
            out.pathF1[e.id] = pathIndex.concat(e.id);
            if (distToNext >= out.distF0[target])
                return;
            if (e.priv === 2)
                return;
            if (e.priv === 1 && e.lockedFrom.id === cur.id)
                return;
            nodesToRecurse.push(i);
        }
    });
    nodesToRecurse.forEach(function (e) {
        distNTR.push(cur.dist[e]);
    });
    sortIndexesByValue(distNTR).forEach(function (e) {
        var nextNode = cur.near[nodesToRecurse[e]];
        reDijkstra(nextNode, out, pathId.concat(nextNode.id), pathIndex.concat(nodesToRecurse[e]), tDist + distNTR[e]);
    });
};
var sortIndexesByValue = function (y) {
    var out = [];
    var x = [];
    Object.assign(x, y);
    var smlI;
    for (var i = 0; i < x.length; i++) {
        smlI = 0;
        for (var j = 0; j < x.length; j++) {
            if (x[j] < x[smlI]) {
                smlI = j;
            }
        }
        out.push(smlI);
        x[smlI] = Number.MAX_SAFE_INTEGER;
    }
    return out;
};
var loadMap = function (mapName) {
    var map = maps[mapName + ".json"];
    var nodes = [];
    var nodeIds = [];
    var jsonNodes = map.nodes;
    jsonNodes.forEach(function (e) {
        switch (e.type) {
            case "destination":
                nodes.push(new class_1.destination(e.id, [], e.dists, e.priv));
                break;
            case "passage":
                nodes.push(new class_1.passage(e.id, [], e.dists, e.priv));
                break;
            case "stairs":
                nodes.push(new class_1.stairs(e.id, [], e.dists, e.priv));
                break;
            case "exit":
                nodes.push(new class_1.exit(e.id, [], e.dists, e.priv, e.extraParams[0], e.extraParams[1]));
                break;
            default:
                nodes.push(new class_1.node(e.id, [], e.dists, e.priv));
                break;
        }
        nodeIds.push(e.id);
    });
    var nodeRefs = (0, util_1.getRefsArr)(nodes);
    nodes.forEach(function (e, i) {
        jsonNodes[i].nearIds.forEach(function (ee) {
            e.near.push(nodeRefs[ee]);
        });
    });
    return { nodes: nodes, nodeIds: nodeIds };
};
init();
var x = loadMap("web");
var final = dijkstra(x.nodes[0], x.nodeIds);
var _a = specDijkstra(x.nodes[0], "5", x.nodeIds), idPath = _a.idPath, idxPath = _a.idxPath;
console.log(final, idPath, idxPath);
