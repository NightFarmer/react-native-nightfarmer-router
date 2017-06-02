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
    Platform,
    Animated,
    Easing,
    I18nManager
} from 'react-native';

import {StackNavigator, NavigationActions} from 'react-navigation';

const NoBackSwipe = {
    ...Navigator.SceneConfigs.HorizontalSwipeJump,
    gestures: {
        pop: {}
    }
};

/**
 * Render the initial style when the initial layout isn't measured yet.
 */
function forInitial(props) {
    const {
        navigation,
        scene,
    } = props;

    const focused = navigation.state.index === scene.index;
    const opacity = focused ? 1 : 0;
    // If not focused, move the scene far away.
    const translate = focused ? 0 : 1000000;
    return {
        opacity,
        transform: [{translateX: translate}, {translateY: translate}],
    };
}


// routerNavigate = undefined;
routerNavigation = undefined;
class Router extends Component {


    constructor(props) {
        super(props);
        let compMap = {};
        for (let key in this.props.scenes.scenes) {
            if (this.props.scenes.scenes.hasOwnProperty(key)) {
                compMap[key] = {
                    screen: this.renderScene(this.props.scenes.scenes[key]),
                    navigationOptions: {
                        gesturesEnabled: false,
                        header: null,
                    },
                }
            }
        }
        this.SimpleApp = StackNavigator(compMap, {
            onTransitionEnd: (a, b, c) => {
                console.info("onTransitionEnd")
                console.info(a)
                console.info(b)
                console.info(c)
            },
            cardStyle: {
                backgroundColor: "#FFF"
            },
            mode: 'card',
            transitionConfig: () => ({
                transitionSpec: {
                    // Default duration is 250 (to attempt to match default native behaviour). Override to reduce this.
                    duration: 250,
                    // Optional easing and timing keys (these are defaults)
                    // easing: Easing.inOut(Easing.ease),
                    // timing: Animated.timing
                },
                // screenInterpolator is a function that takes NavigationSceneRendererProps and determines how to interpolate scenes,
                // by itself returning an object with `opacity` and `transform` keys. For examples, look at `CardStackStyleInterpolator.js`.
                screenInterpolator: (props) => {
                    console.info("123")
                    const {
                        layout,
                        position,
                        scene,
                    } = props;

                    if (!layout.isMeasured) {
                        return forInitial(props);
                    }

                    const index = scene.index;
                    const inputRange = [index - 1, index, index + 1];

                    const width = layout.initWidth;
                    const outputRange = I18nManager.isRTL
                        ? ([-width, 0, width / 3]: Array<number>)
                        : ([width, 0, -width / 3]: Array<number>);

                    // const outputRange = I18nManager.isRTL
                    //     ? ([-width, 0, 0]: Array<number>)
                    //     : ([width, 0, 0]: Array<number>);

                    // Add [index - 1, index - 0.99] to the interpolated opacity for screen transition.
                    // This makes the screen's shadow to disappear smoothly.
                    const opacity = position.interpolate({
                        inputRange: ([
                            index - 1,
                            index - 0.99,
                            index,
                            index + 0.99,
                            index + 1,
                        ]: Array<number>),
                        outputRange: ([0, 1, 1, 0.3, 0]: Array<number>),
                    });

                    const translateY = 0;
                    const translateX = position.interpolate({
                        inputRange,
                        outputRange,
                    });

                    // opacity,
                    return {
                        transform: [{translateX}, {translateY}],
                    };

                }
            })
        });
    }

    renderScene = (scene) => {
        let Comp = scene.props.component;
        return class extends Component {
            render() {
                // routerNavigate = this.props.navigation.navigate;
                routerNavigation = this.props.navigation;
                return <Comp {...this.props} {...this.props.navigation.state.params} />
            }
        }
    };

    render() {
        return <this.SimpleApp/>
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
                              return <WrapperComponent onAndroidBack={this.onAndroidBack}
                                                       ref={(it) => route.container = it}
                              >
                                  <Comp {...route.params} sceneRef={route.sceneRef}
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
            // console.info(topRoute.scene.key, topRoute.ref.handleBack)
            if (!topRoute.ref.handleBack) {
                console.info("pop ")
                this.refs.navigator.popToRoute(routes[routes.length - 2]);
                console.info("popover")
                return true
            }
            return topRoute.ref.handleBack()
        }
        return false
    };

    componentDidMount() {
        this.props.scenes.act = (scene, params) => {
            routerNavigation.navigate(scene.key, params)
            // console.info(scene.key)
            // this.refs.navigator.push({
            //     component: scene.props.component,
            //     scene: scene,
            //     params: params,
            // })

            // const resetAction = NavigationActions.reset({
            //     index: 0,
            //     actions: [
            //         NavigationActions.navigate({routeName: scene.key, params: params})
            //     ]
            // })
            // routerNavigation.dispatch(resetAction)

        };
        this.props.scenes.pop = () => {
            // this.refs.navigator.pop();
            // routerNavigation.goBack(null)
            const backAction = NavigationActions.back({
                key: 'StaffContacts'
            })
            routerNavigation.dispatch(backAction)
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

class WrapperComponent extends Component {

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


class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Welcome',
    };

    render() {
        return <Text>Hello, Navigation!</Text>;
    }
}

const SimpleApp = StackNavigator({
    Home: {screen: HomeScreen},
});


export default Router