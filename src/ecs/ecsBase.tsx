export interface EntityComponent {
    id: number,
    owner: Entity;
}

export class Entity {
    id: number;
    name: string; // optional defaults to blank, but is helpful for me, not a unique id
    components: Map<string, EntityComponent>;
    
    constructor(id: number, name = ""){
        this.id = id
        this.name = name
        this.components = new Map<string, EntityComponent>();
    }

    // shortcut accessors
    set = (name: string, component: EntityComponent) => this.components.set(name, component)
    has = (name: string) => this.components.has(name)
    get = (name: string) => this.components.get(name)
}