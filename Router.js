/**
 * Created by zhangfan on 17-4-11.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    BackAndroid,
    Platform
} from 'react-native';


class Router extends Component {

    render() {
        return <Navigator style={{flex:1,alignSelf:"stretch"}}
                          ref="navigator"
                          initialRoute={{
                            component:this.props.scenes.index.props.component
                          }}
                          renderScene={(route, navigator) => {
                            let Comp = route.component;
                            return <WrapperComponent onAndroidBack={this.onAndroidBack}>
                                <Comp {...route.params}/>
                             </WrapperComponent>
                        }}

        />
    }

    onAndroidBack = () => {
        let routes = this.refs.navigator.getCurrentRoutes();
        if (routes && routes.length > 1) {
            this.refs.navigator.pop();
            return true
        }
        return false
    };

    componentDidMount() {
        this.props.scenes.act = (scene, params) => {
            this.refs.navigator.push({
                component: scene.props.component,
                params: params
            })
        };
        this.props.scenes.pop = () => {
            this.refs.navigator.pop();
        }
    }
}

class WrapperComponent extends Component {

    render() {
        return (
            <View style={{flex:1,alignSelf:"stretch"}}>
                {this.props.children}
            </View>
        )
    }

    handlerCallBack = () => {
        return this.props.onAndroidBack();
    };

    componentWillMount() {
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.handlerCallBack);
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.handlerCallBack);
        }
    }
}

export default Router