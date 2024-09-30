import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import ChatBot from "./chat-bot";
import {PiOpenAiLogo} from "react-icons/pi";

const { Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
      <Layout>
        <Sider style={{borderRadius: 8}} trigger={null} collapsible collapsed={collapsed}>
          <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['1']}
              items={[
                {
                  key: '1',
                  icon: <PiOpenAiLogo />,
                  label: 'Chat GPT',
                },
                {
                  key: '2',
                  icon: <VideoCameraOutlined />,
                  label: 'nav 2',
                },
                {
                  key: '3',
                  icon: <UploadOutlined />,
                  label: 'nav 3',
                },
              ]}
          />

            <Button
                type="primary"
                onClick={() => setCollapsed(!collapsed)}
                style={{ margin: '16px' }}
            >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
        </Sider>
        <Layout>
          <Content
              style={{
                padding: 24,
                borderRadius: borderRadiusLG,
              }}
          >
            <ChatBot/>
          </Content>
        </Layout>
      </Layout>
  );
};

export default App;