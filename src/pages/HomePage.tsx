import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Statistic,
  Space,
  Spin,
} from 'antd';
import {
  TeamOutlined,
  SearchOutlined,
  PullRequestOutlined,
  GlobalOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../hooks/useLocale';

const { Title, Paragraph, Text } = Typography;

interface HomeConfig {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  lab: {
    name: string;
    fullName: string;
    institution: string;
    description: string;
    website?: string;
    director?: {
      name: string;
      title: string;
      email?: string;
    };
  };
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  statistics: {
    showStats: boolean;
    customStats: Array<{
      title: string;
      value: number;
      suffix?: string;
    }>;
  };
  quickLinks: Array<{
    title: string;
    description: string;
    link: string;
    icon: string;
  }>;
}

interface SkillsData {
  categories: Array<{ id: string; name: string }>;
  skills: Array<{ id: string; name: string }>;
  members: Array<{
    id: string;
    name: string;
    skills: Array<{ skillId: string }>;
  }>;
}

const iconMap: Record<string, React.ReactNode> = {
  TeamOutlined: <TeamOutlined />,
  SearchOutlined: <SearchOutlined />,
  PullRequestOutlined: <PullRequestOutlined />,
  RocketOutlined: <RocketOutlined />,
};

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { resolvedLanguage } = useLocale();
  const [config, setConfig] = useState<HomeConfig | null>(null);
  const [stats, setStats] = useState<{
    members: number;
    skills: number;
    categories: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const configFile =
          resolvedLanguage === 'zh-TW'
            ? 'homeConfig.zh-TW.json'
            : 'homeConfig.en.json';

        const [configRes, skillsRes] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}data/${configFile}`),
          fetch(`${import.meta.env.BASE_URL}data/skillsData.json`),
        ]);

        const configData = await configRes.json();
        const skillsData: SkillsData = await skillsRes.json();

        setConfig(configData);
        setStats({
          members: skillsData.members.length,
          skills: skillsData.skills.length,
          categories: skillsData.categories.length,
        });
      } catch (error) {
        console.error('Failed to load home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [resolvedLanguage]);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Spin size='large' />
      </div>
    );
  }

  if (!config) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Text type='danger'>{t('home.failedConfig')}</Text>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <div
        className='relative overflow-hidden'
        style={{
          background:
            'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
        }}
      >
        <div className='absolute inset-0'>
          <div className='orb orb-1' style={{ top: '10%', left: '10%' }} />
          <div className='orb orb-2' style={{ top: '60%', right: '15%' }} />
        </div>
        <div className='container mx-auto px-4 py-20 md:py-32 relative z-10'>
          <div className='text-center max-w-4xl mx-auto'>
            <Title
              level={1}
              className='!text-5xl md:!text-7xl !mb-6 !font-bold'
              style={{
                background:
                  'linear-gradient(to right, var(--color-stat-primary), var(--color-stat-secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {config.hero.title}
            </Title>
            <Title
              level={3}
              className='!mb-4 !font-normal'
              style={{ color: 'var(--color-text-primary)' }}
            >
              {config.hero.subtitle}
            </Title>
            <Paragraph
              className='!text-lg !mb-8'
              style={{ color: 'var(--color-text-muted)' }}
            >
              {config.hero.description}
            </Paragraph>
            <Space size='large' wrap>
              <Link to='/pi'>
                <Button
                  type='primary'
                  size='large'
                  icon={<RocketOutlined />}
                  className='shadow-lg hover:shadow-xl'
                >
                  {t('home.visitPiProfile')}
                </Button>
              </Link>
              <Link to='/overview'>
                <Button
                  size='large'
                  icon={<GlobalOutlined />}
                  ghost
                  className='!border-[var(--shell-border)] hover:!bg-[var(--color-surface-1)]'
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {t('home.viewResearchCapabilities')}
                </Button>
              </Link>
            </Space>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      {config.statistics.showStats && stats && (
        <div className='container mx-auto px-4 py-12 bg-transparent'>
          <Card
            className='backdrop-blur-md border-white/10 shadow-2xl'
            style={{
              background: 'var(--color-surface-1)',
              borderRadius: '16px',
            }}
          >
            <Row gutter={[24, 24]} justify='center'>
              <Col xs={24} sm={8} md={8}>
                <Statistic
                  title={
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      {t('home.teamMembers')}
                    </span>
                  }
                  value={stats.members}
                  valueStyle={{
                    color: 'var(--color-stat-primary)',
                    fontSize: '2.5rem',
                  }}
                  prefix={<TeamOutlined />}
                />
              </Col>
              <Col xs={24} sm={8} md={8}>
                <Statistic
                  title={
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      {t('home.skillsTracked')}
                    </span>
                  }
                  value={stats.skills}
                  valueStyle={{
                    color: 'var(--color-stat-secondary)',
                    fontSize: '2.5rem',
                  }}
                  prefix={<RocketOutlined />}
                />
              </Col>
              <Col xs={24} sm={8} md={8}>
                <Statistic
                  title={
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      {t('home.categories')}
                    </span>
                  }
                  value={stats.categories}
                  valueStyle={{
                    color: 'var(--color-stat-tertiary)',
                    fontSize: '2.5rem',
                  }}
                  prefix={<SearchOutlined />}
                />
              </Col>
              {config.statistics.customStats.map((stat, index) => (
                <Col xs={24} sm={8} md={8} key={index}>
                  <Statistic
                    title={
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        {stat.title}
                      </span>
                    }
                    value={stat.value}
                    suffix={stat.suffix}
                    valueStyle={{
                      color: 'var(--color-stat-primary)',
                      fontSize: '2.5rem',
                    }}
                  />
                </Col>
              ))}
            </Row>
          </Card>
        </div>
      )}

      {/* About Lab Section */}
      <div className='container mx-auto px-4 py-12 bg-transparent'>
        <Card
          className='backdrop-blur-md border-white/10 shadow-2xl'
          style={{
            background: 'var(--color-surface-1)',
            borderRadius: '16px',
          }}
        >
          <Title
            level={2}
            className='!mb-4'
            style={{ color: 'var(--color-text-primary)' }}
          >
            {t('home.aboutLab', { name: config.lab.name })}
          </Title>
          <Title
            level={4}
            className='!mb-2 !font-normal'
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {config.lab.fullName}
          </Title>
          <Paragraph
            className='!text-base !mb-4'
            style={{ color: 'var(--color-text-muted)' }}
          >
            {config.lab.institution}
          </Paragraph>
          <Paragraph
            className='!text-lg !mb-6'
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {config.lab.description}
          </Paragraph>
          {config.lab.director && (
            <div className='backdrop-blur-sm p-4 rounded-lg border border-[var(--shell-border)] bg-[var(--color-surface-1)]'>
              <Text
                style={{ color: 'var(--color-text-muted)' }}
                className='block mb-1'
              >
                {t('home.labDirector')}
              </Text>
              <Text
                style={{ color: 'var(--color-text-primary)' }}
                className='text-lg font-semibold block'
              >
                {config.lab.director.name}
              </Text>
              <Text
                style={{ color: 'var(--color-text-secondary)' }}
                className='block'
              >
                {config.lab.director.title}
              </Text>
              {config.lab.director.email && (
                <a
                  href={`mailto:${config.lab.director.email}`}
                  className='!text-indigo-400 hover:!text-indigo-300 transition-colors'
                >
                  {config.lab.director.email}
                </a>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Features Section */}
      <div className='container mx-auto px-4 py-12 bg-transparent'>
        <Title
          level={2}
          className='text-center !mb-8'
          style={{ color: 'var(--color-text-primary)' }}
        >
          {t('home.keyFeatures')}
        </Title>
        <Row gutter={[24, 24]}>
          {config.features.map((feature, index) => (
            <Col xs={24} md={8} key={index}>
              <Card
                className='backdrop-blur-md border-white/10 h-full hover:shadow-xl transition-all duration-300 hover:scale-105'
                bordered={false}
                style={{
                  background: 'var(--color-surface-1)',
                  borderRadius: '16px',
                }}
              >
                <div className='text-center'>
                  <div className='text-5xl mb-4 text-indigo-400'>
                    {iconMap[feature.icon] || <RocketOutlined />}
                  </div>
                  <Title
                    level={4}
                    className='!mb-3'
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {feature.title}
                  </Title>
                  <Paragraph style={{ color: 'var(--color-text-secondary)' }}>
                    {feature.description}
                  </Paragraph>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Quick Links Section */}
      <div className='container mx-auto px-4 py-12 pb-20 bg-transparent'>
        <Title
          level={2}
          className='text-center !mb-8'
          style={{ color: 'var(--color-text-primary)' }}
        >
          {t('home.quickLinks')}
        </Title>
        <Row gutter={[24, 24]}>
          {config.quickLinks.map((link, index) => (
            <Col xs={24} md={8} key={index}>
              <Link to={link.link}>
                <Card
                  className='backdrop-blur-md border-white/10 h-full hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer'
                  bordered={false}
                  style={{
                    background: 'var(--color-surface-1)',
                    borderRadius: '16px',
                  }}
                >
                  <div className='flex items-start gap-4'>
                    <div className='text-3xl text-purple-400'>
                      {iconMap[link.icon] || <RocketOutlined />}
                    </div>
                    <div className='flex-1'>
                      <Title
                        level={5}
                        className='!mb-2'
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {link.title}
                      </Title>
                      <Paragraph
                        className='!mb-0'
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {link.description}
                      </Paragraph>
                    </div>
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      {/* Footer */}
      <div className='container mx-auto px-4 py-10 bg-transparent'>
        <div className='glass-card px-6 py-6 text-center'>
          <Space size='middle' wrap>
            <a
              href='https://github.com/tico-Lin/JA431_LAB'
              target='_blank'
              rel='noopener noreferrer'
              className='transition-colors'
              style={{ color: 'var(--color-text-muted)' }}
            >
              {t('home.templateProvided')}
            </a>
            {config.lab.website && (
              <>
                <span style={{ color: 'var(--color-text-muted)' }}>|</span>
                <a
                  href={config.lab.website}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='transition-colors'
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <GlobalOutlined /> {t('home.labWebsite')}
                </a>
              </>
            )}
          </Space>
          <Paragraph
            className='!mt-4 !mb-0'
            style={{ color: 'var(--color-text-muted)' }}
          >
            © {new Date().getFullYear()} {config.lab.name}. All rights{' '}
            {t('home.rightsReserved')}
          </Paragraph>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
