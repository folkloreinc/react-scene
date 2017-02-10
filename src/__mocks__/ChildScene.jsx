import React, { Component } from 'react';
import { createScene } from '../index';

class ChildScene extends Component {
    constructor(props) {
        super(props);
        this.scene = props.scene;
    }

    play() {

    }

    render() {
        return (
            <div />
        );
    }
}

export default createScene(ChildScene, {}, ['play']);
