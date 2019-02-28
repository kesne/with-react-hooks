const React = require('react');

export default function withReactHooks(OriginalComponent) {
    const actualRender = OriginalComponent.prototype.render;

    OriginalComponent.prototype.render = function() {
        const { ____HooksProvider: HooksProvider } = this.props;
        return <HooksProvider />;
    };

    return function WithReactHooks(props) {
        const [instance, setInstance] = React.useState(null);
        const HooksProvider = React.useMemo(() => {
            const HP = function HooksProvider() {
                if (!instance) {
                    return null;
                }

                return actualRender.call(instance);
            };

            HP.displayName = 'HooksProvider';

            return HP;
        }, [instance]);

        return React.createElement(
            OriginalComponent,
            Object.assign({}, props, {
                ref: function ref(_ref) {
                    return setInstance(_ref);
                },
                ____HooksProvider: HooksProvider
            })
        );
    };
}
