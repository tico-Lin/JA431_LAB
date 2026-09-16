import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  Divider,
  Pagination,
  Row,
  Space,
  Tag,
  Typography,
  Spin,
} from 'antd';
import {
  MailOutlined,
  GlobalOutlined,
  PhoneOutlined,
  ReadOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  SolutionOutlined,
  RadarChartOutlined,
  AppstoreOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { useLocale } from '../hooks/useLocale';

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

interface PiOutputItem {
  title: string;
  meta: string;
  href: string;
}

const iconMap: Record<string, React.ReactNode> = {
  highEntropyMaterials: <AppstoreOutlined />,
  highEntropyDoping: <SafetyOutlined />,
  aluminumIonBatteries: <ThunderboltOutlined />,
  synchrotronAnalysis: <RadarChartOutlined />,
  agriWasteGreenChemistry: <EnvironmentOutlined />,
  energyMaterialsApplications: <ThunderboltOutlined />,
};

const PiPage: React.FC = () => {
  const { resolvedLanguage } = useLocale();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [outputPages, setOutputPages] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const lang = resolvedLanguage === 'zh-TW' ? 'zh-TW' : 'en';
        const response = await fetch(
          `${import.meta.env.BASE_URL}data/piConfig.${lang}.json?t=${Date.now()}`,
        );
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setConfig(data);
      } catch (error) {
        console.error('Failed to load PI data', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [resolvedLanguage]);

  if (loading) {
    return (
      <div className='flex justify-center p-20'>
        <Spin size='large' />
      </div>
    );
  }

  if (!config) {
    return (
      <div className='text-center p-20 text-red-500'>
        Failed to load PI profile data.
      </div>
    );
  }

  const {
    heroTitle,
    heroSubtitle,
    heroDescription,
    profileName,
    profileBio,
    profileTag = 'PI Profile',
    contactRole = 'Director',
    phone,
    email,
    officeHoursLabel = 'Office Hours:',
    officeHours,
    profileUrl,
    researchFocusTitle = 'Research Focus',
    researchFocusItems = [],
    academicProfileTitle = 'Academic Profile',
    education,
    researchPositioning,
    specialtiesItems = [],
    collaborationTitle = 'Collaborations',
    collaborationsItems = [],
    outputsTitle = 'Outputs & Publications',
    outputCategories = {},
    outputsItems = {},
    externalLinksTitle = 'External Links',
    externalLinksItems = [],
    collaborationButton = 'Contact for Collaboration',
    viewProfileButton = 'View Full Profile',
  } = config;

  const outputEntries = Object.entries(
    outputCategories as Record<string, string>,
  );

  return (
    <div className='space-y-10 md:space-y-14'>
      <section
        className='relative overflow-hidden rounded-3xl border border-white/10 p-8 md:p-12 shadow-2xl'
        style={{ background: 'transparent' }}
      >
        <div className='absolute inset-0 opacity-70'></div>
        <div className='relative z-10 max-w-4xl'>
          <Tag color='blue' className='mb-8 !border-0 !px-3 !py-1'>
            {profileTag}
          </Tag>
          <Title
            level={1}
            className='!mt-1 !mb-3 !text-4xl md:!text-6xl !font-black'
            style={{ color: 'var(--color-text-primary)' }}
          >
            {heroTitle}
          </Title>
          <Title
            level={3}
            className='!mb-5 !font-normal'
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {heroSubtitle}
          </Title>
          <Paragraph
            className='!text-lg !max-w-3xl !mb-6'
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {heroDescription}
          </Paragraph>
          <Space wrap size='middle'>
            <Button
              type='primary'
              href={`mailto:${email}`}
              icon={<MailOutlined />}
            >
              {collaborationButton}
            </Button>
            {profileUrl && (
              <Button
                ghost
                href={profileUrl}
                target='_blank'
                icon={<GlobalOutlined />}
                style={{
                  color: 'var(--color-text-primary)',
                  borderColor: 'var(--color-text-primary)',
                }}
              >
                {viewProfileButton}
              </Button>
            )}
          </Space>
        </div>
      </section>

      <Row gutter={[32, 32]}>
        <Col xs={24} lg={8}>
          <Card className='glass-card h-full'>
            <Text className='block mb-2 text-[var(--color-text-muted)]'>
              {contactRole}
            </Text>
            <Title
              level={3}
              className='!mb-2'
              style={{ color: 'var(--color-text-primary)' }}
            >
              {profileName}
            </Title>
            <Paragraph
              className='!mb-4'
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {profileBio}
            </Paragraph>
            <Divider />
            <Space orientation='vertical' size={12}>
              {phone && (
                <a
                  href={makeTelHref(phone)}
                  className='text-[var(--color-text-secondary)] hover:text-cyan-300 transition-colors'
                >
                  <PhoneOutlined className='mr-2' />
                  {phone}
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className='text-[var(--color-text-secondary)] hover:text-cyan-300 transition-colors'
                >
                  <MailOutlined className='mr-2' />
                  {email}
                </a>
              )}
              {officeHours && (
                <div className='flex gap-1 text-[var(--color-text-secondary)]'>
                  <span className='shrink-0'>{officeHoursLabel}</span>
                  <span className='whitespace-pre-line'>{officeHours}</span>
                </div>
              )}
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
              {researchFocusTitle}
            </Title>
            <Row gutter={[16, 16]}>
              {(researchFocusItems as PiSectionItem[]).map((item) => (
                <Col xs={24} md={12} key={item.title}>
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
                      {item.tags?.map((tag) => (
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

      <Card className='glass-card'>
        <Row gutter={[32, 24]}>
          <Col xs={24} lg={8}>
            <div className='flex items-start gap-3'>
              <SolutionOutlined className='text-2xl text-indigo-300 mt-1' />
              <div>
                <Title
                  level={3}
                  className='!mb-2'
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {academicProfileTitle}
                </Title>
                <Text style={{ color: 'var(--color-text-secondary)' }}>
                  {education}
                </Text>
              </div>
            </div>
          </Col>
          <Col xs={24} lg={16}>
            <Paragraph
              className='!mb-4 !text-base'
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {researchPositioning}
            </Paragraph>
            <div className='flex flex-wrap gap-2'>
              {(specialtiesItems as string[]).map((specialty) => (
                <Tag className='research-tag' key={specialty}>
                  {specialty}
                </Tag>
              ))}
            </div>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Card className='glass-card h-full'>
            <Title
              level={3}
              className='!mb-4'
              style={{ color: 'var(--color-text-primary)' }}
            >
              {collaborationTitle}
            </Title>
            <ul className='space-y-3 pl-5 text-[var(--color-text-secondary)]'>
              {(collaborationsItems as string[]).map((item) => (
                <li key={item} className='marker:text-cyan-300'>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>

      <section>
        <Title
          level={3}
          className='!mb-4'
          style={{ color: 'var(--color-text-primary)' }}
        >
          {outputsTitle}
        </Title>
        <Row gutter={[24, 24]}>
          {outputEntries.map(([category, label]) => {
            const categoryOutputs =
              (outputsItems as Record<string, PiOutputItem[]>)[category] ?? [];
            const currentPage = outputPages[category] ?? 1;
            const pageItems = categoryOutputs.slice(
              (currentPage - 1) * 4,
              currentPage * 4,
            );

            return (
              <Col xs={24} md={12} key={category}>
                <Card
                  className='pi-output-card glass-card h-full'
                  title={label}
                >
                  <div className='pi-output-list'>
                    {pageItems.map((item) => (
                      <a
                        key={item.title}
                        href={item.href}
                        target='_blank'
                        rel='noreferrer'
                        className='pi-output-item'
                      >
                        <Text
                          strong
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {item.title}
                        </Text>
                        <Text
                          className='block mt-1'
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {item.meta}
                        </Text>
                      </a>
                    ))}
                  </div>
                  <Pagination
                    className='mt-4'
                    align='center'
                    current={currentPage}
                    pageSize={4}
                    total={categoryOutputs.length}
                    showSizeChanger={false}
                    hideOnSinglePage
                    onChange={(page) =>
                      setOutputPages((pages) => ({
                        ...pages,
                        [category]: page,
                      }))
                    }
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
      </section>

      {externalLinksItems && externalLinksItems.length > 0 && (
        <Card className='glass-card'>
          <Title
            level={3}
            className='!mb-4'
            style={{ color: 'var(--color-text-primary)' }}
          >
            {externalLinksTitle}
          </Title>
          <Row gutter={[16, 16]}>
            {(externalLinksItems as PiLinkItem[]).map((item) => (
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
      )}
    </div>
  );
};

export default PiPage;
