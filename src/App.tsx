import React, { useMemo, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import {
  ConfigProvider,
  Layout,
  Menu,
  Select,
  Space,
  theme,
  Result,
  Button,
} from 'antd';
import {
  TeamOutlined,
  SearchOutlined,
  PullRequestOutlined,
  MenuOutlined,
  HomeOutlined,
  GlobalOutlined,
  BulbOutlined,
  ReadOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import HomePage from './pages/HomePage';
import PiPage from './pages/PiPage';
import OverviewPage from './pages/OverviewPage';
import GapAnalysisPage from './pages/GapAnalysisPage';
import PRGeneratorPage from './pages/PRGeneratorPage';
import VendorPage from './pages/VendorPage';
import { useThemeMode } from './hooks/useTheme';
import { useLocale } from './hooks/useLocale';
import { useRole } from './context/RoleContext';
import { hasAccess } from './config/roles';
import { SidebarRoleEntry } from './components/SidebarRoleEntry';
import { DynamicBackground } from './components/DynamicBackground';

const { Header, Content, Sider } = Layout;

const SettingsControls: React.FC<{ mobile?: boolean }> = ({ mobile }) => {
  const { t } = useTranslation();
  const { themeMode, setThemeMode } = useThemeMode();
  const { languageMode, setLanguageMode } = useLocale();

  return (
    <Space size={mobile ? 8 : 12} wrap>
      <Select
        size='small'
        value={themeMode}
        onChange={setThemeMode}
        className={mobile ? 'w-[140px]' : 'w-[160px]'}
        options={[
          {
            value: 'system',
            label: `${t('controls.themeLabel')}: ${t('controls.system')}`,
          },
          {
            value: 'dynamic-dark',
            label: `${t('controls.themeLabel')}: ${t('controls.dynamicDark')}`,
          },
          {
            value: 'dynamic-light',
            label: `${t('controls.themeLabel')}: ${t('controls.dynamicLight')}`,
          },
          {
            value: 'pure-dark',
            label: `${t('controls.themeLabel')}: ${t('controls.pureDark')}`,
          },
          {
            value: 'pure-light',
            label: `${t('controls.themeLabel')}: ${t('controls.pureLight')}`,
          },
        ]}
        suffixIcon={<BulbOutlined />}
      />
      <Select
        size='small'
        value={languageMode}
        onChange={setLanguageMode}
        className={mobile ? 'w-[140px]' : 'w-[160px]'}
        options={[
          {
            value: 'system',
            label: `${t('controls.languageLabel')}: ${t('controls.system')}`,
          },
          {
            value: 'en',
            label: `${t('controls.languageLabel')}: ${t('controls.english')}`,
          },
          {
            value: 'zh-TW',
            label: `${t('controls.languageLabel')}: ${t('controls.traditionalChinese')}`,
          },
        ]}
        suffixIcon={<GlobalOutlined />}
      />
    </Space>
  );
};

const TopSettingsBar: React.FC = () => {
  return (
    <div className='hidden md:block fixed top-3 right-10 z-[60]'>
      <div className='glass-card px-3 py-2'>
        <SettingsControls mobile />
      </div>
    </div>
  );
};

const Navigation: React.FC<{
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { role } = useRole();

  const allMenuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to='/'>{t('nav.home')}</Link>,
      path: '/',
    },
    {
      key: '/pi',
      icon: <ReadOutlined />,
      label: <Link to='/pi'>{t('nav.pi')}</Link>,
      path: '/pi',
    },
    {
      key: '/services',
      icon: <ExperimentOutlined />,
      label: <Link to='/services'>{t('nav.services')}</Link>,
      path: '/services',
    },
    {
      key: '/overview',
      icon: <TeamOutlined />,
      label: <Link to='/overview'>{t('nav.overview')}</Link>,
      path: '/overview',
    },
    {
      key: '/gaps',
      icon: <SearchOutlined />,
      label: <Link to='/gaps'>{t('nav.gapAnalysis')}</Link>,
      path: '/gaps',
    },
    {
      key: '/update',
      icon: <PullRequestOutlined />,
      label: <Link to='/update'>{t('nav.updateData')}</Link>,
      path: '/update',
    },
  ];

  const menuItems = allMenuItems.filter((item) => hasAccess(role, item.path));

  return (
    <>
      {/* Desktop Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className='hidden md:block pt-[64px]'
        style={{
          background: 'var(--shell-bg)',
          backdropFilter: 'blur(12px)',
          borderRight: '1px solid var(--shell-border)',
          overflow: 'auto',
          height: '100vh',
          position: 'sticky',
          top: 0,
          left: 0,
          zIndex: 10,
        }}
        trigger={null}
      >
        <div className='flex flex-col h-full justify-between'>
          <div>
            <Menu
              mode='inline'
              selectedKeys={[location.pathname]}
              items={menuItems}
              style={{
                background: 'transparent',
                borderRight: 'none',
              }}
            />
          </div>
          <SidebarRoleEntry collapsed={collapsed} />
        </div>
      </Sider>

      <Header
        className='fixed top-0 left-0 right-0 z-50'
        style={{
          background: 'var(--shell-bg-mobile)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--shell-border)',
          padding: 0,
          height: '64px',
          lineHeight: '64px',
        }}
      >
        <div className='flex items-center justify-between md:justify-start px-4 w-full h-full md:gap-4'>
          <Link
            to='/'
            className='flex items-center gap-2 min-w-0 order-1 md:order-2'
          >
            <img
              src={`${import.meta.env.BASE_URL}logo.svg`}
              alt={t('appName')}
              className='w-8 h-8 shrink-0'
            />
            <span className='text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent truncate'>
              {t('appName')}
            </span>
          </Link>
          <button
            className='p-1.5 rounded-lg text-[var(--color-text-primary)] hover:bg-white/10 transition-colors cursor-pointer shrink-0 flex items-center justify-center order-2 md:order-1'
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? '展開側邊欄' : '收合側邊欄'}
          >
            <MenuOutlined className='text-xl' />
          </button>
        </div>
      </Header>

      {/* Mobile Menu Overlay */}
      {!collapsed && (
        <div
          className='md:hidden fixed inset-0 z-40 bg-black/50'
          onClick={() => setCollapsed(true)}
        >
          <div
            className='absolute top-16 left-0 right-0 bg-[var(--color-bg-secondary)] border-b border-[var(--shell-border)]'
            onClick={(e) => e.stopPropagation()}
          >
            <Menu
              mode='vertical'
              selectedKeys={[location.pathname]}
              items={menuItems}
              style={{ background: 'transparent' }}
              onClick={() => setCollapsed(true)}
            />
            <div className='border-t border-[var(--shell-border)] p-3'>
              <SettingsControls mobile />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ProtectedRoute: React.FC<{ path: string; element: React.ReactNode }> = ({
  path,
  element,
}) => {
  const { role } = useRole();
  const { t } = useTranslation();

  if (!hasAccess(role, path)) {
    return (
      <Result
        status='403'
        title='403'
        subTitle={t(
          'nav.noAccess',
          'Sorry, you do not have permission to access this page.',
        )}
        extra={
          <Link to='/'>
            <Button type='primary'>{t('nav.backHome', 'Back to Home')}</Button>
          </Link>
        }
      />
    );
  }
  return <>{element}</>;
};

const AppContent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Layout className='min-h-screen'>
      <Navigation collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <TopSettingsBar />
        <Content
          className='p-4 md:p-8 !pt-20 md:pt-20'
          style={{
            background: 'transparent',
            minHeight: '100vh',
          }}
        >
          <div className='max-w-7xl mx-auto'>
            <Routes>
              <Route
                path='/'
                element={<ProtectedRoute path='/' element={<HomePage />} />}
              />
              <Route
                path='/services'
                element={
                  <ProtectedRoute path='/services' element={<VendorPage />} />
                }
              />
              <Route
                path='/pi'
                element={<ProtectedRoute path='/pi' element={<PiPage />} />}
              />
              <Route
                path='/overview'
                element={
                  <ProtectedRoute path='/overview' element={<OverviewPage />} />
                }
              />
              <Route
                path='/gaps'
                element={
                  <ProtectedRoute path='/gaps' element={<GapAnalysisPage />} />
                }
              />
              <Route
                path='/update'
                element={
                  <ProtectedRoute
                    path='/update'
                    element={<PRGeneratorPage />}
                  />
                }
              />
            </Routes>
          </div>
        </Content>
      </Layout>

      <DynamicBackground />
    </Layout>
  );
};

const App: React.FC = () => {
  const { isDark } = useThemeMode();

  const themeConfig = useMemo(() => {
    return {
      algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        colorPrimary: 'var(--color-accent)',
        colorBgContainer: isDark ? '#141a24' : '#ffffff',
        colorBgElevated: 'var(--color-bg-card)',
        colorBorder: isDark ? '#2d3748' : '#d9d9d9',
        colorText: isDark ? '#f3f4f6' : '#1f2937',
        colorTextSecondary: 'var(--color-text-secondary)',
        borderRadius: 12,
      },
      components: {
        Menu: {
          itemBg: 'transparent',
          itemSelectedBg: 'var(--color-surface-3)',
          itemHoverBg: 'var(--color-surface-2)',
          itemSelectedColor: 'var(--color-accent)',
        },
        Card: {
          colorBgContainer: 'var(--color-surface-1)',
        },
        Table: {
          colorBgContainer: 'transparent',
          headerBg: 'var(--color-surface-1)',
          rowHoverBg: 'var(--color-surface-2)',
        },
        Input: {
          colorBgContainer: 'var(--color-surface-1)',
        },
        Select: {
          colorBgContainer: 'var(--color-surface-1)',
          colorBgElevated: 'var(--color-bg-card)',
        },
        Tabs: {
          itemColor: 'var(--color-text-secondary)',
          itemSelectedColor: 'var(--color-accent)',
          itemHoverColor: 'var(--color-text-primary)',
        },
      },
    };
  }, [isDark]);

  return (
    <ConfigProvider theme={themeConfig}>
      <Router basename={import.meta.env.BASE_URL}>
        <AppContent />
      </Router>
    </ConfigProvider>
  );
};

export default App;
