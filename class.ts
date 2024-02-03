export class map{
    readonly id: string
    readonly buildings: building[]
    readonly floors: floor[]
    readonly nodes: node[]
    readonly nodeIds: string[]
    constructor(id: string, buildings: building[], floors: floor[], nodes: node[], nodeIds: string[]){
        this.id = id
        this.buildings = buildings
        this.floors = floors
        this.nodes = nodes
        this.nodeIds = nodeIds
    }
}

export class building {
    readonly id: string
    readonly floors: floor[]
    readonly groundLvl: number
    readonly exits: exit[]
    constructor(id: string, floors: floor[], groundLvl: number, exits: exit[]) {
        this.id = id
        this.floors = floors
        this.groundLvl = groundLvl
        this.exits = exits
    }
}

export class floor{
    readonly nodes: node[]
    readonly id: string
    constructor(id: string, nodes: node[]) {
        this.id = id
        this.nodes = nodes
    }
}

export class node {
    readonly id: string
    near: node[]
    readonly dist: number[]
    readonly priv: number // 0: open, 1: semi-open, 2: closed
    constructor(id: string, near: node[], dist: number[], priv: number) {
        this.id = id;
        this.near = near;
        this.dist = dist;
        this.priv = priv;
    }
}

export class destination extends node{
    constructor(id: string, near: node[], dist: number[], priv: number) {
        super(id, near, dist, priv);
    }
}

export class exit extends node{
    readonly frontDoor: boolean
    readonly lockedFrom: node
    constructor(id: string, near: node[], dist: number[], priv: number, lockedFrom: node, frontDoor: boolean) {
        super(id, near, dist, priv);
        this.frontDoor = frontDoor
        this.lockedFrom = lockedFrom
    }
}

export class stairs extends node{
    constructor(id: string, near: node[], dist: number[], priv: number) {
        super(id, near, dist, priv);
    }
}

export class passage extends node{
    constructor(id: string, near: node[], dist: number[], priv: number) {
        super(id, near, dist, priv);
    }
}


export interface dijkstraOut {
    distF0: Map<string, number>
    pathF0: Map<string, number[]>
}
export interface specDijkstraOut {
    distF0: Map<string, number>
    pathF0: Map<string, number[]>
    pathF1: Map<string, string[]>
}
export interface jsonNode{
    id: string
    type: string
    nearIds: string[]
    dists: number[]
    extraParams: any[]
    priv: number
}
export interface jsonFloor{
    id: string
    nodeIds: string[]
}
export interface jsonBuilding{
    id: string
    floorIds: string[]
    groundLvl: number
}