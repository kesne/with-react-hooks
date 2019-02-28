const React = require('react');

export default function withReactHooks(OriginalComponent) {
    const actualRender = OriginalComponent.prototype.render;

    OriginalComponent.prototype.render = function() {
        const { ____HooksProvider: HooksProvider } = this.props;
        return <HooksProvider instance={this} />;
    };

    return function WithReactHooks(props) {
        const HooksProvider = React.useMemo(() => {
            const HP = function HooksProvider({ instance }) {
                if (!instance) {
                    return null;
                }

                return actualRender.call(instance);
            };

            HP.displayName = 'HooksProvider';

            return HP;
        }, []);

        return React.createElement(
            OriginalComponent,
            Object.assign({}, props, {
                ____HooksProvider: HooksProvider
            })
        );
    };
}
