import { EntityComponent } from "../ecsBase";

export enum ResourceType {
    POWER,
    CPU
}

export interface ResourceDeltaComponent extends EntityComponent {
    type: ResourceType
    amount: number
}