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

    mocha.it('follows the Law of Left Identity', () => {
        const addOne = n => n + 1;
        expect(Identity.return(1).fmap(addOne).flatten()).to.equal(addOne(1));
    });

    mocha.it('follows the Law of Right Identity', () => {
        expect(
            Identity(1)
                .fmap(Identity.return)
                .flatten() // fmap:ed Identity's value
                .flatten() // The outer Identity's value
        ).to.equal(Identity(1).flatten());
    });

    mocha.it('follows the Law of Associativity', () => {
        const f = n => n + 1;
        const g = n => n * 2;
        expect(
            Identity(1)
                .fmap(f)
                .fmap(g)
                .flatten()
        ).to.equal(
            Identity(1)
                .fmap(x => f(x))
                .fmap(g)
                .flatten()
        );

        const mf = n => Identity(n + 1);
        const mg = n => Identity(n * 2);
        expect(
            Identity(1)
                .flatMap(mf)
                .flatMap(mg)
                .flatten()
        ).to.equal(
            Identity(1)
                .flatMap(x => Identity(x + 1))
                .flatMap(mg)
                .flatten()
        );
    });
});
