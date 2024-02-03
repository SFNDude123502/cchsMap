import { building, floor, node, stairs, exit, passage, destination, dijkstraOut, jsonNode, specDijkstraOut, map, jsonBuilding, jsonFloor } from './class';
import {getRefs, getRefsArr} from "./util"
const fs = require('fs');
const path = require('path')
var maps: Map<string, Object> = new Map<string, Object>();

const init = () =>{
    const jsonsInDir = fs.readdirSync('./testMaps').filter(file => path.extname(file) === '.json');
    jsonsInDir.forEach(file => {
        const fileData = fs.readFileSync(path.join('./testMaps', file));
        maps[file] = JSON.parse(fileData.toString());
    });
}

const dijkstra = (origin: node, idList: string[]): dijkstraOut => {
    let out = {
        distF0: new Map<string, number>(),
        pathF0: new Map<string, number[]>(),
    }

    idList.forEach(id => {
        out.distF0[id] = Number.MAX_SAFE_INTEGER
    })

    out.distF0[origin.id] = 0
    out.pathF0[origin.id] = [-1]

    reDijkstra(origin, out, ["0"],[-1],0)

    return out
}

const reDijkstra = (cur, out: dijkstraOut, pathId: string[], pathIndex: number[], tDist: number) => {
    let distToNext: number
    let nodesToRecurse: number[] = []
    let distNTR: number[] = []
    cur.near.forEach((e, i) => { // loop through all connected nodes
        if (pathId.includes(e.id)) return // skips node, if already in current path

        distToNext = tDist + cur.dist[i]
        if (distToNext < out.distF0[e.id]){ // if first path or faster path to node
            out.distF0[e.id] = distToNext
            out.pathF0[e.id] = pathIndex.concat([i])

            if (e.priv === true)return
            if (e.priv === 2)return
            if (e.priv === 1 && e.lockedFrom.id === cur.id)return
            nodesToRecurse.push(i)
        }
    });
    nodesToRecurse.forEach(e =>{
        distNTR.push(cur.dist[e])
    })
    sortIndexesByValue(distNTR).forEach(e=>{
        let nextNode = cur.near[nodesToRecurse[e]]
        reDijkstra(nextNode, out, pathId.concat(nextNode.id), pathIndex.concat(nodesToRecurse[e]), tDist+distNTR[e])
    })
}

const specDijkstra = (origin: node, target: string, idList: string[]): {idPath: string[], idxPath: number[]} => {
    let out = {
        distF0: new Map<string, number>(),
        pathF0: new Map<string, number[]>(),
        pathF1: new Map<string, string[]>()
    }

    idList.forEach(id => {
        out.distF0[id] = Number.MAX_SAFE_INTEGER
    })

    out.distF0[origin.id] = 0
    out.pathF0[origin.id] = [-1]

    specReDijkstra(origin, out, ["0"],[-1],0, target)

    return {idPath: out.pathF1[target], idxPath: out.pathF0[target]}
}

const specReDijkstra = (cur, out: specDijkstraOut, pathId: string[], pathIndex: number[], tDist: number, target: string) => {
    let distToNext: number
    let nodesToRecurse: number[] = []
    let distNTR: number[] = []
    cur.near.forEach((e, i) => { // loop through all connected nodes
        if (pathId.includes(e.id)) return // skips node, if already in current path

        distToNext = tDist + cur.dist[i]
        if (distToNext < out.distF0[e.id]){ // if first path or faster path to node
            out.distF0[e.id] = distToNext
            out.pathF0[e.id] = pathIndex.concat([i])
            out.pathF1[e.id] = pathIndex.concat(e.id)

            if (distToNext >= out.distF0[target])return
            if (e.priv === 2)return
            if (e.priv === 1 && e.lockedFrom.id === cur.id)return
            nodesToRecurse.push(i)
        }
    });
    nodesToRecurse.forEach(e =>{
        distNTR.push(cur.dist[e])
    })
    sortIndexesByValue(distNTR).forEach(e=>{
        let nextNode = cur.near[nodesToRecurse[e]]
        reDijkstra(nextNode, out, pathId.concat(nextNode.id), pathIndex.concat(nodesToRecurse[e]), tDist+distNTR[e])
    })
}

const sortIndexesByValue = (y: number[]): number[] => {
    let out: number[] = []
    let x: number[] = []
    Object.assign(x, y)
    let smlI: number

    for(let i = 0; i<x.length; i++){
        smlI = 0
        for(let j = 0; j<x.length; j++){
            if(x[j] < x[smlI]) {
                smlI = j
            }
        }

        out.push(smlI)
        x[smlI] = Number.MAX_SAFE_INTEGER
    }

    return out
}

const loadMap = (mapName: string): map => {
    const rawMap = maps[mapName+".json"]
    
    let buildings: building[] = []
    let floors: floor[] = []
    let nodes: node[] = []
    let nodeIds: string[] = []
    let jsonNodes: jsonNode[] = rawMap.nodes
    let jsonBuildings: jsonBuilding[] = rawMap.buildings
    let jsonFloors: jsonFloor[] = rawMap.floors

    jsonNodes.forEach(e => {
        switch (e.type) {
            case "destination":
                nodes.push(new destination(e.id, [], e.dists, e.priv))
                break;
            case "passage":
                nodes.push(new passage(e.id, [], e.dists, e.priv))
                break;
            case "stairs":
                nodes.push(new stairs(e.id, [], e.dists, e.priv))
                break;
            case "exit":
                nodes.push(new exit(e.id, [], e.dists, e.priv, e.extraParams[0], e.extraParams[1]))
                break;
            default:
                nodes.push(new node(e.id, [], e.dists, e.priv)) 
                break;
        }
        nodeIds.push(e.id)
    })
    jsonFloors.forEach(e => {
        let floorNodes: node[] = []
        nodes.forEach(ee => {
            if (e.nodeIds.includes(ee.id)){
                floorNodes.push(ee)
            }
        })
        floors.push(new floor(e.id, floorNodes))
    })
    jsonBuildings.forEach(e => {
        let buildingFloors: floor[] = []
        let buildingExits: exit[] = []
        floors.forEach(ee => {
            if(e.floorIds.includes(ee.id)){
                buildingFloors.push(ee)
            }
        })
        buildingFloors.forEach(ee =>{
            ee.nodes.forEach(eee => {
                if (eee instanceof exit){
                    buildingExits.push(eee)
                }
            })
        })
        buildings.push(new building(e.id, buildingFloors, e.groundLvl, buildingExits))
    })

    let nodeRefs = getRefsArr(nodes)

    nodes.forEach((e,i)=>{
        jsonNodes[i].nearIds.forEach(ee=>{
            e.near.push(nodeRefs[ee])
        })
    })
    return new map(mapName, buildings, floors, nodes, nodeIds)
}

init()
let x = loadMap("web")

let final = dijkstra(x.nodes[0], x.nodeIds)
let {idPath, idxPath} = specDijkstra(x.nodes[0], "5",  x.nodeIds)
console.log(final, idPath, idxPath)