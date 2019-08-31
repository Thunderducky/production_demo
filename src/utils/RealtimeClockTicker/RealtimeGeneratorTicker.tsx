
/**
 * This class allows us to call next on a generator until it is done, it will also provide realTime numbers and tick amounts
 */
class RealTimeGeneratorTicker {
    tickTimeMs: number;
    startTime: number;
    running: boolean;
    lastTime: number;
    tickCount: number;
    crossLoopAccumulator: number; // This is used to keep ticks across loop frames
    onTick: Generator
    generatorDone: boolean;
    /**
     *  Set up a Realtime clock and specify how often it sets a "tick", used to power timers, will probably only have one of these per program
     * @param tickTimeMs // how long a tickCycleTakes
     */
    constructor(onTick: (() => IterableIterator<any>), tickTimeMs = 16){
        this.tickTimeMs = tickTimeMs
        this.startTime = 0;
        this.lastTime = 0
        this.running = false;
        this.crossLoopAccumulator = 0;
        this.tickCount = 0;
        this.onTick = onTick();
        this.generatorDone = false;
    }
    start = () =>{
        if(this.running || this.generatorDone){
            return;
        }

        this.running = true;
        this.tickCount = 0
        const now = window.performance.now();
        this.startTime = now;
        this.lastTime = now;
        this._loop();
        return this;
    }

    _loop = () => {
        if(!this.running){
            return;
        }
        window.requestAnimationFrame(this._loop);
        // do everything else in here
        const now = window.performance.now();
        const elapsed = now - this.lastTime;
        const total = now - this.startTime; // we mostly use this for debugging right now
        let crossLoopTime = elapsed + this.crossLoopAccumulator;
        if(this.tickTimeMs <= 0){
            throw new Error("Tick time cannot be non-positive");
        }
        while(crossLoopTime > this.tickTimeMs && this.running){
            try {
                this._tick(elapsed, total);
            } catch(err){
                // this is catching anything in the tick that might've gone wrong
                console.log("Error!", err)
            }
            crossLoopTime -= this.tickTimeMs;
        }
        this.crossLoopAccumulator = crossLoopTime
        // How many ticks do we have to process

        this.lastTime = now;
    }
    _tick = (elapsed: number, total: number) => {
        this.tickCount++;
        const { done } = this.onTick.next({ tickCount: this.tickCount, elapsed, total})
        if(done){
            this.generatorDone = true;
            this.running = false;
        }
    }
    stop = () => {
        this.tickCount = 0;
        this.running = false;
    }
}

export default RealTimeGeneratorTicker;