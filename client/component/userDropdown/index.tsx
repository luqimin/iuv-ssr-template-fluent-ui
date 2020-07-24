/**
 * 页面头部用户下拉菜单
 */

import { inject, observer } from 'mobx-react';
import * as React from 'react';

import { OverflowSet, Persona, PersonaSize, Link, Stack, IconButton } from '@fluentui/react';
import UserStore from '@store/user';

import styles from './index.less';

interface Props {
    user?: UserStore;
    theme?: 'light' | 'dark';
    visible: boolean;
    onChange?(value: boolean): void;
}

@inject('user')
@observer
export default class UserDropdown extends React.Component<Props> {
    /**
     * 菜单dropdown点击
     */
    handleUserMenuClick = () => {
        this.props.user!.logout();
    };

    render() {
        const { user, theme = 'light' } = this.props;
        const userinfo = user && user.data!;

        if (!userinfo) {
            return '';
        }

        return (
            <div className={`${styles.wrap} ${styles[theme]}`}>
                <OverflowSet
                    overflowItems={[
                        {
                            key: 'logout',
                            name: '退出登录',
                            onClick: this.handleUserMenuClick,
                        },
                    ]}
                    onRenderOverflowButton={(items) => (
                        <Stack horizontal verticalAlign="center">
                            <Persona
                                className={styles.avatar}
                                imageUrl={userinfo.avatar}
                                text={userinfo.username || userinfo.userid}
                                size={PersonaSize.size32}
                                imageAlt={userinfo.username}
                            />
                            <IconButton menuProps={{ items: items! }} />
                        </Stack>
                    )}
                    onRenderItem={(item) => (
                        <Link styles={{ root: { marginRight: 10 } }} onClick={item.onClick}>
                            {item.name}
                        </Link>
                    )}
                />
            </div>
        );
    }
}
