import chai from 'chai';
import tap from 'tap';

const mocha = tap.mocha;
const expect = chai.expect;

import {Maybe} from './Maybe';

mocha.describe('Maybe', () => {
    mocha.it('wraps a value', () => {
        expect(Maybe(1).flatten()).to.equal(1);

        expect(Maybe(1).isNothing()).to.equal(false);

        expect(Maybe(null).isNothing()).to.equal(true);
    });

    mocha.it('returns', () => {
        expect(Maybe.return(1).flatten()).to.equal(1);
    });

    mocha.it('fmaps', () => {
        expect(
            Maybe.return(1)
                .fmap(n => n + 1)
                .flatten()
        ).to.equal(2);

        expect(
            Maybe.return(1)
                .fmap(n => n + 1)
                .fmap(n => n * 2)
                .flatten()
        ).to.equal(4);

        expect(
            Maybe(0)
                .fmap(n => (n > 0) ? n : null)
                .isNothing()
        ).to.equal(true);

        expect(
            Maybe(6)
                .fmap(n => n / 2)
                .fmap(n => n / 2)
                .fmap(n => (n > 0) ? n : null)
                .isNothing()
        ).to.equal(false);
    });

    mocha.it('applies', () => {
        expect(
            Maybe.return(n => n + 1)
                .apply(Maybe.return(1))
                .flatten()
            ).to.equal(2);

        expect(
            Maybe.return(n => m => n + m + 1)
                .apply(Maybe(1))
                .apply(Maybe(2))
                .flatten()
        ).to.equal(4);

        expect(
            Maybe(n => m => n + m)
                .apply(Maybe(1))
                .apply(Maybe(null))
                .isNothing()
        ).to.equal(true)

        expect(
            Maybe(n => m => n + m)
                .apply(Maybe(1))
                .apply(Maybe(null))
                .apply(Maybe(2))
                .isNothing()
        ).to.equal(true)

        expect(
            Maybe(n => m => n + m)
                .apply(Maybe(1))
                .apply(Maybe(2))
                .isNothing()
        ).to.equal(false)
    });

    mocha.it('binds aka. flatMaps', () => {
        expect(
            Maybe.return(1)
                .flatMap(n => Maybe(n + 1))
                .flatten()
            ).to.equal(2);

        expect(
            Maybe.return(1)
                .flatMap(n => Maybe(n + 1))
                .flatMap(n => Maybe(n * n))
                .flatten()
        ).to.equal(4);

        expect(
            Maybe.return(1)
                .flatMap(_ => Maybe(null))
                .isNothing()
        ).to.equal(true);

        expect(
            Maybe.return(null)
                .flatMap(_ => Maybe(null))
                .isNothing() // Nothing in, nothing done.. should be Nothing out
        ).to.equal(true);

        expect(
            Maybe.return(1)
                .flatMap(_ => Maybe(1))
                .flatMap(_ => Maybe(null))
                .flatMap(_ => Maybe(2))
                .isNothing()
        ).to.equal(true);

        const hasValue = Maybe(1)
            .flatMap(_ => Maybe(2))
            .flatMap(n => Maybe(n + 1));
        expect(hasValue.isNothing()).to.equal(false);
        expect(hasValue.flatten()).to.equal(3);

        const isEven = n => n % 2 === 0;
        const halfIt = n => {
            return isEven(n)
                ? Maybe(n / 2) // Just a
                : Maybe(null); // Nothing
        };
        expect(
            Maybe(20)
                .flatMap(halfIt) // Just 20 -> Just 10
                .flatMap(halfIt) // Just 10 -> Just 5
                .flatMap(halfIt) // Just 5 -> Nothing
                .isNothing()
        ).to.equal(true);
    });
});