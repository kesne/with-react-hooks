# 🎣 with-react-hooks 🎣 [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/facebook/react/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/react.svg?style=flat)](https://www.npmjs.com/package/react) [![Coverage Status](https://img.shields.io/coveralls/facebook/react/master.svg?style=flat)](https://coveralls.io/github/facebook/react?branch=master) [![CircleCI Status](https://circleci.com/gh/facebook/react.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/facebook/react) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://reactjs.org/docs/how-to-contribute.html#your-first-pull-request)

## Production Ready for Enterprise Applications

**Don't let the React team control your life. Take back control.**

I love hooks, but it kind of sucks that they can't be used in class components. But we can fix that! This package exposes an HOC `withReactHooks`, that allows any hook to be used inside of a class component.

This uses **actual react hooks**, not just an imitation. You can directly import and use the hooks provided by the react package.

:fire::fire::fire: Now featuring a new _**:fire:Blazing Fast:fire:**_ implemenation. This only adds one additional component to your tree.

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
