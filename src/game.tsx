import RealTimeClockTicker from "./utils/RealtimeClockTicker/RealtimeClockTicker";
import WorldState from "./ecs/states/WorldState"
import ProductionSystem from "./ecs/systems/ProductionSystem";
import { Entity } from "./ecs/ecsBase";
import { nextId } from "./utils/idHelper";
import { ResourceType, ResourceDeltaComponent } from "./ecs/components/resources";
import BuildingSystem from "./ecs/systems/BuildingSystem";

// TODO: Inject Game State management so we could then just pick the state
// we want to work with, partially basing that off of react
// and react router

/**
 * The one to rule them all
 * This is the class where we actually set up and run the game, basically in parallel with the react app, the react app is just a way to provide inputs and recieve updates
 * Good luck
 */
class Game {
    rtc: RealTimeClockTicker;
    worldState: WorldState;
    buildingSystem: BuildingSystem;
    productionSystem: ProductionSystem
    constructor(){
        this.rtc = new RealTimeClockTicker(this.update)
        this.worldState = new WorldState();
        this.productionSystem = new ProductionSystem();
        this.buildingSystem = new BuildingSystem()
    }
    start = () => {
        // We're going to do our initialization stuff in here

        // We'll need to change this eventually
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
        this.worldState.entities.push(
            makeBuilding("solar_cells", 8, 0)
        )
        this.worldState.entities.push(
            makeBuilding("computer_core", -2, 4)
        )
        this.worldState.entities.push(
            makeBuilding("robo_bay", -2, -2)
        )



        // Do a bunch of setup stuff here
        this.rtc.start()
    }
    update = (totalTicks:number, elapsed:number, total:number) => {
        //console.log(totalTicks, elapsed, total);
        // we will need these later
        // things we do every frame
        // we will probably break this down even further
        this.buildingSystem.update(this.worldState.entities)
        this.productionSystem.update(this.worldState.entities);
        //console.log(this.worldState.entities);
        //this.rtc.stop();
    }
}

const GAME = new Game();
export {GAME as default, Game}