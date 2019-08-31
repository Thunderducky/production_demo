import React from 'react';
import GAME from "../../game"
import PUBSUB from '../../pubsub/Pubsub';
import ProgessBar from '../components/ProgressBar/ProgressBar'
import { Entity } from '../../ecs/ecsBase';
class MainPage extends React.Component {
    state = {
        entities:[] as Entity[],
        power: {
            total: 0,
            used: 0,
            unused: 0
        },
        cpu: {
            total: 0,
            used: 0,
            unused: 0
        }
    }
    componentDidMount(){
        GAME.start();
        PUBSUB.subscribe("ui_resource_update", (msg:any) => {
            const {entities, power, cpu} = msg;
            this.setState({entities, power, cpu })
        })
    }
    buildingClick = (name: any) => {
        console.log(name)
        if(name === "solar_cells"){
            // make another set of solar cells
            PUBSUB.publish("make_new_building", { name });
        }
        else if(name === "computer_core"){
            // make another set of solar cells
            PUBSUB.publish("make_new_building", { name });
        }
        else if(name === "robo_bay"){
            // make another set of solar cells
            PUBSUB.publish("make_new_building", { name });
        }
    }
    render(){
        const {power, cpu, entities} = this.state;
        return (
            <div className="MainPage" style={{padding:15}} >
                <h2>Resources</h2>
                <ProgessBar label={`Power: ${power.used}/${power.total}`} textColor="red" percentDone={100 * (power.used/(power.total || 1)) | 0}/>
                <ProgessBar label={`CPU: ${cpu.used}/${cpu.total}`} textColor="red" percentDone={100 * (cpu.used/(cpu.total || 1)) | 0}/>

                <h2>Buildings</h2>
                <ul>
                    {
                        entities.map(e => (
                            <li key={"ekey-" + e.id}>
                                {e.name} <button onClick={() => this.buildingClick(e.name)}>Make More</button>
                            </li>
                        ))
                    }
                </ul>
            </div>
        );
    }
}

export default MainPage;
