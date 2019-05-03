import { useRef, useReducer } from 'react'
import invariant from 'invariant'

type BasicStateAction<S> = ((state: S) => S) | S

// Copied from https://github.com/facebook/react/blob/c05b4b81f91c0b43a02e101d6a37b3de768f017b/packages/react-dom/src/server/ReactPartialRendererHooks.js#L244
function basicStateReducer<S>(state: S, action: BasicStateAction<S>) {
    return typeof action === 'function'
        ? (action as ((state: S) => S))(state)
        : action
}

export default function useConvenientState<
    TState extends { [key: string]: any }
>(
    initialState: TState,
    // Whether or not to create implicit getter/setter. When this option is disabled (false),
    // `state.foo = newValue` will not trigger a re-render.
    // (Also, when this option is disabled, direct mutations of the state object should be avoided.)
    createGettersSetters = true
) {
    invariant(
        typeof initialState === 'object',
        'useConvenientState() only works with objects'
    )
    const stateMeta = useRef({
        // For the type of `accessors`, `{ [key: string]: any }` is the best we can do in terms of type safety unless
        // TS adds a feature to address https://github.com/Microsoft/TypeScript/issues/12754.
        accessors: {} as TState & { [key: string]: any },
        rawValues: {} as TState,
        accessorsInitialized: false,
    }).current
    const { rawValues, accessorsInitialized, accessors } = stateMeta

    for (const key of Object.keys(initialState)) {
        // React's useState() hook is implemented using useReducer(), so rather than go through
        // useState(), we use useReducer() directly.
        //
        // We disable the eslint check since we're calling useReducer() within a loop. It's safe to
        // do that here because we know it will always be called the same number of times (and for the
        // same property names) on every render—the same end result as if the user called useReducer()
        // directly for each stateful value.
        //
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [val, setVal] = useReducer(basicStateReducer, initialState[key])
        if (createGettersSetters) {
            rawValues[key] = val
        } else {
            accessors[key] = val
        }

        if (!accessorsInitialized) {
            stateMeta.accessorsInitialized = true
            if (createGettersSetters) {
                Object.defineProperty(accessors, key, {
                    enumerable: true,
                    get: () => rawValues[key],
                    set: setVal,
                })
            }
            // We make explicit set methods even when createGettersSetters is true so that
            // React's callback API (e.g. `setFoo(oldState => { ... return newState })`)
            // is also available
            Object.defineProperty(accessors, 'set' + upperFirst(key), {
                value: setVal,
            })
        }
    }
    return accessors
}

function upperFirst(str: string) {
    return str[0].toUpperCase() + str.substring(1)
}
