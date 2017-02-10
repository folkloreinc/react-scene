import React from 'react';
import { shallow, mount } from 'enzyme';

import Scene from '../__mocks__/Scene';
import ChildScene from '../__mocks__/ChildScene';

describe('createScene', () => {
    test('return <ReactScene />', () => {
        const wrapper = shallow(<Scene />);
        expect(wrapper.name()).toEqual('ReactScene');
    });

    test('contains the wrapped <Scene />', () => {
        const wrapper = shallow(<Scene />);
        expect(wrapper.find(Scene.SceneComponent)).toHaveLength(1);
    });

    test('passes scene context as prop to <Scene />', () => {
        const wrapper = mount(<Scene />);
        expect(wrapper.find(Scene.ChildComponent).prop('scene')).toEqual(expect.any(Object));
    });

    test('passes scene context as prop to <Scene /> with methods', () => {
        const wrapper = mount(<Scene />);
        expect(wrapper.find(Scene.ChildComponent).prop('scene')).toEqual(expect.objectContaining({
            play: expect.any(Function),
        }));
    });

    test('contains <ChildScene />', () => {
        const wrapper = mount(<Scene />);
        expect(wrapper.find(ChildScene.ChildComponent)).toHaveLength(1);
    });

    test('passes parent to <ChildScene />', () => {
        const wrapper = mount(<Scene />);
        const scene = wrapper.find(Scene.ChildComponent).prop('scene');
        expect(wrapper.find(ChildScene.ChildComponent).prop('scene')).toEqual(expect.objectContaining({
            parent: scene,
        }));
    });
});
