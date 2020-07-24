/*
 * 登录页面
 */
import { Formik, Field, Form, FormikProps, FieldProps } from 'formik';
import { Location } from 'history';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';

import { LOGIN } from '@const/url';
import { TextField, PrimaryButton, Checkbox } from '@fluentui/react';
import IUVFooter from '@layout/Footer';
import UserStore from '@store/user';
import { post } from '@utils/fetch';

import styles from './index.less';

interface LoginFormValues {
    /**
     * 用户名
     */
    username?: string;
    /**
     * 密码
     */
    password?: string;
    /**
     * 是否记住登录状态
     */
    remember: boolean;
}

/**
 * 用户登录表单接口
 */
interface UserFormProps extends FormikProps<LoginFormValues> {}

/**
 * 组件Props接口
 */
interface Props extends UserFormProps, RouteComponentProps<{}, {}, { from?: Location }> {
    user: UserStore;
}

@inject('user')
@observer
class Login extends React.Component<Props> {
    /**
     * 登录
     */
    handleSubmit = async (values: LoginFormValues) => {
        const { user } = this.props;
        // 用户登录
        try {
            const res = await post(LOGIN, values);
            if (res.code === 0) {
                toast.success(res.msg || '登录成功', {
                    autoClose: 2000,
                    onClose: () => {
                        // 修改用户登录状态
                        user.initData(res.data);
                        // 登陆后页面跳转
                        this.redirect();
                    },
                });
            } else {
                toast.error(res.msg || '登陆失败');
            }
        } catch (err) {
            toast.error(`登陆失败: ${err.message}`);
        }
    };

    /**
     * 登陆后跳转页面
     */
    redirect = () => {
        const { location, history } = this.props;
        // 来源页面
        const from = location.state?.from;

        // 有来源页面，则跳转到来源页面, 没有来源页面，则跳转到首页
        from && history.replace(from as any);
    };

    render() {
        const { user, location } = this.props;

        // 用户是否登录
        const isLogin: boolean = !!user!.data;

        if (isLogin) {
            // 来源页面
            const from = location.state && location.state.from;
            return (
                <Redirect
                    to={{
                        pathname: from ? from.pathname : '/',
                    }}
                />
            );
        }

        return (
            <div className={styles.container}>
                <Helmet>
                    <title>登录</title>
                </Helmet>
                <div className={styles.top}>
                    <div className={styles.header}>
                        <span className={styles.title}>IUV Web App</span>
                    </div>
                    <div className={styles.desc}>哎呦喂~</div>
                </div>

                <div className={styles.main}>
                    <Formik initialValues={{ remember: true }} onSubmit={this.handleSubmit}>
                        {({ isSubmitting, errors }: FormikProps<LoginFormValues>) => (
                            <Form>
                                <Field
                                    validate={(v: string) => {
                                        let error: string | undefined;
                                        if (!v) {
                                            error = '用户名必填';
                                        }
                                        return error;
                                    }}
                                    name="username"
                                >
                                    {({ field }: FieldProps<LoginFormValues['username'], LoginFormValues>) => (
                                        <TextField
                                            {...field}
                                            label="用户名"
                                            iconProps={{ iconName: 'Contact' }}
                                            errorMessage={errors.username}
                                        />
                                    )}
                                </Field>
                                <Field
                                    validate={(v: string) => {
                                        let error: string | undefined;
                                        if (!v) {
                                            error = '密码必填';
                                        }
                                        return error;
                                    }}
                                    name="password"
                                >
                                    {({ field }: FieldProps<LoginFormValues['password'], LoginFormValues>) => (
                                        <TextField
                                            {...field}
                                            label="密码"
                                            iconProps={{ iconName: 'Permissions' }}
                                            type="password"
                                            errorMessage={errors.password}
                                        />
                                    )}
                                </Field>
                                <Field name="remember">
                                    {({ field: { value, ...field } }: FieldProps<LoginFormValues['remember'], LoginFormValues>) => (
                                        <Checkbox className={styles.remember} {...field} checked={value} label="记住密码" />
                                    )}
                                </Field>
                                <div className={styles.additional}>
                                    <PrimaryButton disabled={isSubmitting} type="submit" text="登录" className={styles.submit} />
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
                <IUVFooter />
            </div>
        );
    }
}

export default Login;
