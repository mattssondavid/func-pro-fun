import chai from 'chai';
import tap from 'tap';

const mocha = tap.mocha;
const expect = chai.expect;

import {Maybe} from './Maybe';

mocha.describe('Maybe', () => {
    mocha.it('wraps a value', () => {
        const maybe = Maybe(1);
        expect(maybe.value).to.equal(1);
    });

    mocha.it('returns', () => {
        const maybe = Maybe.return(1);
        expect(maybe.value).to.equal(1);
    });

    mocha.it('fmaps', () => {
        const mapped = Maybe.return(1).fmap(n => n + 1);
        expect(mapped.value).to.equal(2);
    });

    mocha.it('applies', () => {
        const addOne = Maybe.return(n => n + 1);
        expect(addOne.apply(Maybe.return(1)).value).to.equal(2);
        const addOneOne = Maybe.return(n => m => n + m + 1);
        expect(addOneOne.apply(Maybe(1)).apply(Maybe(2)).value).to.equal(4);
    });

    mocha.it('binds aka. flatMaps', () => {
        const maybe = Maybe.return(1).flatMap(n => Maybe(n + 1));
        expect(maybe.value).to.equal(2);
        const chained = Maybe.return(1)
            .flatMap(n => Maybe(n + 1))
            .flatMap(n => Maybe(n * n));
        expect(chained.value).to.equal(4);
    });
});