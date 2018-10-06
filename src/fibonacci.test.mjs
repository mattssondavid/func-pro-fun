/*
  Run with "node --experimental-modules --no-warnings src/fibonacci.test.mjs | node_modules/.bin/tap -Rspec -"
*/
import chai from 'chai';
import tap from 'tap';

const mocha = tap.mocha;
const expect = chai.expect;

import * as fibonacci from './fibonacci';

const FIBONACCI_SEQUENCE = [
    0,      // F0
    1,      // F1
    1,      // F2
    2,      // F3
    3,      // F4
    5,      // F5
    8,      // F6
    13,     // F7
    21,     // F8
    34,     // F9
    55,     // F10
    89,     // F11
    144,    // F12
    233,    // F13
    377,    // F14
    610,    // F15
    987,    // F16
    1597,   // F17
    2584,   // F18
    4181,   // F19
    6765    // F20
];

const fibonacciSequenceTestMapped = (fn) => FIBONACCI_SEQUENCE.map((F, n) => {
    expect(fn(n)).to.equal(F);
});

mocha.describe('Fibonacci', () => {
    mocha.it('Normal recursive Fibonacci works (non tail-recursive optimized', () => {
        fibonacciSequenceTestMapped(fibonacci.fibonacciRecursive);
    });

    mocha.it('Fibonacci manually tail-recursive optimized works', () => {
        fibonacciSequenceTestMapped(fibonacci.fibonacciTailCalled);
    });

    mocha.it('Fibonacci memoized non-tail recursion optimized works', () => {
        fibonacciSequenceTestMapped(fibonacci.memoizedFibonacciRecursive);
    });

    mocha.it('Fibonacci generator function works', () => {
        const fibonacciGen = fibonacci.fibonacciGenerator();
        let n = 0;
        while (n < FIBONACCI_SEQUENCE.length) {
            const r = fibonacciGen.next();
            if (r.done) throw new Error('Generator terminated prematurely');
            expect(r.value).to.equal(FIBONACCI_SEQUENCE[n]);
            n = n + 1;
        };
    });
});

mocha.describe('Big F(n) executes within a finite time limit', () => {

    // The test does not terminate as it ought to at time-out therefore commentated out
    // mocha.it('Normal recursive Fibonacci can return before timeout', done => {
    //     setTimeout(_ => {
    //         throw new Error('The test is too slow')
    //     }, 1000);
    //     const f = fibonacci.fibonacciRecursive;
    //     expect(f(42)).to.equal(267914296);
    //     expect(f(81)).to.equal(37889062373143906);
    //     expect(f(82)).to.equal(61305790721611591);
    //     expect(f(83)).to.equal(99194853094755497);
    // });

    mocha.it('Fibonacci manually tail-recursive optimized can return before timeout', () => {
        const f = fibonacci.fibonacciTailCalled;
        expect(f(42)).to.equal(267914296);
        expect(f(81)).to.equal(37889062373143906);
        expect(f(82)).to.equal(61305790721611591); // Fails
        expect(f(83)).to.equal(99194853094755497); // Fails
    });

    mocha.it('Fibonacci memoized non-tail recursion optimized can return before timeout', () => {
        const f = fibonacci.memoizedFibonacciRecursive;
        expect(f(42)).to.equal(267914296);
        expect(f(81)).to.equal(37889062373143906);
        expect(f(82)).to.equal(61305790721611591); // Fails
        expect(f(83)).to.equal(99194853094755497); // Fails
    });

    mocha.it('Fibonacci generator function can return before timeout', () => {
        const fibonacciGen = fibonacci.fibonacciGenerator();
        let r = undefined;
        for (let n = 0; n <= 83; ++n) {
            r = fibonacciGen.next();
            // if (r.done) break;
            if (n === 42) expect(r.value).to.equal(267914296);
            if (n === 81) expect(r.value).to.equal(37889062373143906);
            if (n === 82) expect(r.value).to.equal(61305790721611591); // Fails
            if (n === 83) expect(r.value).to.equal(99194853094755497); // Fails
        }
    });
});