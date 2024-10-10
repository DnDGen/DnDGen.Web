import { Frequency } from "../models/frequency.model";
import { FrequencyPipe } from "./frequency.pipe";

describe('Frequency Pipe', () => {
    describe('unit', () => {
        let pipe: FrequencyPipe;
        let frequency: Frequency;
    
        beforeEach(() => {
            frequency = new Frequency();
            pipe = new FrequencyPipe();
        });

        it('formats frequency with quantity', () => {
            frequency.quantity = 92;
            frequency.timePeriod = 'week';

            var formattedFrequency = pipe.transform(frequency);
            expect(formattedFrequency).toEqual('92/week');
        });

        it('formats frequency without quantity', () => {
            frequency.quantity = 0;
            frequency.timePeriod = 'when I feel like it';

            var formattedFrequency = pipe.transform(frequency);
            expect(formattedFrequency).toEqual('when I feel like it');
        });
    });
});