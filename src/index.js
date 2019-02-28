const React = require('react');

export default function withReactHooks(OriginalComponent) {
    const actualRender = OriginalComponent.prototype.render;

    function HooksProvider({ instance }) {
        if (!instance) {
            return null;
        }

        return actualRender.call(instance);
    }

    const componentName = OriginalComponent.displayName || OriginalComponent.name || 'Component';
    HooksProvider.displayName = `${componentName}Hooks`;

    OriginalComponent.prototype.render = function() {
        return <HooksProvider instance={this} />;
    };

    return OriginalComponent;
}
