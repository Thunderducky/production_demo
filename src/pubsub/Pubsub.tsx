// currently no unsubscribing :)
type Topic = string; // convert this to be something better later
/**
 * Our way of communicating one way acorss the whole app
 */
class PubSub {
    topicList: Map<Topic, Function[]>;
    constructor(){
        this.topicList = new Map<string, Function[]>()
    }
    publish = (topic: Topic, message: any) => {
        if(this.topicList.has(topic)){
            const subs = this.topicList.get(topic) as Function[];
            subs.forEach(fn => fn(message, topic))
        }
    }
    subscribe = (topic: Topic, listenFn: Function) => {
        if(!this.topicList.has(topic)){
            this.topicList.set(topic, [])
        }
        const subs = this.topicList.get(topic) as Function[];
        subs.push(listenFn);
    }
}

const PUBSUB = new PubSub();

// We export the class as well in cased people need it, but by and large everyone hooks up to the same pubsub right now
export {PUBSUB as default, PubSub}