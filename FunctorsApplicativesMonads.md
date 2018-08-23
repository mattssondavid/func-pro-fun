# Good references
* http://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html
* https://fsharpforfunandprofit.com/posts/elevated-world-2/
* http://learnyouahaskell.com/a-fistful-of-monads

Monads are extension of Functors and Applicatives. All monads are functors, but
functors are not monads.

Functional calls: f(a) === f a; f(g(a)) === f(g a); Functional declaration loves
to ommit parantheses wherever applicable. f g a means f(g)(a).

# Functors functions
## fmap:: (a -> b) -> f a -> f b
__Alias__: map, lift

__Description__: fmap takes a function that can put any value into a context.
This context "wraps" the value, and can often be viewed as a kind of box into
which you put the value.

Fmap takes a function `(a -> b)` then a functor `f a` and finally returns a new
functor `f b`. A functor is a type constructor, e.g. Maybe, Id, Some, Number...

__Why needed__: Because a Functor wraps a value (the value is in a context) you
cannot apply normal function to the value. Fmap is used to unwrap the value
from its context, apply the function upon the value, and then put the result of
the function value back into a container by context wrapping the value. The result
will be a new functor of the same context type. Map is also used to do
functors composition.

__Laws that must be followed__: Law of Identity, Law of Composition
Laws of Identity: fmap id = id
Mapping id over a functorial value must return the functorial value unchanged

Laws of Composition: fmap (g . f) = fmap g . fmap f
Should not matter how we compose the functions

## return:: a -> f a
__Alias__: pure, unit, yield, point, of

__Description__: Return lifts a single value into a context (a functor).

__Why needed__: It is the function that wraps a value into a context.
Laws that must be followed: Law of Identity

# Applicatives functions
## apply:: f (a -> b) -> f a -> f b
__Alias__: ap, <*>

__Description__: Apply unwraps a function wrapped inside a wrapped value into a
wrapped function. Apply is an "Applicative", which extends the Functor type constructor.

Apply takes a function inside a context `f(a -> b)` then a value in context (functor)
`f a`. It then unwraps both the function and value and applies the function to
the value, and finally puts the resulting value back into context and return this
new value in context (functor) `f b`.

__Why needed__: When a value is wrapped in a context and the function (to apply)
is also wrapped in a context too, then apply can "apply" the wrapped function
on the wrapped value.

Apply, together with Return, is more "powerful" than fmap. This is because you
can construct fmap from apply and return, but not vice versa. To construct a
wrapped (lifted) function you use return on the normal function and then you
use apply. This gives the same result as if you used map on the function in the
first place.

__Laws that must be followed__: Law of Identity, Law of Homomorphism, Law of Interchange, Law of Composition

# Monads functions
## bind:: m a -> (a -> m b) -> m b
__Alias__: flatMap, andThen, collect, selectMany, >>=

__Description__: Allows composing of wrapped values "shoved" into wrapped functions.
As in, you can compose monads together by composing the functions wrapped into
their contexts, where a monad (m) is a type constructor.

Bind takes a monad `m a` and a function that can return a monad `(a -> m b)`,
and returns a monad `m b`. Bind firts unwraps the value from the input monad's
context. Then it applies the input function on this value and finally puts the
resulting value back into context and return this new value in context (monad) `m b`.

__Why needed__: It allows composition between two monads of similar context.

Bind, together with Return, is more "powerful" than Apply and Return. This is
because if you Bind and Return you can construct both fmap and Apply from them.
You cannot, however, construct bind from just Apply and Return.

__Laws that must be followed__: Law of Identity, Law of Associativity
