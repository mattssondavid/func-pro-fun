/*
 * Maybe Monad
 */

// data Maybe a = Just a | Nothing
export const Maybe = value => isNothing(value) ? Nothing() : Just(value);
// return:: a -> f a
Maybe.return = value => Maybe(value);

const isNothing = value => value === null || typeof value === 'undefined';

const Just = value => ({
    // fmap:: (a -> b) -> f a -> f b
    fmap: f => Maybe(f(value)),
    // apply:: f (a -> b) -> f a -> f b
    apply: fA =>  {
        if (typeof fA.flatten !== 'function') {
            return Nothing();
        }
        if (typeof fA.isNothing === 'function' && fA.isNothing() === true) {
            return Nothing();
        }
        return Maybe(value(fA.flatten()))
    },
    // bind:: m a -> (a -> m b) -> m b    operator:>>=
    flatMap: aToMonad => {
        const monadicB = aToMonad(value);
        if (typeof monadicB.isNothing === 'function'
            && monadicB.isNothing() === true
        ) {
            return Nothing();
        }
        if (typeof monadicB.flatten !== 'function') {
            return Nothing();
        }
        return Maybe(monadicB.flatten())
    },
    // flatten:: m a -> a
    flatten: _ => value,
    isNothing: _ => false,
});

const Nothing = () => ({
    fmap: _ => Nothing(),
    apply: _ => Nothing(),
    flatMap: _ => Nothing(),
    flatten: _ => {
        throw new Error('Nothing has no value');
    },
    isNothing: _ => true,
});
