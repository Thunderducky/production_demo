import { Entity } from "../ecsBase";

class WorldState {
    entities: Entity[];
    constructor(){
        this.entities = []
    }
}

export default WorldState

