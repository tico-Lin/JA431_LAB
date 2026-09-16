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
  Collapse,
} from 'antd';
import { CloudUploadOutlined, SettingOutlined } from '@ant-design/icons';
import { DynamicForm, type FieldSchema } from './DynamicForm';
import { useDataSync } from '../../hooks/useDataSync';
import { GitHubTokenModal } from './GitHubTokenModal';

const { Title, Text } = Typography;

const heroSchema: FieldSchema[] = [
  {
    name: 'title',
    label: '大標題',
    type: 'string',
    required: true,
    tooltip: '首頁最大的發光文字',
  },
  {
    name: 'subtitle',
    label: '副標題',
    type: 'string',
    tooltip: '大標題下方的說明文字',
  },
  {
    name: 'description',
    label: '介紹描述',
    type: 'text',
    tooltip: 'Hero 區塊的詳細介紹段落',
  },
];

const labSchema: FieldSchema[] = [
  {
    name: 'name',
    label: '實驗室簡稱',
    type: 'string',
    required: true,
    tooltip: '例如：有機-無機儲能材料研究室',
  },
  {
    name: 'fullName',
    label: '實驗室全名',
    type: 'string',
    tooltip: '例如：靜宜大學化學系 有機-無機儲能材料研究室',
  },
  { name: 'institution', label: '所屬單位', type: 'string' },
  {
    name: 'description',
    label: '實驗室介紹',
    type: 'text',
    tooltip: '用於首頁「關於我們」區塊的長篇敘述',
  },
  { name: 'website', label: '官方網站網址', type: 'string' },
];

const directorSchema: FieldSchema[] = [
  { name: 'name', label: '主持人姓名', type: 'string' },
  { name: 'title', label: '職稱', type: 'string' },
  { name: 'email', label: '聯絡信箱', type: 'string' },
  { name: 'education', label: '最高學歷', type: 'string' },
  { name: 'bio', label: '簡介', type: 'text' },
  {
    name: 'expertise',
    label: '專長標籤 (按下 Enter 建立標籤)',
    type: 'string-list',
  },
  { name: 'profileUrl', label: '個人介紹連結', type: 'string' },
  { name: 'publicationsUrl', label: '著作列表連結', type: 'string' },
];

const featuresSchema: FieldSchema[] = [
  {
    name: 'features',
    label: '核心能力區塊',
    type: 'object-list',
    placeholder: '新增一項能力',
    subFields: [
      { name: 'title', label: '能力名稱', type: 'string', required: true },
      { name: 'description', label: '能力說明', type: 'text' },
      {
        name: 'methods',
        label: '包含技術 (按下 Enter 建立標籤)',
        type: 'string-list',
      },
      {
        name: 'icon',
        label: '圖示代碼 (如 ExperimentOutlined)',
        type: 'string',
      },
    ],
  },
];

const researchDirectionsSchema: FieldSchema[] = [
  {
    name: 'researchDirections',
    label: '研究方向區塊',
    type: 'object-list',
    placeholder: '新增研究方向',
    subFields: [
      { name: 'title', label: '方向名稱', type: 'string', required: true },
      { name: 'description', label: '方向說明', type: 'text' },
      { name: 'href', label: '代表作或連結網址', type: 'string' },
    ],
  },
];

