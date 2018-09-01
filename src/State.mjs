/*
 * State Monad
 */

 // State s a = State { runState:: s -> (a, s) }
export const State = stateFn => ({
    // fmap:: (a -> b) -> State s a -> State s b
    // fmap:: (a -> b) -> (s -> (a, s)) -> (s -> (b, s))
    fmap: f => State(state => {
        const unwrappedValueState = stateFn(state);
        return {value: f(unwrappedValueState.value), state: unwrappedValueState.state};
    }),
    // apply:: State s (a -> b) -> State s a -> State s b
    // apply:: (s -> ((a -> b), s)) -> (s -> (a, s)) -> (s -> (b, s))
    apply: otherState => State(state => {
        // Assume `this state`'s value is a function
        const thisNewValueState = stateFn(state);
        const otherNewValueState = otherState.runState(thisNewValueState.state);
        return {
            value: thisNewValueState.value(otherNewValueState.value),
            state: otherNewValueState.state
        };
    }),
    // bind:: State s a -> (a -> State s b) -> State s b    operator:>>=
    // bind:: (s -> (a, s)) -> (a -> s -> (b, s)) -> (s -> (b, s))
    flatMap: aToState => {
        return State(state => {
            const newValueState = stateFn(state);
            const finalValueState = aToState(newValueState.value).runState(newValueState.state);
            return {value: finalValueState.value, state: finalValueState.state};
        });
    },
    // runState:: s -> (a, s)  # runState unwraps the function in the State context
    runState: state => stateFn(state),
    // put:: s -> State s ()
    // put:: s -> (_ -> ((), s)
    put: newState => State(_ => ({value: null, state: newState})),
    // putAndKeepValue:: s -> State s ()
    // putAndKeepValue:: s -> (s' -> (a', s))
    putAndKeepValue: newState => State(state => {
        const valueState = stateFn(state);
        return {value: valueState.value, state: newState};
    }),
    // get:: State s s
    // get:: _ -> (s -> (s, s))
    get: _ => State(state => ({value: state, state: state})),
});
// return:: a -> State s a  !! State s a ::aka (s -> (a, s))
// return:: a -> (s -> (a, s))
State.return = value => State(state => ({value, state}));
