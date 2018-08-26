import chai from 'chai';
import tap from 'tap';

const mocha = tap.mocha;
const expect = chai.expect;

import {Identity} from './Identity';

mocha.describe('Identity', () => {
    mocha.it('wraps a value', () => {
        expect(Identity(1).flatten()).to.equal(1);
    });

    mocha.it('returns', () => {
        expect(Identity.return(1).flatten()).to.equal(1);
    });

    mocha.it('fmaps', () => {
        expect(
            Identity.return(1)
                .fmap(n => n + 1)
                .flatten()
        ).to.equal(2);
    });

    mocha.it('applies', () => {
        expect(
            Identity(n => n + 1)
                .apply(Identity(1))
                .flatten()
        ).to.equal(2);
        expect(
            Identity.return(a => b => a * b)
                .apply(Identity(2))
                .apply(Identity.return(3))
                .flatten()
        ).to.equal(6);
    });

    mocha.it('binds aka. flatMaps', () => {
        expect(
            Identity.return(1)
                .flatMap(n => Identity(n + 1))
                .flatMap(n => Identity(n + 1))
                .flatten()
        ).to.equal(3);
    });
});