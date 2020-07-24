import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import ScrollMemory from 'react-router-scroll-memory';
import { toast } from 'react-toastify';

import { initializeIcons, Fabric, createTheme, Customizations } from '@fluentui/react';

// 路由
import Routes from '../routes';
import Auth from './Auth';
import Exception from './Exception';

// 全局样式
import '../style/global.less';
import '../style/ReactToastify.less';

const theme = createTheme({
    defaultFontStyle: {
        fontFamily:
            // eslint-disable-next-line max-len
            'PingFang SC, Microsoft YaHei, -apple-system, BlinkMacSystemFont, Helvetica Neue, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif',
    },
});
Customizations.applySettings({ theme });
initializeIcons('/assets/');
toast.configure({ newestOnTop: true });

export default () => (
    <Fabric>
        <ScrollMemory />
        <Switch>
            {Routes.map((route) => {
                // 登录页面不适用公共layout
                if (['/login'].includes(route.path)) {
                    return <Route key={route.name} {...route} />;
                }

                // 其他需要鉴权的页面
                return <Auth key={route.name} {...route} />;
            })}
            <Route component={Exception} />
        </Switch>
    </Fabric>
);
