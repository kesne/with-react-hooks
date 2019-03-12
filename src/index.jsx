import React from 'react';
import toHooks from './toHooks';

export { toHooks };

export default function withReactHooks(OriginalComponent) {
    const actualRender = OriginalComponent.prototype.render;

    function HooksProvider(props) {
        if (!props.instance) {
            return null;
        }

        return actualRender.call(props.instance);
    }

    const componentName = OriginalComponent.displayName || OriginalComponent.name || 'Component';
    HooksProvider.displayName = componentName + 'Hooks';

    OriginalComponent.prototype.render = function() {
        return <HooksProvider instance={this} />;
    };

    return OriginalComponent;
}
