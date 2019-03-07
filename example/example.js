import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import withReactHooks from '../src/index';

const Counter = withReactHooks(
    class Counter extends React.Component {
        constructor() {
            super();
            this.state = {
                count: 0
            };
        }

        increment(amount) {
            this.setState(({ count }) => ({
                count: count + amount
            }));
        }

        render() {
            const [count, setCount] = useState(0);
            const increment = amount => setCount(count => count + amount);

            useEffect(() => {
                const interval = setInterval(() => {
                    this.increment(1);
                }, 1000);

                return () => clearInterval(interval);
            }, []);

            return (
                <div>
                    <div>
                        State:
                        <button onClick={() => this.increment(-1)}>-</button>
                        {this.state.count}
                        <button onClick={() => this.increment(1)}>+</button>
                    </div>
                    <div>
                        Hook:
                        <button onClick={() => increment(-1)}>-</button>
                        {count}
                        <button onClick={() => increment(1)}>+</button>
                    </div>
                </div>
            );
        }
    }
);

const rootElement = document.getElementById('app');
ReactDOM.render(<Counter />, rootElement);
