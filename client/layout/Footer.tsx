/**
 * 页面通用尾
 */

import * as React from 'react';

import styles from './index.less';

interface Props {
    text?: React.ReactNode | string;
    fixBottom?: boolean;
}

class IUVFooter extends React.PureComponent<Props> {
    render() {
        const { text, fixBottom } = this.props;
        return <div className={`${styles.footer} ${fixBottom ? styles.fixBottom : ''}`}>{text || 'IUV'}</div>;
    }
}

export default IUVFooter;
