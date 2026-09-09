import React, { useMemo, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import { ConfigProvider, Layout, Menu, Select, Space, theme } from 'antd';
import {
  TeamOutlined,
  SearchOutlined,
  PullRequestOutlined,
  MenuOutlined,
  HomeOutlined,
  GlobalOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import HomePage from './pages/HomePage';
import OverviewPage from './pages/OverviewPage';
import GapAnalysisPage from './pages/GapAnalysisPage';
import PRGeneratorPage from './pages/PRGeneratorPage';
import { useThemeMode } from './hooks/useTheme';
import { useLocale } from './hooks/useLocale';

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
            value: 'light',
            label: `${t('controls.themeLabel')}: ${t('controls.light')}`,
          },
          {
            value: 'dark',
            label: `${t('controls.themeLabel')}: ${t('controls.dark')}`,
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
    <div className='fixed top-16 md:top-3 right-22 z-[60]'>
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

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to='/'>{t('nav.home')}</Link>,
    },
    {
      key: '/overview',
      icon: <TeamOutlined />,
      label: <Link to='/overview'>{t('nav.overview')}</Link>,
    },
    {
      key: '/gaps',
      icon: <SearchOutlined />,
      label: <Link to='/gaps'>{t('nav.gapAnalysis')}</Link>,
    },
    {
      key: '/update',
      icon: <PullRequestOutlined />,
      label: <Link to='/update'>{t('nav.updateData')}</Link>,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className='hidden md:block'
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
        <div className='h-16 flex items-center justify-center px-6 border-b border-white/10'>
          <Link to='/' className='flex items-center gap-2'>
            <img
              src={`${import.meta.env.BASE_URL}logo.svg`}
              alt={t('appName')}
              className='w-8 h-8'
            />
            {!collapsed && (
              <span className='text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent'>
                {t('appName')}
              </span>
            )}
          </Link>
        </div>
        <Menu
          mode='inline'
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{
            background: 'transparent',
            borderRight: 'none',
          }}
        />
      </Sider>

      {/* Mobile Header */}
      <Header
        className='md:hidden fixed top-0 left-0 right-0 z-50'
        style={{
          background: 'var(--shell-bg-mobile)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--shell-border)',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link to='/' className='flex items-center gap-2'>
          <img
            src={`${import.meta.env.BASE_URL}logo.svg`}
            alt={t('appName')}
            className='w-8 h-8'
          />
          <span className='text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent'>
            {t('appName')}
          </span>
        </Link>
        <div className='flex items-center gap-4'>
          <MenuOutlined
            className='text-[var(--color-text-primary)] text-xl cursor-pointer'
            onClick={() => setCollapsed(!collapsed)}
          />
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
          </div>
        </div>
      )}
    </>
  );
};

const AppContent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Layout className='min-h-screen'>
      <Navigation collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <TopSettingsBar />
        <Content
          className='p-4 md:p-8 !pt-32 md:pt-20'
          style={{
            background: 'transparent',
            minHeight: '100vh',
          }}
        >
          <div className='max-w-7xl mx-auto'>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/overview' element={<OverviewPage />} />
              <Route path='/gaps' element={<GapAnalysisPage />} />
              <Route path='/update' element={<PRGeneratorPage />} />
            </Routes>
          </div>
        </Content>
      </Layout>

      {/* Background Orbs */}
      <div className='orb orb-1' />
      <div className='orb orb-2' />
      <div className='orb orb-3' />
    </Layout>
  );
};

const App: React.FC = () => {
  const { resolvedTheme } = useThemeMode();

  const themeConfig = useMemo(() => {
    const isDark = resolvedTheme === 'dark';

    return {
      algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        colorPrimary: '#6366f1',
        colorBgContainer: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
        colorBgElevated: isDark ? 'rgba(26, 26, 46, 0.95)' : '#ffffff',
        colorBorder: isDark ? 'rgba(255, 255, 255, 0.12)' : '#d9d9d9',
        colorText: isDark ? '#ffffff' : '#1f2937',
        colorTextSecondary: isDark ? '#a0a0b0' : '#6b7280',
        borderRadius: 12,
      },
      components: {
        Menu: {
          itemBg: 'transparent',
          itemSelectedBg: isDark
            ? 'rgba(99, 102, 241, 0.2)'
            : 'rgba(99, 102, 241, 0.12)',
          itemHoverBg: isDark
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(99, 102, 241, 0.06)',
          itemSelectedColor: '#6366f1',
        },
        Card: {
          colorBgContainer: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
        },
        Table: {
          colorBgContainer: 'transparent',
          headerBg: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f5f7fb',
          rowHoverBg: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f3f5ff',
        },
        Input: {
          colorBgContainer: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
        },
        Select: {
          colorBgContainer: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
          colorBgElevated: isDark ? 'rgba(26, 26, 46, 0.95)' : '#ffffff',
        },
      },
    };
  }, [resolvedTheme]);

  return (
    <ConfigProvider theme={themeConfig}>
      <Router basename={import.meta.env.BASE_URL}>
        <AppContent />
      </Router>
    </ConfigProvider>
  );
};

export default App;
