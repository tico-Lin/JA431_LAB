import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Form,
  message,
  Typography,
  Space,
  Tooltip,
  Select,
} from 'antd';
import { CloudUploadOutlined, SettingOutlined } from '@ant-design/icons';
import { DynamicForm, type FieldSchema } from './DynamicForm';
import { useDataSync } from '../../hooks/useDataSync';
import { GitHubTokenModal } from './GitHubTokenModal';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const heroSchema: FieldSchema[] = [
  { name: 'profileTag', label: '標籤', type: 'string' },
  {
    name: 'heroTitle',
    label: '大標題 (姓名職稱)',
    type: 'string',
    required: true,
  },
  { name: 'heroSubtitle', label: '副標題', type: 'string' },
  { name: 'heroDescription', label: '詳細介紹', type: 'text' },
];

const contactSchema: FieldSchema[] = [
  { name: 'contactRole', label: '聯絡人角色', type: 'string' },
  { name: 'profileName', label: '姓名', type: 'string' },
  { name: 'profileBio', label: '簡短自介', type: 'text' },
  { name: 'phone', label: '聯絡電話', type: 'string' },
  { name: 'email', label: '聯絡信箱', type: 'string' },
  { name: 'officeHoursLabel', label: '辦公時間標籤', type: 'string' },
  { name: 'officeHours', label: '辦公時間 (可換行)', type: 'text' },
  { name: 'profileUrl', label: '個人介紹網址', type: 'string' },
  { name: 'collaborationButton', label: '合作按鈕文字', type: 'string' },
  { name: 'viewProfileButton', label: '查看簡歷按鈕文字', type: 'string' },
];

const academicSchema: FieldSchema[] = [
  { name: 'academicProfileTitle', label: '學術背景區塊標題', type: 'string' },
  { name: 'education', label: '最高學歷', type: 'string' },
  { name: 'researchPositioning', label: '研究定位說明', type: 'text' },
  {
    name: 'specialtiesItems',
    label: '研究專長標籤 (按下 Enter 新增)',
    type: 'string-list',
  },
];

const researchFocusSchema: FieldSchema[] = [
  { name: 'researchFocusTitle', label: '研究重點區塊標題', type: 'string' },
  {
    name: 'researchFocusItems',
    label: '研究重點項目',
    type: 'object-list',
    placeholder: '新增研究重點',
    subFields: [
      { name: 'title', label: '標題', type: 'string', required: true },
      { name: 'description', label: '說明', type: 'text' },
      { name: 'tags', label: '標籤 (按下 Enter 新增)', type: 'string-list' },
      { name: 'icon', label: '圖示名稱', type: 'string' },
    ],
  },
];

export const PiConfigAdmin: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [language, setLanguage] = useState<'zh-TW' | 'en'>('zh-TW');
  const { t } = useTranslation();

  const { saveData, isSyncing } = useDataSync({
    repoOwner: 'tico-Lin',
    repoName: 'JA431_LAB',
    onRequireToken: () => setIsTokenModalOpen(true),
  });

  const [heroForm] = Form.useForm();
  const [contactForm] = Form.useForm();
  const [academicForm] = Form.useForm();
  const [researchForm] = Form.useForm();

  const loadData = async (lang: string) => {
    setLoading(true);
    try {
      const fileName = `piConfig.${lang}.json`;
      const response = await fetch(
        `${import.meta.env.BASE_URL}data/${fileName}?t=${new Date().getTime()}`,
      );
      const json = await response.json();
      setData(json);
      heroForm.setFieldsValue(json);
      contactForm.setFieldsValue(json);
      academicForm.setFieldsValue(json);
      researchForm.setFieldsValue(json);
    } catch (err) {
      message.error(`Failed to load ${lang} PI config`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(language);
  }, [language]);

  const handleSave = async () => {
    try {
      const heroValues = await heroForm.validateFields();
      const contactValues = await contactForm.validateFields();
      const academicValues = await academicForm.validateFields();
      const researchValues = await researchForm.validateFields();

      const newConfig = {
        ...data,
        ...heroValues,
        ...contactValues,
        ...academicValues,
        ...researchValues,
      };

      const fileName = `public/data/piConfig.${language}.json`;
      const success = await saveData(
        fileName,
        newConfig,
        `Update ${language} PI config via Admin Panel`,
      );
      if (success) setData(newConfig);
    } catch (err) {
      message.error(t('admin.rolesAdmin.formError'));
    }
  };

  if (loading)
    return <div className='p-10 text-center'>{t('common.loadingData')}</div>;

  return (
    <Card
      title={
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div>
            <Title level={5} className='!m-0 text-[var(--color-text-primary)]'>
              {t('admin.piConfig.title')}
            </Title>
            <Text type='secondary' className='text-xs'>
              {t('admin.piConfig.delayNote')}
            </Text>
          </div>
          <Space>
            <Select
              value={language}
              onChange={setLanguage}
              options={[
                { value: 'zh-TW', label: t('admin.piConfig.editZh') },
                { value: 'en', label: t('admin.piConfig.editEn') },
              ]}
              className='w-48'
            />
            <Tooltip title={t('admin.piConfig.setToken')}>
              <Button
                icon={<SettingOutlined />}
                onClick={() => setIsTokenModalOpen(true)}
              />
            </Tooltip>
            <Button
              type='primary'
              icon={<CloudUploadOutlined />}
              onClick={handleSave}
              loading={isSyncing}
            >
              {t('admin.piConfig.saveDeploy')}
            </Button>
          </Space>
        </div>
      }
      className='bg-[var(--color-surface-1)] border-[var(--shell-border)]'
    >
      <GitHubTokenModal
        open={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
      />

      <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
        <div className='space-y-8'>
          <div>
            <Title
              level={5}
              className='mb-4 text-[var(--color-text-primary)] border-b border-[var(--shell-border)] pb-2'
            >
              {t('admin.piConfig.heroSection')}
            </Title>
            <DynamicForm form={heroForm} schema={heroSchema} />
          </div>
          <div>
            <Title
              level={5}
              className='mb-4 text-[var(--color-text-primary)] border-b border-[var(--shell-border)] pb-2'
            >
              {t('admin.piConfig.contactInfo')}
            </Title>
            <DynamicForm form={contactForm} schema={contactSchema} />
          </div>
          <div>
            <Title
              level={5}
              className='mb-4 text-[var(--color-text-primary)] border-b border-[var(--shell-border)] pb-2'
            >
              {t('admin.piConfig.academicBg')}
            </Title>
            <DynamicForm form={academicForm} schema={academicSchema} />
          </div>
        </div>

        <div className='space-y-8'>
          <div>
            <Title
              level={5}
              className='mb-4 text-[var(--color-text-primary)] border-b border-[var(--shell-border)] pb-2'
            >
              {t('admin.piConfig.researchFocus')}
            </Title>
            <DynamicForm form={researchForm} schema={researchFocusSchema} />
          </div>
        </div>
      </div>
    </Card>
  );
};
