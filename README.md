# use-convenient-state

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
