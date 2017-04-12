/**
 * Created by zhangfan on 17-4-11.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator
} from 'react-native';

class ModuleRoot extends Component {

    state = {
        viewList: []
    };

    render() {
        return (
            <View style={{position:"absolute",left:0,right:0,top:0,bottom:0}}>
                {this.state.viewList.map((it, index) =>
                    <View style={{position:"absolute",left:0,right:0,top:0,bottom:0}} key={index}>
                        {it}
                    </View>
                )}
            </View>
        )
    }

    insertModule = (moduleView) => {
        moduleView.props.dismissCallback(() => {
            let index = this.state.viewList.indexOf(moduleView);
            if (index > -1) {
                this.state.viewList.splice(index, 1);
                this.setState({})
            }
        });
        this.state.viewList.push(moduleView);
        this.setState({})
    }
}

export default ModuleRoot