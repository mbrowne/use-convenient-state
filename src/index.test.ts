import { renderHook, act } from 'react-hooks-testing-library'
import useConvenientState from './index'

const initialState = {
    age: 42,
    fruit: 'banana',
    todos: [{ text: 'Try useConvenientState()' }],
}

test('reading state', () => {
    const { result } = renderHook(() => useConvenientState(initialState))
    expect(result.current).toEqual(expect.objectContaining(initialState))
})

test('mutating state with implicit setter', () => {
    const { result } = renderHook(() => useConvenientState(initialState))
    act(() => {
        const state = result.current
        state.fruit = 'orange'
        state.todos = [...state.todos, { text: 'Mow lawn' }]
    })
    expect(result.current.age).toBe(42)
    expect(result.current.fruit).toBe('orange')
    expect(result.current.todos[1]).toEqual({ text: 'Mow lawn' })
})

test('mutating state with explicit setter', () => {
    const { result } = renderHook(() => useConvenientState(initialState))
    act(() => {
        const state = result.current
        state.setFruit('orange')
        state.setTodos([...state.todos, { text: 'Mow lawn' }])
    })
    expect(result.current.age).toBe(42)
    expect(result.current.fruit).toBe('orange')
    expect(result.current.todos[1]).toEqual({ text: 'Mow lawn' })
})

test('mutating state with callback setter', () => {
    const { result } = renderHook(() => useConvenientState(initialState))
    act(() => {
        const state = result.current
        state.setAge((prevAge: number) => prevAge + 1)
    })
    expect(result.current.age).toBe(43)
})

test('respects `createGettersSetters` option', () => {
    const { result } = renderHook(() => useConvenientState(initialState, false))
    expect(() => {
        act(() => {
            const state = result.current
            state.fruit = 'orange'
        })
    }).toThrow(
        "Cannot assign to read only property 'fruit' of object '[object Object]'"
    )
})
