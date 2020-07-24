import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';

import { MessageBar, Link, MessageBarType } from '@fluentui/react';
import UserStore from '@store/user';

import IUVContent from '../layout/Content';
import IUVFooter from '../layout/Footer';
import IUVHeader from '../layout/Header';

interface Props {
    component: React.ComponentClass<RouteComponentProps, any>;
    user?: UserStore;
}

interface State {
    /**
     * 组件是否catch到错误
     */
    hasError: boolean;
}

@inject('user')
@observer
class Auth extends React.Component<Props, State> {
    state = { hasError: false };

    componentDidCatch(error: Error) {
        const loadChunkErrorReg = /.*Loading.*chunk.*/;
        if (loadChunkErrorReg.test(error.message)) {
            window.location.reload();
        }
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        const { component: Component, user, ...rest } = this.props;

        if (this.state.hasError) {
            return (
                <div style={{ margin: '100px auto', width: 666 }}>
                    <MessageBar isMultiline messageBarType={MessageBarType.error}>
                        对不起，页面发生了错误
                        <div>
                            <Link
                                onClick={() => {
                                    window.location.reload();
                                }}
                            >
                                立即刷新
                            </Link>
                            <Link
                                style={{ marginLeft: 10 }}
                                onClick={() => {
                                    window.history.go(-1);
                                }}
                            >
                                返回上页
                            </Link>
                        </div>
                    </MessageBar>
                </div>
            );
        }

        // 用户是否登录
        const isLogin: boolean = !!user!.data;

        return (
            <Route
                {...rest}
                render={(props) =>
                    isLogin ? (
                        <div style={{ minHeight: '100vh' }}>
                            <IUVHeader />
                            <IUVContent>
                                <Component {...props} />
                            </IUVContent>
                            <IUVFooter />
                        </div>
                    ) : (
                        <Redirect
                            to={{
                                pathname: '/login',
                                state: { from: props.location },
                            }}
                        />
                    )
                }
            />
        );
    }
}

export default Auth;
