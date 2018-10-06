/* Fibonacci::
   F(n) = {
       0                    if n = 0;
       1                    if n = 1;
       F(n - 1) + F(n - 2)  if n > 1;

    "every number after the first two is the sum of the two preceding ones" --
    https://en.wikipedia.org/wiki/Fibonacci_number

    The first 21 Fibonacci numbers Fn for n = 0, 1, 2, …, 20 are:
    F0	F1	F2	F3	F4	F5	F6	F7	F8	F9	F10
    0	1	1	2	3	5	8	13	21	34	55

    F11	F12	F13	F14	F15	F16	F17	 F18  F19  F20
    89	144	233	377	610	987	1597 2584 4181 6765
    -- https://en.wikipedia.org/wiki/Fibonacci_number
*/

// Normal fibonacci:: int -> int
export const fibonacciRecursive = (n) => {
    if (n === 0) return 0;
    if (n === 1) return 1;
    if (n > 1) return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
    else return undefined;
};

// Manual tail recursive optimized:: int -> int
export const fibonacciTailCalled = (n) => fibonacciTailCalledHelper(n, 0, 1);
const fibonacciTailCalledHelper = (
    n,
    currentFibonacciSequence,
    nextFibonacciSequence
) => {
    if (n === 0) return currentFibonacciSequence;
    if (n > 0) {
        return fibonacciTailCalledHelper(
            n - 1,
            nextFibonacciSequence,
            currentFibonacciSequence + nextFibonacciSequence
        );
    }
    return undefined;
};

const memoizeFn = (fn) => {
    const cache = Object.create(null);
    return (...args) => {
        const key = JSON.stringify(args); // ~2 ms slower at 1000 iterations without normailise the key
        if (key in cache) {
            return cache[key];
        }
        const result = fn.apply(null, args);
        cache[key] = result;
        return result;
    };
};

// Memoized normal (no tail recuse optimized) fibonacci:: int -> int
export const memoizedFibonacciRecursive = memoizeFn(n => {
    if (n === 0) return 0;
    if (n === 1) return 1;
    if (n > 1) return memoizedFibonacciRecursive(n - 1) + memoizedFibonacciRecursive(n - 2);
    else return undefined;
});

// Generator function
export function* fibonacciGenerator() {
    let fn1 = 0;
    let fn2 = 1;
    while (true) {
        const current = fn1;
        fn1 = fn2;
        fn2 = current + fn1; // old fn1 + fn2
        yield current;
    }
}
