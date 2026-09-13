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
  ReadOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import HomePage from './pages/HomePage';
import PiPage from './pages/PiPage';
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
    <div className='hidden md:block fixed top-3 right-22 z-[60]'>
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
      key: '/pi',
      icon: <ReadOutlined />,
      label: <Link to='/pi'>{t('nav.pi')}</Link>,
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
        <div className='h-16 flex items-center gap-3 px-4 border-b border-white/10'>
          <MenuOutlined
            className='text-[var(--color-text-primary)] text-xl cursor-pointer shrink-0'
            onClick={() => setCollapsed(!collapsed)}
          />
          <Link to='/' className='flex items-center gap-2 min-w-0'>
            <img
              src={`${import.meta.env.BASE_URL}logo.svg`}
              alt={t('appName')}
              className='w-8 h-8'
            />
            {!collapsed && (
              <span className='text-lg font-bold truncate bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent'>
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
            <div className='border-t border-[var(--shell-border)] p-3'>
              <SettingsControls mobile />
            </div>
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
          className='p-4 md:p-8 !pt-20 md:pt-20'
          style={{
            background: 'transparent',
            minHeight: '100vh',
          }}
        >
          <div className='max-w-7xl mx-auto'>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/pi' element={<PiPage />} />
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
    return {
      algorithm:
        resolvedTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        colorPrimary: 'var(--color-accent)',
        colorBgContainer: 'var(--color-surface-1)',
        colorBgElevated: 'var(--color-bg-card)',
        colorBorder: 'var(--shell-border)',
        colorText: 'var(--color-text-primary)',
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
