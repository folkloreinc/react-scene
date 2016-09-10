import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import ReactScene from '../src/ReactScene';
import Scene from './components/Scene';
import ChildScene from './components/ChildScene';

describe('createScene', () => {
    it('return <ReactScene />', () => {
        const wrapper = shallow(<Scene />);
        expect(wrapper.name()).to.equal('ReactScene');
    });
    
    it('contains the wrapped <Scene />', () => {
        const wrapper = shallow(<Scene />);
        expect(wrapper.find(Scene.SceneComponent)).to.have.length(1);
    });
    
    it('passes scene context as prop to <Scene />', () => {
        const wrapper = mount(<Scene />);
        expect(wrapper.find(Scene.SceneComponent).prop('scene')).to.be.an('object');
    });
    
    it('passes scene context as prop to <Scene /> with methods', () => {
        const wrapper = mount(<Scene />);
        expect(wrapper.find(Scene.SceneComponent).prop('scene')).to.have.property('play');
        expect(wrapper.find(Scene.SceneComponent).prop('scene').play).to.be.a('function');
    });
    
    it('contains <ChildScene />', () => {
        const wrapper = mount(<Scene />);
        expect(wrapper.find(ChildScene.SceneComponent)).to.have.length(1);
    });
    
    it('passes parent to <ChildScene />', () => {
        const wrapper = mount(<Scene />);
        var scene = wrapper.find(Scene.SceneComponent).prop('scene');
        expect(wrapper.find(ChildScene.SceneComponent).prop('scene')).to.have.property('parent');
        expect(wrapper.find(ChildScene.SceneComponent).prop('scene').parent).to.be.an('object');
        expect(wrapper.find(ChildScene.SceneComponent).prop('scene').parent).to.equal(scene);
    });
});
