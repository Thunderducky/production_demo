
import RealtimeClockTicker from './RealtimeClockTicker';

it('can be created', () => {
    const rct = new RealtimeClockTicker(() => {});
    expect(rct).not.toBeNull();
});

