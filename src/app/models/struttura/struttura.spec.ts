import { Struttura } from "./struttura";

describe('Struttura model', () => {
    it('should be created', () => {
        let struttura: Struttura = new Struttura();
        expect(struttura).toBeDefined();
    });

});