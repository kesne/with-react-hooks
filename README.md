# with-react-hooks

I love hooks, but it kind of sucks that they can't be used in class components. But we can fix that! This package exposes an HOC `withReactHooks`, that allows any hook to be used inside of a class component.

This uses **actual react hooks**, not just an imitation. You can directly import and use the hooks provided by the react package.

## Installing

You probably shouldn't, but if you want to:

```bash
$ npm install with-react-hooks
```

## Usage

```jsx
import React, { useState } from 'react';
import withReactState from 'with-react-hooks';

class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
    }

    render() {
        const [name, setName] = useState('');

        return (
            <div>
                {this.state.count}
                <button onClick={() => this.setState({ count: this.state.count + 1 })}>
                    +
                </button>

                <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
        );
    }
}

// Wrap with `withReactState` to add hook support:
export default withReactState(Counter);
```
