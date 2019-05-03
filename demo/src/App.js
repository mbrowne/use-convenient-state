import React from 'react'
import useConvenientState from 'use-convenient-state'
import './App.css'

export default function App() {
    const state = useConvenientState({
        name: 'Bob',
        age: 37,
    })

    function handleNameChange(e) {
        state.name = e.target.value
    }

    function handleIncreaseAge() {
        state.setAge(prevAge => prevAge + 1)
    }

    return (
        <div className="App">
            <header className="App-header">
                <p>Name: {state.name}</p>
                <p>Age: {state.age}</p>
                <form onSubmit={e => e.preventDefault()}>
                    <p>
                        <input
                            type="text"
                            value={state.name}
                            onChange={handleNameChange}
                        />
                    </p>
                    <button onClick={handleIncreaseAge}>Increase Age</button>
                </form>
            </header>
        </div>
    )
}
