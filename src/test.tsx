// import PUBSUB from './pubsub/Pubsub'
function test(){
    const errorFn = () => { throw new Error("not implement") }
    // Let's make our test 
    interface GameProcessEventObject {
        onStart?: Function;
        onUpdate?: Function;
        onCancel?: Function;
        onPause?: Function;
        onResume?: Function;
        onComplete?: Function;
    }
    enum GameProcessStatus {
        UNSTARTED,
        RUNNING,
        PAUSED,
        CANCELLED,
        COMPLETED
    }

    class GameProcess {
        status: GameProcessStatus;
        onStart: Function;
        onUpdate: Function;
        onCancel: Function;
        onPause: Function;
        onResume: Function;
        onComplete: Function;

        constructor(eventObj: GameProcessEventObject = {}){
            this.status = GameProcessStatus.UNSTARTED
            this.onStart = eventObj.onStart || errorFn
            this.onUpdate = eventObj.onUpdate || errorFn
            this.onCancel = eventObj.onCancel || errorFn
            this.onPause = eventObj.onPause || errorFn
            this.onResume = eventObj.onResume || errorFn
            this.onComplete = eventObj.onComplete || errorFn
        }

        start(){
            // only start if we are not running
            this.status = GameProcessStatus.RUNNING
            this.onStart()
        }
        resume(){
            if(this.status !== GameProcessStatus.RUNNING){
                throw new Error("Cannot updated a process that hasn't started")
            }
            this.onResume()
        }
        update(){
            // don't update things that aren't running
            if(this.status !== GameProcessStatus.RUNNING){
                throw new Error("Cannot updated a process that isn't running")
            }
            this.onUpdate()
        }
        pause(){
            this.status = GameProcessStatus.PAUSED
            this.onPause()
        }
        cancel(){
            this.status = GameProcessStatus.CANCELLED
            this.onCancel();
        }
        complete(){
            this.status = GameProcessStatus.COMPLETED
            this.onComplete();
        }

    }

    const timingData = {
        targetTickCount: 10,
        currentTickCount: 0,
    }
    const resourceProxy = {
        iron: 8
    }
    const buildingHold = {
        iron: 0
    }
    const buildingList = [] as string[]
    const gp = new GameProcess();
    gp.onStart = () => {
        // require resources
        console.log("Start building")
        buildingHold.iron += 4;
        resourceProxy.iron -= 4;
    }
    gp.onUpdate = () => {
        console.log("updating")
        // when done
        if(timingData.targetTickCount <= timingData.currentTickCount){
            gp.complete()
        } else {
            timingData.currentTickCount++
        }
    }
    gp.onCancel = () => {
        buildingHold.iron -= 4;
        resourceProxy.iron += 4;
    }
    gp.onPause = () => {
        // disabled
    }
    gp.onComplete = () => {
        buildingHold.iron = 0; // clear out all the items, we have just lost those resources
        buildingList.push("new building")
    }

    console.log(resourceProxy, buildingHold, buildingList);
    gp.start()
    while(gp.status !== GameProcessStatus.COMPLETED){
        gp.update();
    }
    console.log(resourceProxy, buildingHold, buildingList);
}

export default test;