export const HomeConfigAdmin: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [language, setLanguage] = useState<'zh-TW' | 'en'>('zh-TW');

  const { saveData, isSyncing } = useDataSync({
    repoOwner: 'tico-Lin',
    repoName: 'JA431_LAB',
    onRequireToken: () => setIsTokenModalOpen(true),
  });

  const [heroForm] = Form.useForm();
  const [labForm] = Form.useForm();
  const [directorForm] = Form.useForm();
  const [featuresForm] = Form.useForm();
  const [researchForm] = Form.useForm();

  const loadData = async (lang: string) => {
    setLoading(true);
    try {
      const fileName = `homeConfig.${lang}.json`;
      const response = await fetch(
        `${import.meta.env.BASE_URL}data/${fileName}?t=${new Date().getTime()}`,
      );
      const json = await response.json();
      setData(json);
      heroForm.setFieldsValue(json.hero);
      labForm.setFieldsValue(json.lab);
      directorForm.setFieldsValue(json.lab?.director || {});
      featuresForm.setFieldsValue({ features: json.features || [] });
      researchForm.setFieldsValue({
        researchDirections: json.researchDirections || [],
      });
    } catch (err) {
      message.error(`無法載入 ${lang} 首頁設定`);
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
      const labValues = await labForm.validateFields();
      const directorValues = await directorForm.validateFields();
      const featuresValues = await featuresForm.validateFields();
      const researchValues = await researchForm.validateFields();

      const newConfig = {
        ...data,
        hero: heroValues,
        lab: { ...data.lab, ...labValues, director: directorValues },
        features: featuresValues.features,
        researchDirections: researchValues.researchDirections,
      };

      const fileName = `public/data/homeConfig.${language}.json`;
      const success = await saveData(
        fileName,
        newConfig,
        `Update ${language} home config via Admin Panel`,
      );
      if (success) setData(newConfig);
    } catch (err) {
      message.error('請檢查表單中是否有未填寫的必填欄位。');
    }
  };

  if (loading) return <div className='p-10 text-center'>載入中...</div>;

  return (
    <Card
      title={
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div>
            <Title level={5} className='!m-0 text-[var(--color-text-primary)]'>
              首頁資訊設定 (Home Config)
            </Title>
            <Text type='secondary' className='text-xs'>
              更新後約需 2 分鐘才會反映至前台
            </Text>
          </div>
          <Space>
            <Select
              value={language}
              onChange={setLanguage}
              options={[
                { value: 'zh-TW', label: '編輯中文版 (zh-TW)' },
                { value: 'en', label: '編輯英文版 (en)' },
              ]}
              className='w-48'
            />
            <Tooltip title='設定 GitHub Token'>
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
              儲存並自動部署
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

      <Collapse
        defaultActiveKey={['hero', 'lab', 'features', 'research']}
        className='glass-card !bg-[var(--color-surface-2)] border-[var(--shell-border)]'
        items={[
          {
            key: 'hero',
            label: (
              <span className='text-[var(--color-text-primary)] font-semibold'>
                Hero (橫幅) 區塊
              </span>
            ),
            children: <DynamicForm form={heroForm} schema={heroSchema} />,
          },
          {
            key: 'lab',
            label: (
              <span className='text-[var(--color-text-primary)] font-semibold'>
                實驗室與主持人資訊
              </span>
            ),
            children: (
              <div className='space-y-6'>
                <div>
                  <Title
                    level={5}
                    className='mb-4 text-[var(--color-text-primary)] border-b border-[var(--shell-border)] pb-2'
                  >
                    基本資訊
                  </Title>
                  <DynamicForm form={labForm} schema={labSchema} />
                </div>
                <div>
                  <Title
                    level={5}
                    className='mb-4 text-[var(--color-text-primary)] border-b border-[var(--shell-border)] pb-2'
                  >
                    實驗室主持人 (PI) 簡介卡片
                  </Title>
                  <DynamicForm form={directorForm} schema={directorSchema} />
                </div>
              </div>
            ),
          },
          {
            key: 'features',
            label: (
              <span className='text-[var(--color-text-primary)] font-semibold'>
                核心能力 (Features)
              </span>
            ),
            children: (
              <DynamicForm form={featuresForm} schema={featuresSchema} />
            ),
          },
          {
            key: 'research',
            label: (
              <span className='text-[var(--color-text-primary)] font-semibold'>
                研究方向 (Research Directions)
              </span>
            ),
            children: (
              <DynamicForm
                form={researchForm}
                schema={researchDirectionsSchema}
              />
            ),
          },
        ]}
      />
    </Card>
  );
};
