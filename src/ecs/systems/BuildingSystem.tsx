import PUBSUB from "../../pubsub/Pubsub";
import { Entity } from "../ecsBase";
import { ResourceType, ResourceDeltaComponent } from "../components/resources";
import { nextId } from "../../utils/idHelper";

interface SavedMessage {
    message: any;
    topic: string;
}

const makeResourceDelta = (owner:Entity, amount: number, type: ResourceType): ResourceDeltaComponent => {
    return { id: nextId(), owner, type, amount } 
}
const makeBuilding = (name: string, power: number, cpu: number): Entity => {
    const e = new Entity(nextId(), name);
    if(power){
        e.set(
            power > 0
                ? "powerSupply"
                : "powerDraw",
            makeResourceDelta(e, power, ResourceType.POWER)
        )
    }
    if(cpu){
        e.set(
            cpu > 0
                ? "cpuSupply"
                : "cpuDraw",
            makeResourceDelta(e, cpu, ResourceType.POWER)
        )
    }
    return e;
}

class BuildingSystem {
    messages: SavedMessage[]
    constructor(){
        this.messages = []
        PUBSUB.subscribe("make_new_building", (message: any, topic: string) => {
            this.messages.push({message, topic})
        })
    }
    // Add new buildings to the entity list
    update = (entities: Entity[]) => {
        // Process our inbox in order
        
        const buildings = this.messages.filter(sm => sm.topic === "make_new_building").map(sm => sm.message.name)
        
        if(buildings.length > 0){
            const a = [...buildings];
            console.log(a);
        }// clear all of our messages
        //console.log(buildings);
        buildings.forEach(bName => {
            if(bName === "solar_cells"){
                console.log("build a new solar panel!");
                entities.push(
                    makeBuilding("solar_cells", 8, 0)
                )
            } else if(bName === "computer_core"){
                console.log("build a new computer core!");
                entities.push(
                    makeBuilding("computer_core", -2, 4)
                )
            } else if(bName === "robo_bay"){
                console.log("build a new robo bay");
                entities.push(
                    makeBuilding("robo_bay", -2, -2)
                )
            }
        })
        this.messages.length = 0;
    }
}
export default BuildingSystem;