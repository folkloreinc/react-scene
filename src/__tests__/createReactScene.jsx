import React from 'react';
import { mount } from 'enzyme';

import createReactScene from '../createReactScene';

describe('createReactScene', () => {
    test('return <ReactScene />', () => {
        const Scene = createReactScene();
        const wrapper = mount(<Scene />);
        expect(wrapper.name()).toEqual('ReactScene');
    });

    test('contains the methods passed as first argument', () => {
        const Scene = createReactScene([
            'play',
        ]);
        const wrapper = mount(<Scene />);
        expect(wrapper.instance()).toEqual(expect.objectContaining({
            play: expect.any(Function),
        }));
        expect(Scene.propTypes.play).toEqual(React.PropTypes.func);
        expect(Scene.propTypes.sceneWillPlay).toEqual(React.PropTypes.func);
        expect(Scene.propTypes.sceneDidPlay).toEqual(React.PropTypes.func);
    });

    test('does not contains the methods not passed as first argument', () => {
        const Scene = createReactScene([
            'play',
        ]);
        const wrapper = mount(<Scene />);
        expect(wrapper.instance().play).toEqual(expect.any(Function));
        expect(Scene.propTypes.load).toBeUndefined();
        expect(Scene.propTypes.sceneWillLoad).toBeUndefined();
        expect(Scene.propTypes.sceneDidLoad).toBeUndefined();
    });
});
