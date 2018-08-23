
export const Maybe = value => ({
    value,
    // fmap:: (a -> b) -> f a -> f b
    fmap: f => Maybe(f(value)),
    // apply:: f (a -> b) -> f a -> f b
    apply: fA =>  Maybe(value(fA.value)),
    // bind:: m a -> (a -> m b) -> m b    operator:>>=
    flatMap: aToMonad => Maybe(aToMonad(value).value),
});
// return:: a -> f a
Maybe.return = value => Maybe(value);