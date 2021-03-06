---
title: The Power of Reduce
author: Matt Brophy
postDate: 2019-01-28
tags: javascript
---

The [Array.prototype.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) method is one of those methods that is unnecessarily frightening at first glance. It's something that I myself was uncomfortable with for much longer than needed early on in my career. If you find yourself in that position, I hope this article helps change that.

As I've worked with `reduce` more and more, I am continually amazed that 10+ years into my professional Javascript career, I'm still discovering new ways to use `reduce`. Additionally, I'm finding myself turning to it in situations where it wouldn't have occurred to me in the past.

According to [Merriam-Webster](https://www.merriam-webster.com/dictionary/reduce), "reduce" is defined as:

> to draw together or cause to converge

I think this is a great starting point to explaining and understanding the Javascript `reduce` method. It takes an Array (many values) and returns a single value. This single value is generated by running a callback function on each entry of the array and "accumulating" each value of the array along the way into a stateful variable often referred to as the `accumulator`, or `acc`.

Let's look at the function signature:

```js
arr.reduce(callback[, initialValue])
```

This brings us to one of the first big gotcha's that I've found over time, and an area where people often get tripped up. I'll just put this out there now: _always, always, always use an initial value_. At the very least, always use one until you've really grasped `reduce`, and then maybe consider skipping it. In my experience, that makes the cognitive overhead much less, and we'll only use that format in this post. Maybe I'll write a follow up sometime on not using an `initialValue`, but honestly - I do it so infrequently, that it may not be worth a post.

Now let's check out a very simple example. Let's assume we want to add up an array of numbers:

```js
const arr = [1, 2, 3, 4];
```

If we wanted to add these together manually, we might write something like:

```js
let sum = 0;
sum += arr[0];
sum += arr[1];
sum += arr[2];
sum += arr[3];
```

Hmm, that doesn't really scale to arrays of differing lengths - it looks like we probably want to use a loop:

```js
let sum = 0;
for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
}
```

That's much better. Or is it? If you've been using a library like [lodash](https://lodash.com/), you may have began writing fewer and fewer `for` loops a while ago, but with the rise of ES6, chances are you're writing less of them now. Almost to the point that they might start to feel like _"code smell."_ Why write a `for` loop when we can avoid those off-by-one errors using `forEach`? Let's take a look at the altered version of this using `forEach`:

```js
let sum = 0;
arr.forEach((v) => (sum += v));
```

Neat! Even smaller, no iteration variables to worry about. This is where I stopped for a long time. But that's only because I wasn't seeing _"the pattern."_

Recall our definition earlier of reducing many values to a single value, and then look more closely at this `forEach` loop. We start with many values (`arr`) and we end with a single value (`sum`). So we're in a prime spot to use `reduce`. Let's see what that would look like:

```js
const sum = arr.reduce((acc, v) => acc + v, 0);
```

As an added benefit, we also get rid of the closure-scoped `sum` variable access! But what exactly is happening here? Let's break it down.

First off, the `callback()` function that you supply to `reduce` accepts 4 parameters, but in our current case, only the first 2 are relevant:

```js
callback(accumulator, currentValue);
```

The `currentValue` is the current value of the array being iterated over - the same argument you'd get in a `forEach` loop. And in this case, the `accumulator` is the ever-growing `sum` variable from our `forEach` example.

Secondly, we're using an `initialValue` of 0 - which is what we'll initialize our accumulator with. Let's see how this looks step by step if we unroll it:

```js
// Define our callback function
function add(accumulator, currentValue) {
    return accumulator + currentValue;
}

// Initialization: accumulator = initialValue
accumulator0 = 0;

// Iteration 0
accumulator1 = add(accumulator0, arr[0]);

// Iteration 1
accumulator2 = add(accumulator1, arr[1]);

// Iteration 2
accumulator3 = add(accumulator2, arr[2]);

// Iteration 3
accumulator4 = add(accumulator3, arr[3]);
```

See how the reduce is just a series of calling the same function over and over, passing the result of the prior execution in as the accumulator of the next execution? That's how we're doing the accumulation - modifying the accumulator in each step, and passing it to the next step. To me, `reduce` is all about remembering to:

-   Always provide an initial value
-   Always return an `accumulator`, modified if needed

What if we wanted to only act on _some_ of our array values? That's easy, we can no-op in a reducer function by just returning the input `accumulator`. Let's take a look at adding only the even numbers in an array:

```js
const arr = [1, 2, 3, 4, 5];
const evenSum = arr.reduce((acc, v) => {
    if (v % 2 === 0) {
        // Number is eve, add it
        return acc + v;
    } else {
        // Number is odd, skip it
        return acc;
    }
}, 0); // <-- Don't forget the initialValue!

// And in a more terse manner:
const evenSum = arr.reduce((acc, v) => (v % 2 === 0 ? acc + v : acc), 0);
```

## Advanced Usage

Now that we've seen the basics of reduce, let's take a look at some of the more advanced use-cases I've found useful in the past. For each example, I'll show a more verbose, but more explicit method, as well as one or more less-verbose methods. There's no right or wrong way to use these, it will all depend on personal and team preference, and comfortability with the reduce method, and other ES6 functionality.

### Indexing an array of items by a key

```js
const items = [
    { userId: '1', firstName: 'Matt' },
    { userId: '2', firstName: 'Jane' },
    { userId: '3', firstName: 'Bob' },
];

// Reduce into an empty object, adding each user in a key/value pair
const userMap = items.reduce((acc, item) => {
    acc[item.userId] = item;
    return acc;
}, {});

// Less-verbose approach:
const userMap = items.reduce(
    (acc, item) =>
        Object.assign(acc, {
            [item.userId]: item,
        }),
    {}
);

// userMap:
// {
//   '1': { id: '1', firstName: 'Matt' }
//   '2': { id: '2', firstName: 'Jane' }
//   '3': { id: '3', firstName: 'Bob' }
// }
```

### Grouping/Chunking Arrays

Let's say we want to look through an array of items, and group them by some shared characteristic.

```js
const arr = [1, 2, 3, 4, 5, 6];

// Reduce into an object that will have an "even" array and an "odd" array
const evensAndOdds = arr.reduce(
    (acc, v) => {
        if (v % 2 === 0) {
            acc.even.push(v);
        } else {
            acc.odd.push(v);
        }
        return acc;
    },
    { even: [], odd: [] }
);

// Slightly less verbose?
const evensAndOdds = arr.reduce(
    (acc, v) =>
        v % 2 === 0
            ? {
                  even: acc.even.concat([v]),
                  odd: acc.odd,
              }
            : {
                  even: acc.even,
                  odd: acc.odd.concat([v]),
              },
    { even: [], odd: [] }
);

// Less verbose, no initial structure
const evensAndOdds = arr.reduce((acc, v) => {
    const key = v % 2 === 0 ? 'even' : 'odd';
    acc[key] = (acc[key] || []).concat([v]);
    return acc;
}, {});

// evensAndOdds:
// {
//     even: [2, 4, 6],
//     odd: [1, 3, 5],
// }
```

### Mapping Object Values

```js
const obj = {
    foo: 1,
    bar: 2,
    baz: 3,
};

const valuesSquared = Object.keys(obj).reduce(
    (acc, k) => Object.assign(acc, { [k]: obj[k] * obj[k] }),
    {}
);

// Using Object.entries and array destructuring
const valuesSquared = Object.entries(obj).reduce(
    (acc, [k, v]) => Object.assign(acc, { [k]: v * v }),
    {}
);

// valuesSquared:
// {
//     foo: 1,
//     bar: 4,
//     baz: 9
// }
```

### Sequential Asynchronous Promise Chains

Ever find yourself needing to perform a series of sequential, but asynchronous actions based on an input array of data? We can reduce that array onto a single promise chain!

```js
// Dummy async function that we want to run for a handful of IDs
function doSomethingAsyncForId(id) {
    return new Promise((resolve) => setTimeout(resolve, 1000));
}

const ids = [1, 2, 3];
ids.reduce(
    (acc, id) => acc.then(() => doSomethingAsyncForId(id)),
    Promise.resolve()
);
```

As you can see - there are lots of use cases for reduce, but they all follow that same pattern of turning many values into one value.

Happy Reducing!

For additional reading, Sarah Drasner also has a great article on reducers over on CSS Tricks - [Understanding the Almighty Reducer](https://css-tricks.com/understanding-the-almighty-reducer/).
