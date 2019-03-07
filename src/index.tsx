import React from 'react';

type Props = {
    instance: React.Component;
};

export default function withReactHooks<T extends typeof React.Component>(OriginalComponent: T): T {
    const actualRender = OriginalComponent.prototype.render;

    // If you're mad that I'm typing the result here as `any`, then please submit a PR,
    // and then immedietly close it because I don't care what you think.
    function HooksProvider(props: Props): any {
        if (!props.instance) {
            return null;
        }

        return actualRender.call(props.instance);
    }

    // @ts-ignore Ugh, I promise accessing displayName is fine.
    const componentName = OriginalComponent.displayName || OriginalComponent.name || 'Component';
    HooksProvider.displayName = componentName + 'Hooks';

    OriginalComponent.prototype.render = function() {
        return <HooksProvider instance={this} />;
    };

    return OriginalComponent;
}
