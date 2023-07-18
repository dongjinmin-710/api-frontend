import Footer from '@/components/Footer';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCheckbox, ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { useModel, Helmet } from '@umijs/max';
import { message, Tabs } from 'antd';
import React, {useRef, useState} from 'react';
import {userLoginUsingPOST, userRegisterUsingPOST} from "@/services/api-backend/userController";

type LoginType = 'account' | 'register' | 'forgetPassword';

const Login: React.FC = () => {
  const [loginType, setLoginType] = useState<LoginType>('account');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { initialState, setInitialState } = useModel('@@initialState');
  const formRef = useRef<ProFormInstance>();


  const handleSubmit = async (values: API.UserRegisterRequest) => {
    const {userPassword, checkPassword} = values;
    if (checkPassword) {
      // 注册
      if (userPassword !== checkPassword) {
        message.error('两次输入密码不一致！');
        return;
      }
      const res = await userRegisterUsingPOST(values);
      if (res.code === 0) {
        // 注册成功
        const defaultRegisterSuccessMessage = '注册成功！';
        message.success(defaultRegisterSuccessMessage)
        // 切换到登录
        setLoginType('account');
        // 重置表单
        formRef.current?.resetFields();
      }

    } else {
      // 登录
      const res = await userLoginUsingPOST({
        ...values,
      });
      if (res.data) {
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);
        // 登录成功后处理
        const urlParams = new URL(window.location.href).searchParams;
        // 重定向到 redirect 参数所在的位置
        location.href = urlParams.get('redirect') || '/';
        // 保存登录状态
        setInitialState({
          loginUser: res.data,
        });
      } else {
        message.error(res.message);
      }
    }
  };

  return (
    <div>
      <Helmet>
        <title>
        </title>
      </Helmet>

      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/接口.png" />}
          title="Jinmin API"
          subTitle="API 调用平台"
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.UserLoginRequest);
          }}
        >
          <Tabs
            centered
            activeKey={loginType}
            onChange={(activeKey) => setLoginType(activeKey as LoginType)}
          >
            <Tabs.TabPane key={'account'} tab={'登录'}/>
            <Tabs.TabPane key={'register'} tab={'注册'}/>
          </Tabs>
          {loginType === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                placeholder={'请输入用户名'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
              <div
                style={{
                  marginBottom: 24,
                }}
              >
                <ProFormCheckbox noStyle name="autoLogin">
                  自动登录
                </ProFormCheckbox>
                <a
                  style={{
                    float: 'right',
                  }}
                  onClick={() => setLoginType("forgetPassword")}
                >
                  忘记密码 ?
                </a>
              </div>
            </>
          )}
          {loginType === 'register' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                name="userAccount"
                placeholder={'请输入用户名'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                  {
                    min: 4,
                    message: '长度不能少于4位！',
                  },
                ]}
              />
              <ProFormText.Password
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                name="userPassword"
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 8,
                    message: '长度不能少于8位！',
                  },
                ]}
              />
              <ProFormText.Password
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                name="checkPassword"
                placeholder={'请再次输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 8,
                    message: '长度不能少于8位！',
                  },
                ]}
              />
            </>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
