const React = require('react');

module.exports = function withReactHooks(OriginalComponent) {
    var actualRender = OriginalComponent.prototype.render;

    function HooksProvider(props) {
        if (!props.instance) {
            return null;
        }

        return actualRender.call(props.instance);
    }

    var componentName = OriginalComponent.displayName || OriginalComponent.name || 'Component';
    HooksProvider.displayName = componentName + 'Hooks';

    OriginalComponent.prototype.render = function() {
        return React.createElement(HooksProvider, { instance: this }, null);
    };

    return OriginalComponent;
}
