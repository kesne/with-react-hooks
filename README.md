# 🎣 with-react-hooks 🎣

## Production Ready for Enterprise Applications

**Don't let the React team control your life. Take back control.**

I love hooks, but it kind of sucks that they can't be used in class components. But we can fix that! This package exposes an HOC `withReactHooks`, that allows any hook to be used inside of a class component.

This uses **actual react hooks**, not just an imitation. You can directly import and use the hooks provided by the react package. This only adds one component to your tree, and is very easy to debug.

## Installing

You probably shouldn't, but if you want to:

```bash
$ npm install with-react-hooks
```

## Usage

```jsx
import React, { useState } from 'react';
import withReactHooks from 'with-react-hooks';

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

// Wrap with `withReactHooks` to add hook support:
export default withReactHooks(Counter);
```

## Project Goals

When creating this project, I tried to keep these goals in mind:

- Put hooks in classes no matter the cost.
- Use real React hooks. No imitations, no passing props, no custom imports.
- Support any custom hooks.
- Support all normal class garbage.
- Adding support to existing classes should just be one line of code (a single wrapper on the class).
- For ease of debugging should maintain as much structure of the original component as possible.
