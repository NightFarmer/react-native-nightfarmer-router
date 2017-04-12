/**
 * Created by zhangfan on 17-4-11.
 */
import React, {Component} from 'react';

import SceneSet from './SceneSet'

class Actions {
    sceneSet = new SceneSet();

    create(scenes) {
        let sceneSet = new SceneSet();
        this.sceneSet = sceneSet;

        let list = scenes.props.children || [];

        list.forEach((item, index) => {
            if (index == 0) {
                sceneSet.index = item
            }
            sceneSet.scenes[item.key] = item;
            this[item.key] = (params) => {
                sceneSet.act(item, params)
            };
        });
        return sceneSet;
    }

    pop = () => {
        this.sceneSet.pop()
    };

    insertModule = (moduleView) => {
        this.sceneSet.insertModule(moduleView)
    }
}

export default new Actions()