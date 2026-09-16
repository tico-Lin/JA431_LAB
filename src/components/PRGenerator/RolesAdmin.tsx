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
import { useDataSync } from '../../hooks/useDataSync';
import { GitHubTokenModal } from './GitHubTokenModal';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

export const RolesAdmin: React.FC = () => {
  const { t } = useTranslation();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const { saveData, isSyncing } = useDataSync({
    repoOwner: 'tico-Lin',
    repoName: 'JA431_LAB',
    onRequireToken: () => setIsTokenModalOpen(true),
  });

  const [form] = Form.useForm();

  const allPaths = [
    { value: '/', label: t('admin.rolesAdmin.pageNames.home') },
    { value: '/pi', label: t('admin.rolesAdmin.pageNames.pi') },
    { value: '/overview', label: t('admin.rolesAdmin.pageNames.overview') },
    { value: '/services', label: t('admin.rolesAdmin.pageNames.services') },
    { value: '/gaps', label: t('admin.rolesAdmin.pageNames.gaps') },
    { value: '/update', label: t('admin.rolesAdmin.pageNames.update') },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}data/roles.json`,
        );
        const json = await response.json();
        setData(json);
        form.setFieldsValue(json.rolePermissions);
      } catch (err) {
        message.error('Failed to load roles.json');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const newConfig = {
        ...data,
        rolePermissions: values,
      };

      await saveData(
        'public/data/roles.json',
        newConfig,
        'Update Roles Permissions via Admin Panel',
      );
      setData(newConfig);
    } catch (err) {
      message.error(t('admin.rolesAdmin.formError'));
    }
  };

  if (loading) return <div>{t('common.loadingData')}</div>;

  return (
    <Card
      title={
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div>
            <Title level={5} className='!m-0 text-[var(--color-text-primary)]'>
              {t('admin.rolesAdmin.title')}
            </Title>
            <Text type='secondary' className='text-xs'>
              {t('admin.rolesAdmin.subtitle')}
            </Text>
          </div>
          <Space>
            <Tooltip title={t('admin.rolesAdmin.setToken')}>
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
              {t('admin.rolesAdmin.saveDeploy')}
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

      <Form form={form} layout='vertical'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {data?.roles?.map((role: string) => {
            const roleName = t(`admin.rolesAdmin.roleNames.${role}`, role);
            return (
              <Form.Item
                key={role}
                name={role}
                label={
                  <span className='font-semibold text-lg'>{roleName}</span>
                }
                className='bg-black/10 p-4 rounded-lg border border-[var(--shell-border)]'
              >
                <Select
                  mode='multiple'
                  options={allPaths}
                  placeholder={t('admin.rolesAdmin.selectPages', {
                    role: roleName,
                  })}
                />
              </Form.Item>
            );
          })}
        </div>
      </Form>
    </Card>
  );
};
