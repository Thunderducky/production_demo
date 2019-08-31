/**
 * Realtime Clock Ticker
 * Tracks realtime as best as it can and calls a "tick" function depending on how many ticks its gone through
 * Uses window.requestAnimationFrame so it does not work well when this is not the focus of the app
 * There will probably be only one of these in the app and it will feed "ticks" into the rest of the app"
 * If You cannot regularly process the game loop in time, it's just going to fall further and further behind
 * at which point you might want to increase the tick time or split up your step times
 */

class RealTimeClockTicker {
    tickTimeMs: number;
    startTime: number;
    running: boolean;
    lastTime: number;
    tickCount: number;
    crossLoopAccumulator: number; // This is used to keep ticks across loop frames
    onTick: Function;
    /**
     *  Set up a Realtime clock and specify how often it sets a "tick", used to power timers, will probably only have one of these per program
     * @param tickTimeMs // how long a tickCycleTakes
     */
    constructor(onTick: Function, tickTimeMs = 16){
        this.tickTimeMs = tickTimeMs
        this.startTime = 0;
        this.lastTime = 0
        this.running = false;
        this.crossLoopAccumulator = 0;
        this.tickCount = 0;
        this.onTick = onTick;
    }
    start = () =>{
        if(this.running){
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
        while(crossLoopTime > this.tickTimeMs){
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
        this.onTick(this.tickCount, elapsed, total)
    }
    stop = () => {
        this.tickCount = 0;
        this.running = false;
    }
}

export default RealTimeClockTicker