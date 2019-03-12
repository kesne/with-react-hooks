import React, { useRef, useState, useMemo, useCallback, useEffect, useLayoutEffect } from 'react';

export default function toHooks(Component) {
    if (Component.getDerivedStateFromError || Component.prototype.componentDidCatch) {
        throw new Error('Error boundaries are not supported in this implementation of toHooks.');
    }

    const {
        componentWillMount,
        UNSAFE_componentWillMount,
        componentDidMount,
        UNSAFE_componentWillReceiveProps,
        componentWillReceiveProps,
        UNSAFE_componentWillUpdate,
        componentWillUpdate,
        componentDidUpdate,
        componentWillUnmount,
        shouldComponentUpdate,
        getSnapshotBeforeUpdate,
        render,
        isPureReactComponent
    } = Component.prototype;

    const { getDerivedStateFromProps, defaultProps } = Component;

    if (shouldComponentUpdate) {
        console.warn(
            'Using shouldComponentUpdate with hooks will prevent your component from updating when Hooks change. Instead, we recommend having your class extend `React.PureComponent`.'
        );
    }

    const willMount = UNSAFE_componentWillMount || componentWillMount;
    const willRecieveProps = UNSAFE_componentWillReceiveProps || componentWillReceiveProps;
    const willUpdate = UNSAFE_componentWillUpdate || componentWillUpdate;

    function WithReactHooks(internalProps) {
        const mergedProps = { ...internalProps, ...(defaultProps || {}) };
        const hasRendered = useRef(false);
        const memoRender = useRef(null);
        const skipRender = useRef(false);
        const snapshot = useRef();
        const callbacks = useRef(new Set());
        // @ts-ignore Yolo
        const [backingInstance] = useState(() => new Component(mergedProps));
        const state = useRef(backingInstance.state);
        const [, setForceRender] = useState(0);

        const prevProps = useRef(mergedProps);
        const prevState = useRef(state.current);

        useEffect(() => {
            prevProps.current = mergedProps;
            prevState.current = state.current;
        });

        const classForceUpdate = useCallback(callback => {
            if (callback) {
                callbacks.current.add(callback);
            }
            setForceRender(val => val + 1);
        });

        const performSetState = useCallback(nextState => {
            if (typeof nextState === 'function') {
                state.current = {
                    ...state.current,
                    ...nextState(state.current)
                };
            } else {
                state.current = {
                    ...state.current,
                    ...nextState
                };
            }
        });

        const classSetState = useCallback((nextState, callback) => {
            performSetState(nextState);
            classForceUpdate(callback);
        });

        useMemo(() => {
            if (hasRendered.current) {
                willRecieveProps.call(backingInstance, mergedProps);
            }
        }, [internalProps]);

        skipRender.current =
            hasRendered.current &&
            shouldComponentUpdate &&
            !shouldComponentUpdate.call(backingInstance, mergedProps, state.current);

        if (willUpdate && hasRendered.current && !skipRender.current) {
            willUpdate.call(backingInstance, mergedProps, state.current);
        }

        // Sync values in:
        backingInstance.setState = classSetState;
        backingInstance.forceUpdate = classForceUpdate;
        backingInstance.props = mergedProps;
        backingInstance.state = state.current;

        useMemo(() => {
            if (willMount) {
                willMount.call(backingInstance);
            }

            return () => {
                if (componentWillUnmount) {
                    componentWillUnmount.call(backingInstance);
                }
            };
        }, []);

        useLayoutEffect(() => {
            if (componentDidMount) {
                componentDidMount.call(backingInstance);
            }
        }, []);

        useLayoutEffect(() => {
            if (!hasRendered.current) {
                hasRendered.current = true;
            } else {
                if (componentDidUpdate) {
                    componentDidUpdate.call(
                        backingInstance,
                        prevProps.current,
                        prevState.current,
                        snapshot.current
                    );
                }
            }
            if (callbacks.current.size > 0) {
                callbacks.current.forEach(callback => callback());
                callbacks.current.clear();
            }
        });

        if (skipRender.current) {
            // I need to call render here to keep the number of hooks the same, but I just throw away the value:
            render.call(backingInstance);
            return memoRender.current;
        }

        if (getDerivedStateFromProps) {
            const derivedState = getDerivedStateFromProps(mergedProps, state.current);
            if (derivedState) {
                performSetState(derivedState);
                // Re-sync to the instance.
                backingInstance.state = state.current;
            }
        }

        if (getSnapshotBeforeUpdate) {
            snapshot.current = getSnapshotBeforeUpdate.call(
                backingInstance,
                prevProps.current,
                prevState.current
            );
        }

        memoRender.current = render.call(backingInstance);
        return memoRender.current;
    }

    WithReactHooks.displayName = Component.displayName || Component.name;

    if (isPureReactComponent) {
        return React.memo(WithReactHooks);
    } else {
        return WithReactHooks;
    }
}
