import {building, floor, node, stairs, exit, passage, destination, dijkstraOut} from "./class"

export const getRefs = (origin: node): Map<string, node> => {
    let out: Map<string, node> = new Map<string, node>()

    out[origin.id] = origin

    reGetRefs(origin, out, [origin.id])

    return out
}

const reGetRefs = (cur: node, out: Map<string, node>, pathId: string[]) => {
    let nodesToRecurse: number[] = []
    cur.near.forEach((e, i) => {
        if (out.has(e.id)) return 
        if (!pathId.includes(e.id)) {
            nodesToRecurse.push(i)
            out[e.id] = e
        }
    });

    nodesToRecurse.forEach(e=>{
        reGetRefs(cur.near[e], out, pathId.concat(cur.near[e].id))
    })
}

export const getRefsArr = (x: node[]): Map<string,node> => {
    let out = new Map<string,node>()
    x.forEach(e => {
        out[e.id] = e
    })
    return out
}