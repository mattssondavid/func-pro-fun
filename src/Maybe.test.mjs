import chai from 'chai';
import tap from 'tap';

const mocha = tap.mocha;
const expect = chai.expect;

import {Maybe} from './Maybe';

mocha.describe('Maybe', () => {
    mocha.it('can wrap a value', () => {
        const maybe = Maybe(1);
        expect(maybe.value).to.equal(1);
    })
});