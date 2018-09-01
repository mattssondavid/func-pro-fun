import chai from 'chai';
import tap from 'tap';

const mocha = tap.mocha;
const expect = chai.expect;

import {State} from './State';

mocha.describe('State', () => {
    mocha.it('wraps a value', () => {
        const makeState = value => State(state => ({value, state}));
        const aState = makeState(1);
        const theState = aState.runState(2);
        expect(theState.value).to.equal(1);
        expect(theState.state).to.equal(2);
    });

    mocha.it('returns', () => {
        const state = State.return(1).runState(2);
        expect(state.value).to.equal(1);
        expect(state.state).to.equal(2);
    });

    mocha.it('fmaps', () => {
        const state = State.return(1)
            .fmap(n => n + 1)
            .runState(2);
        expect(state.value).to.equal(2);
        expect(state.state).to.equal(2);

        const multi = State.return(1)
            .fmap(n => n + 1)
            .fmap(n => n * 2)
            .runState(2);
        expect(multi.value).to.equal(4);
        expect(multi.state).to.equal(2);
    });

    mocha.it('applies', () => {
        const simple = State.return(n => n + 1)
            .apply(State.return(1))
            .runState(2);
        expect(simple.value).to.equal(2);
        expect(simple.state).to.equal(2);

        const multi = State.return(a => b => a + b)
            .apply(State.return(1))
            .apply(State.return(2))
            .runState(2);
        expect(multi.value).to.equal(3);
        expect(multi.state).to.equal(2);

        const mutateValueAndState = State.return(n => n + 1)
            .apply(State(state => ({value: 1, state: state + 1})))
            .runState(2);
        expect(mutateValueAndState.value).to.equal(2);
        expect(mutateValueAndState.state).to.equal(3);
    });

    mocha.it('binds aka. flatMaps', () => {
        const state = State.return(1)
            .flatMap(n => State(state => ({value: n + 1, state})))
            .flatMap(n => State(state => ({value: n + 1, state})))
            .runState(2);
        expect(state.value).to.equal(3);
        expect(state.state).to.equal(2);

        const mutateValueAndState = State.return(1)
            .flatMap(n => State(state => ({value: n + 1, state})))
            .flatMap(n => State(state => ({value: n + 1, state: state + 1})))
            .runState(2);
        expect(mutateValueAndState.value).to.equal(3);
        expect(mutateValueAndState.state).to.equal(3);
    });

    mocha.it('puts', () => {
        const state = State.return(1)
            .put(5)
            .runState(2);
        expect(state.value).to.equal(null);
        expect(state.state).to.equal(5);
    });

    mocha.it('puts but keeps value', () => {
        const state = State.return(1)
            .putAndKeepValue(5)
            .runState(2);
        expect(state.value).to.equal(1);
        expect(state.state).to.equal(5);
    });

    mocha.it('gets', () => {
        const state = State.return(1)
            .get()
            .runState(2);
        expect(state.value).to.equal(2);
        expect(state.state).to.equal(2);
    });
});