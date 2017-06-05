/**
 * Created by zhangfan on 17-4-11.
 */
import React, {Component, PureComponent} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    BackAndroid,
    Platform,
    InteractionManager
} from 'react-native';


const NoBackSwipe = {
    ...Navigator.SceneConfigs.PushFromRight,
    gestures: {
        pop: {}
    }
};

import {Router as FRouter, Actions as FActions, Scene as FScene, Reducer} from 'react-native-router-flux';

import NavigationStateHandler from 'react-native-router-flux-hooks'
const navigationStateHandler = new NavigationStateHandler()

const reducerCreate = params => {
    const defaultReducer = new Reducer(params);
    return (state, action) => {
        console.log('ACTION:', action);
        return defaultReducer(state, action);
    };
}

class Router extends Component {

    constructor(props) {
        super(props)

        let sceneList = [];
        for (let key in this.props.scenes.scenes) {
            if (this.props.scenes.scenes.hasOwnProperty(key)) {
                sceneList.push(this.props.scenes.scenes[key])
            }
        }
        this.scenes = FActions.create(
            <FScene key="root">
                {sceneList.map((scene) =>
                    <FScene key={scene.key} component={class extends Component {
                        render() {
                            let Comp = scene.props.component
                            return <WrapperComponent ref={(it) => scene.container = it}>
                                <Comp {...this.props}/>
                            </WrapperComponent>
                        }
                    }} hideNavBar={true} type={scene.props.type}/>
                )}
            </FScene>
        );
    }

    render() {
        return <FRouter
            createReducer={navigationStateHandler.getReducer.bind(navigationStateHandler)}
            navigationStateHandler={navigationStateHandler}
            scenes={this.scenes}/>
    }

    render2() {
        return <Navigator style={{flex: 1, alignSelf: "stretch"}}
                          ref="navigator"
                          initialRoute={{
                              component: this.props.scenes.index.props.component,
                              scene: this.props.scenes.index,
                          }}
                          configureScene={(route, routeStack) => {
                              return NoBackSwipe
                          }}
                          renderScene={(route, navigator) => {
                              let Comp = route.component;
                              route.focusListeners = [];
                              return <WrapperComponent onAndroidBack={this.onAndroidBack}
                                                       ref={(it) => route.container = it}
                              >
                                  <Comp {...route.params}
                                        ref={(it) => route.ref = it}/>
                              </WrapperComponent>
                          }}
                          onDidFocus={(route) => {
                              route.ref.onDidFocus && route.ref.onDidFocus()
                          }}

        />
    }

    onAndroidBack = () => {
        let routes = this.refs.navigator.getCurrentRoutes();
        if (routes && routes.length > 1) {
            let topRoute = routes[routes.length - 1];
            if (!topRoute.ref.handleBack) {
                // this.refs.navigator.pop();
                this.refs.navigator.popToRoute(routes[routes.length - 2]);
                return true
            }
            return topRoute.ref.handleBack()
        }
        return false
    };

    componentDidMount() {
        this.props.scenes.act = (scene, params) => {
            InteractionManager.runAfterInteractions(() => {
                FActions[scene.key](params)
            });
            // this.refs.navigator.push({
            //     component: scene.props.component,
            //     scene: scene,
            //     params: params
            // })
        };
        this.props.scenes.pop = () => {
            // this.refs.navigator.pop();
            FActions.pop({type: "refresh"})
        };
        this.props.scenes.hehe = () => {
            let routes = this.refs.navigator.getCurrentRoutes();
            console.info(routes[routes.length - 1].ref.hehe())
        };
        this.props.scenes.insertModule = (moduleView) => {
            let routes = this.refs.navigator.getCurrentRoutes();
            routes[routes.length - 1].container.insertModule(moduleView)
        }
    }
}

import ModuleRoot from './module/ModuleRoot'

class WrapperComponent extends PureComponent {

    insertModule = (moduleView) => {
        this.refs.moduleRoot.insertModule(moduleView);
    };

    render() {
        return (
            <View style={{flex: 1, alignSelf: "stretch", backgroundColor: "#FFF"}}>
                {this.props.children}
                <ModuleRoot ref="moduleRoot"/>
            </View>
        )
    }

    // handlerCallBack = () => {
    //     return this.props.onAndroidBack();
    // };
    //
    // componentWillMount() {
    //     if (Platform.OS === 'android') {
    //         BackAndroid.addEventListener('hardwareBackPress', this.handlerCallBack);
    //     }
    // }
    //
    // componentWillUnmount() {
    //     if (Platform.OS === 'android') {
    //         BackAndroid.removeEventListener('hardwareBackPress', this.handlerCallBack);
    //     }
    // }
}

export default Router