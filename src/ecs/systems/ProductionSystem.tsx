import { Entity, EntityComponent } from "../ecsBase";
import { ResourceDeltaComponent } from "../components/resources";
import PUBSUB from "../../pubsub/Pubsub";

const getComponents = (entities: Entity[], componentName: string): EntityComponent[] => {
    return entities.filter(e => e.has(componentName)).map(e => e.get(componentName) as EntityComponent)
}

const allocateResource = (total: number, drains: ResourceDeltaComponent[], haves: Entity[], havenots: Entity[]): number => {
    drains.forEach(drain => {
        const drainAmount = -drain.amount;
        if(drainAmount <= total){
            haves.push(drain.owner)
            total -= drainAmount
        } else {
            havenots.push(drain.owner)
        }
    })
    return total; // return the unused amount
}
const sumAmountFn = (previous:number, current:ResourceDeltaComponent) => previous + current.amount;

class ProductionSystem {
    update = (entities: Entity[]) => {
        //console.log(entities);
        // Get the world state somehow, for now we'll pass it directly
        const powerSuppliers = getComponents(entities, "powerSupply") as ResourceDeltaComponent[]
        const totalPower = powerSuppliers.reduce(sumAmountFn, 0);

        const powerDraw = getComponents(entities, "powerDraw") as ResourceDeltaComponent[]
        const powered: Entity[] = []
        const unpowered: Entity[] = []

        // calculate who recieves resources
        
        const unusedPower = allocateResource(totalPower, powerDraw, powered, unpowered);
        const usedPower = totalPower - unusedPower
        // Check the CPU resources
        const cpuSuppliers = getComponents(entities, "cpuSupply") as ResourceDeltaComponent[]
        
        const totalCpu = cpuSuppliers.reduce(sumAmountFn, 0)
        
        const cpuDraw = getComponents(entities, "cpuDraw") as ResourceDeltaComponent[]

        const cpuSupplied: Entity[] = [];
        const cpuLocked: Entity[] = [];
        const unusedCpu = allocateResource(totalCpu, cpuDraw, cpuSupplied, cpuLocked)
        const usedCpu = totalCpu - unusedCpu;

        PUBSUB.publish("ui_resource_update", {
            entities,
            power: {
                total: totalPower,
                used: usedPower,
                unused: unusedPower
            },
            cpu: {
                total: totalCpu,
                used: usedCpu,
                unused: unusedCpu
            }
        })

    }
}
export default ProductionSystem;