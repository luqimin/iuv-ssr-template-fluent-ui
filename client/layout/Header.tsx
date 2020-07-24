/**
 * 页面通用头
 */
import { inject, observer } from 'mobx-react';
import { pathToRegexp } from 'path-to-regexp';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Link, Redirect, RouteComponentProps, withRouter } from 'react-router-dom';

import UserDropdown from '@component/userDropdown';
import { Nav, INavLinkGroup } from '@fluentui/react';
import PageStore from '@store/page';

import Routes from '../routes';
import UserStore from '../store/user';
import styles from './index.less';

interface InjectedProps extends RouteComponentProps<{}> {
    user?: UserStore;
    page?: PageStore;
}

const navLinkGroups: INavLinkGroup[] = [
    {
        links: [
            {
                name: '首页',
                url: '/',
                key: 'home',
                isExpanded: true,
            },
            {
                name: '测试页面',
                url: '/test',
                key: 'test',
                isExpanded: true,
            },
        ],
    },
];

@inject('user')
@inject('page')
@observer
class IUVHeader extends React.Component<InjectedProps, any> {
    render() {
        const { user, page, location, history } = this.props;
        const userinfo = user && user.data!;

        if (!userinfo) {
            return <Redirect to="/" />;
        }

        // 获取当前menu选中key
        let selectedKey: string = '';
        let pageTitle = 'IUV';
        for (let i = 0; i < Routes.length; i++) {
            const route = Routes[i];
            if (pathToRegexp(route.path).test(location.pathname)) {
                selectedKey = route.menuKey;
                pageTitle = `IUV - ${page!.data.pageName || route.name}`;
                break;
            }
        }

        return (
            <div className={styles.header}>
                <Helmet>
                    <title>{pageTitle}</title>
                </Helmet>
                <div className={styles.wrap}>
                    <div className={styles.left}>
                        <Link className={styles.logo} to="/">
                            <span className={styles.img} />
                            IUV
                        </Link>
                        <Nav
                            className={styles.nav}
                            selectedKey={selectedKey}
                            groups={navLinkGroups}
                            onLinkClick={(e, p) => {
                                e?.preventDefault();
                                p?.url && history.push(p.url);
                            }}
                        />
                    </div>
                    <div className={styles.right}>
                        <UserDropdown theme="dark" visible />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter<RouteComponentProps<{}>, any>(IUVHeader);
