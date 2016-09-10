import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import createReactScene from '../src/createReactScene';

describe('createReactScene', () => {
    it('return <ReactScene />', () => {
        const Scene = createReactScene();
        const wrapper = mount(<Scene />);
        expect(wrapper.name()).to.equal('ReactScene');
    });
    
    it('contains the methods passed as first argument', () => {
        const Scene = createReactScene([
            'play'
        ]);
        const wrapper = mount(<Scene />);
        expect(Scene).to.respondTo('play');
        expect(wrapper.type().propTypes.play).to.equal(React.PropTypes.func);
        expect(wrapper.type().propTypes.sceneWillPlay).to.equal(React.PropTypes.func);
        expect(wrapper.type().propTypes.sceneDidPlay).to.equal(React.PropTypes.func);
    });
    
    it('does not contains the methods not passed as first argument', () => {
        const Scene = createReactScene([
            'play'
        ]);
        const wrapper = mount(<Scene />);
        expect(Scene).to.not.respondTo('load');
        expect(wrapper.type().propTypes.load).to.be.undefined;
        expect(wrapper.type().propTypes.sceneWillLoad).to.be.undefined;
        expect(wrapper.type().propTypes.sceneDidLoad).to.be.undefined;
    });
});
