/*
 * Identity Monad
 */

export const Identity = value => ({
    // fmap:: (a -> b) -> f a -> f b
    fmap: f => Identity(f(value)),
    // apply:: f (a -> b) -> f a -> f b
    apply: fA =>  Identity(value(fA.flatten())),
    // bind:: m a -> (a -> m b) -> m b    operator:>>=
    flatMap: aToMonad => Identity(aToMonad(value).flatten()),
    // flatten:: m a -> a
    flatten: () => value
});
// return:: a -> m a
Identity.return = value => Identity(value);
