import React from 'react';
import { Button, Card, Col, Divider, Row, Space, Tag, Typography } from 'antd';
import {
  MailOutlined,
  GlobalOutlined,
  PhoneOutlined,
  ReadOutlined,
  ExperimentOutlined,
  SafetyOutlined,
  DotChartOutlined,
  ThunderboltOutlined,
  BuildOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph, Text } = Typography;

const makeTelHref = (value: string) => `tel:${value.replace(/[^\d+]/g, '')}`;
interface PiSectionItem {
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

interface PiLinkItem {
  title: string;
  href: string;
}

const iconMap: Record<string, React.ReactNode> = {
  highEntropyDoping: <SafetyOutlined />,
  agriWasteGreenChemistry: <BuildOutlined />,
  energyMaterialsApplications: <ThunderboltOutlined />,
  synthesisMethods: <ExperimentOutlined />,
  thermalTuning: <ReadOutlined />,
  characterization: <DotChartOutlined />,
  instrumentExperience: <ThunderboltOutlined />,
};

const PiPage: React.FC = () => {
  const { t } = useTranslation();
  const researchFocus = t('pi.researchFocusItems', {
    returnObjects: true,
  }) as PiSectionItem[];
  const methods = t('pi.methodsItems', {
    returnObjects: true,
  }) as PiSectionItem[];
  const collaborations = t('pi.collaborationsItems', {
    returnObjects: true,
  }) as string[];
  const highlights = t('pi.highlightsItems', {
    returnObjects: true,
  }) as PiLinkItem[];
  const links = t('pi.externalLinksItems', {
    returnObjects: true,
  }) as PiLinkItem[];

  return (
    <div className='space-y-10 md:space-y-14'>
      <section
        className='relative overflow-hidden rounded-3xl border border-white/10 p-8 md:p-12 shadow-2xl'
        style={{
          background:
            'linear-gradient(135deg, var(--color-bg-primary), var(--color-bg-secondary))',
        }}
      >
        <div className='absolute inset-0 opacity-70'>
          <div className='orb orb-1' style={{ top: '8%', left: '5%' }} />
          <div className='orb orb-2' style={{ top: '50%', right: '8%' }} />
        </div>
        <div className='relative z-10 max-w-4xl'>
          <Tag color='blue' className='mb-8 !border-0 !px-3 !py-1'>
            {t('pi.profileTag')}
          </Tag>
          <Title
            level={1}
            className='!mt-1 !mb-3 !text-4xl md:!text-6xl !font-black'
            style={{ color: 'var(--color-text-primary)' }}
          >
            {t('pi.heroTitle')}
          </Title>
          <Title
            level={3}
            className='!mb-5 !font-normal'
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {t('pi.heroSubtitle')}
          </Title>
          <Paragraph
            className='!text-lg !max-w-3xl !mb-6'
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {t('pi.heroDescription')}
          </Paragraph>
          <Space wrap size='middle'>
            <Button
              type='primary'
              href={`mailto:${t('pi.email')}`}
              icon={<MailOutlined />}
            >
              {t('pi.collaborationButton')}
            </Button>
            <Button
              ghost
              href={t('pi.profileUrl')}
              target='_blank'
              icon={<GlobalOutlined />}
            >
              {t('pi.viewProfileButton')}
            </Button>
          </Space>
        </div>
      </section>

      <Row gutter={[32, 32]}>
        <Col xs={24} lg={8}>
          <Card className='glass-card h-full'>
            <Text className='block mb-2 text-slate-400'>
              {t('pi.contactRole')}
            </Text>
            <Title
              level={3}
              className='!mb-2'
              style={{ color: 'var(--color-text-primary)' }}
            >
              {t('pi.profileName')}
            </Title>
            <Paragraph
              className='!mb-4'
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {t('pi.profileBio')}
            </Paragraph>
            <Divider />
            <Space direction='vertical' size={12}>
              <a
                href={makeTelHref(t('pi.phone'))}
                className='text-[var(--color-text-secondary)] hover:text-cyan-300 transition-colors'
              >
                <PhoneOutlined className='mr-2' />
                {t('pi.phone')}
              </a>
              <a
                href={`mailto:${t('pi.email')}`}
                className='text-[var(--color-text-secondary)] hover:text-cyan-300 transition-colors'
              >
                <MailOutlined className='mr-2' />
                {t('pi.email')}
              </a>
              <Text style={{ color: 'var(--color-text-secondary)' }}>
                {t('pi.officeHoursLabel')}
                {t('pi.officeHours')}
              </Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card className='glass-card h-full'>
            <Title
              level={3}
              className='!mb-4'
              style={{ color: 'var(--color-text-primary)' }}
            >
              {t('pi.researchFocusTitle')}
            </Title>
            <Row gutter={[16, 16]}>
              {researchFocus.map((item) => (
                <Col xs={24} md={8} key={item.title}>
                  <Card
                    className='h-full border-white/10'
                    style={{ background: 'var(--color-surface-1)' }}
                    styles={{ body: { height: '100%' } }}
                  >
                    <div className='text-2xl mb-3 text-cyan-300'>
                      {iconMap[item.icon] || <ReadOutlined />}
                    </div>
                    <Title
                      level={5}
                      className='!mb-2'
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {item.title}
                    </Title>
                    <Paragraph
                      className='!mb-3'
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {item.description}
                    </Paragraph>
                    <Space wrap>
                      {item.tags.map((tag) => (
                        <Tag className='research-tag' key={tag}>
                          {tag}
                        </Tag>
                      ))}
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <Card className='glass-card mb-2 md:mb-4'>
        <Title
          level={3}
          className='!mb-4'
          style={{ color: 'var(--color-text-primary)' }}
        >
          {t('pi.coreCapabilitiesTitle')}
        </Title>
        <Row gutter={[20, 20]}>
          {methods.map((item) => (
            <Col xs={24} md={12} key={item.title}>
              <div className='rounded-2xl border border-white/10 bg-white/5 p-6 h-full'>
                <div className='flex items-start gap-3'>
                  <div className='text-2xl text-indigo-300 mt-1'>
                    {iconMap[item.icon] || <ExperimentOutlined />}
                  </div>
                  <div className='flex-1'>
                    <Title
                      level={5}
                      className='!mb-1'
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {item.title}
                    </Title>
                    <Paragraph
                      className='!mb-2'
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {item.description}
                    </Paragraph>
                    <Space wrap>
                      {item.tags.map((tag) => (
                        <Tag className='research-tag' key={tag}>
                          {tag}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      <Row gutter={[32, 32]} className='mt-2 md:mt-4'>
        <Col xs={24} lg={10}>
          <Card className='glass-card h-full'>
            <Title
              level={3}
              className='!mb-4'
              style={{ color: 'var(--color-text-primary)' }}
            >
              {t('pi.collaborationTitle')}
            </Title>
            <ul className='space-y-3 pl-5 text-[var(--color-text-secondary)]'>
              {collaborations.map((item) => (
                <li key={item} className='marker:text-cyan-300'>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </Col>
        <Col xs={24} lg={14}>
          <Card className='glass-card h-full'>
            <Title
              level={3}
              className='!mb-4'
              style={{ color: 'var(--color-text-primary)' }}
            >
              {t('pi.outputsTitle')}
            </Title>
            <div className='space-y-4'>
              {highlights.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  target='_blank'
                  rel='noreferrer'
                  className='block rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-cyan-300/50 transition-colors'
                >
                  <Paragraph
                    className='!mb-0'
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {item.title}
                  </Paragraph>
                </a>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Card className='glass-card'>
        <Title
          level={3}
          className='!mb-4'
          style={{ color: 'var(--color-text-primary)' }}
        >
          {t('pi.externalLinksTitle')}
        </Title>
        <Row gutter={[16, 16]}>
          {links.map((item) => (
            <Col xs={24} md={8} key={item.href}>
              <a href={item.href} target='_blank' rel='noreferrer'>
                <div className='rounded-2xl border border-white/10 bg-white/5 p-4 h-full hover:border-cyan-300/50 transition-colors'>
                  <Text style={{ color: 'var(--color-text-primary)' }}>
                    {item.title}
                  </Text>
                </div>
              </a>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default PiPage;
