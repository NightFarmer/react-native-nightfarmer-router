/**
 * Created by zhangfan on 17-4-11.
 */
import React, {Component, PureComponent} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator
} from 'react-native';

class ModuleRoot extends PureComponent {

    state = {
        viewList: []
    };

    sequence = 0;

    render() {
        return (
            <View style={{position: "absolute", left: 0, right: 0, top: 0, bottom: 0}}>
                {this.state.viewList.map(this.renderItem)}
            </View>
        )
    }

    renderItem = (it) =>
        <View style={{position: "absolute", left: 0, right: 0, top: 0, bottom: 0}} key={it.id}>
            {it.component}
        </View>;


    insertModule = (moduleView) => {
        let moduleBean = new ModuleBean();
        moduleView.props.dismissCallback(() => {
            let index = this.state.viewList.indexOf(moduleBean);
            if (index > -1) {
                this.state.viewList.splice(index, 1);
                this.setState({})
            }
        });
        moduleBean.id = this.sequence++;
        moduleBean.component = moduleView;
        this.state.viewList.push(moduleBean);
        this.setState({})
    }
}

class ModuleBean {
    id = 0;
    component = null;
}

export default ModuleRoot