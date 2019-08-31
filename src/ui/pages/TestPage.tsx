import React from 'react';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import PUBSUB from "../../pubsub/Pubsub"
// import RealtimeClockTicker from '../../utils/RealtimeClockTicker/RealtimeClockTicker'
import RealtimeGeneratorTicker from '../../utils/RealtimeClockTicker/RealtimeGeneratorTicker'
import test from '../../test'
class TestPage extends React.Component {
    ticker: RealtimeGeneratorTicker;
    constructor(props: any){
        super(props)
        let _tickCount = 0;
        const generator = function * () {
            while(_tickCount < 100){
                const {tickCount, elapsed, total} = yield;
                _tickCount = tickCount
                console.log(tickCount, elapsed, total);
            }
        }
        this.ticker = new RealtimeGeneratorTicker(generator);
    }

    state = {
        percent: 0,
        cpu: {
            total: 0,
            used: 0,
            overdraw: 0
        }, 
        power: {
            total: 0,
            used: 0,
            overdraw: 0
        }
    }
    updateTick = (tickCount: number) => {
        this.setState({ percent: tickCount % 101 })
    }

    componentDidMount(){
        // PUBSUB.subscribe("resource_update", (updateData:any) => {
        //     console.log(updateData);
        //     const p = updateData.power;
        //     const cpu = updateData.cpu;
        //     this.setState({
        //         power: {
        //             total: p.totalPower,
        //             used: p.totalPower - p.unclaimedPower,
        //             overdraw: 0
        //         },
        //         cpu: {
        //             total: cpu.totalCpu,
        //             used: cpu.totalCpu - cpu.unclaimedCpu
        //         }
        //     })
        // })
       test();
    }
    render(){
        return (
            <div className="TestPage" >
                Test
            </div>
        );
    }
}

export default TestPage;
