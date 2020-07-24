/**
 * 页面主要内容
 */

import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import Routes from '../routes';
import styles from './index.less';

const breadcrumbNameMap: { [key: string]: String } = {};
Routes.forEach((route) => {
    breadcrumbNameMap[route.path] = route.name;
});

class IUVContent extends React.PureComponent<RouteComponentProps<{}>, any> {
    render() {
        const { children } = this.props;

        return (
            <div className={styles.content}>
                <div className={styles.contentWrap}>
                    <div className={styles.main}>{children}</div>
                </div>
            </div>
        );
    }
}

export default withRouter<RouteComponentProps<{}>, any>(IUVContent);
