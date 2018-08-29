
export const State = stateFn => ({
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
    put: state => State(_ => ({value: null, state: state})),
    // get:: State s s
    // get:: _ -> (s -> (s, s))
    get: _ => State(state => ({value: state, state: state})),
});
// return:: a -> State s a  !! State s a ::aka (s -> (a, s))
// return:: a -> (s -> (a, s))
State.return = value => State(state => ({value: value, state: state}));

console.log(State.return(1).runState(2));
console.log(
    State.return(1)
        .flatMap(n => State(state => ({value: n + 1, state: state})))
        .flatMap(n => State(state => ({value: n + 1, state: state + 1})))
    .runState(2)
);