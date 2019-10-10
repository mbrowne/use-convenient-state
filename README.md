# use-convenient-state

## DEPRECATED

This hook can cause issues with stale references, and doesn't follow React's intended usage of state when using hooks. I am no longer using it and I don't recommend using it.

Instead, you can consider snippets for your IDE that make it faster and easier to declare new state variables, e.g.:
https://marketplace.visualstudio.com/items?itemName=AlDuncanson.react-hooks-snippets

---

Experimental React hook to make it more convenient to initialize multiple state values at once.

## Usage

Example:

```js
const state = useConvenientState({
    name: 'Bob',
    age: 37,
})
...
// the following stage changes both trigger a re-render
state.name = 'Sally'
...
state.setAge(prevAge => prevAge + 1)
```

To use explicit `set` methods only, set the `createGettersSetters` argument to false:

```js
const state = useConvenientState(
    {
        name: 'Bob',
        age: 37,
    },
    false
)
state.setName('Sally')
state.name = 'Fred' // TypeError: Cannot assign to read only property 'name'
```

NOTE: Due to implementation details of returning the state object, usage of `createGettersSetters==false` requires the ES2017 method [`Object.getOwnPropertyDescriptors`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors) (plural).
