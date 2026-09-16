import React, { useState } from 'react';
import { Card, Table, Input, Button, message, Typography, Space } from 'antd';
import { CopyOutlined, LinkOutlined, KeyOutlined } from '@ant-design/icons';
import { ROLE_PERMISSIONS } from '../../config/roles';
import type { Role } from '../../config/roles';
import { sha256 } from '../../utils/crypto';
import { useTranslation } from 'react-i18next';

const { Text, Title, Paragraph } = Typography;

interface RoleAccessAdminProps {
  onGeneratePR?: (content: string) => void;
}

export const RoleAccessAdmin: React.FC<RoleAccessAdminProps> = ({
  onGeneratePR,
}) => {
  const { t } = useTranslation();
  const [plainText, setPlainText] = useState('');
  const [hashResult, setHashResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const pages = [
    { key: '/', label: t('pr.pages.home') },
    { key: '/pi', label: t('pr.pages.pi') },
    { key: '/services', label: t('pr.pages.services') },
    { key: '/overview', label: t('pr.pages.overview') },
    { key: '/gaps', label: t('pr.pages.gaps') },
    { key: '/update', label: t('pr.pages.update') },
  ];

  const columns = [
    {
      title: t('pr.roleColumn'),
      dataIndex: 'role',
      key: 'role',
      render: (role: Role) => <Text strong>{t(`role.${role}`)}</Text>,
    },
    ...pages.map((page) => ({
      title: page.label,
      dataIndex: page.key,
      key: page.key,
      render: (hasAccess: boolean) => (
        <span
          className={
            hasAccess ? 'text-green-500 font-bold' : 'text-gray-500 opacity-30'
          }
        >
          {hasAccess ? '✓' : '—'}
        </span>
      ),
      align: 'center' as const,
    })),
  ];

  const dataSource = (Object.keys(ROLE_PERMISSIONS) as Role[]).map((role) => {
    const rowData: any = { key: role, role };
    pages.forEach((page) => {
      rowData[page.key] = ROLE_PERMISSIONS[role].includes(page.key);
    });
    return rowData;
  });

  const handleGenerateHash = async () => {
    if (!plainText.trim()) return;
    setIsGenerating(true);
    try {
      const hash = await sha256(plainText.trim());
      setHashResult(hash);
    } catch (e) {
      message.error(t('pr.hashGenerateFailed'));
    } finally {
      setIsGenerating(false);
    }
  };

  const copyHash = () => {
    if (!hashResult) return;
    navigator.clipboard.writeText(hashResult);
    message.success(t('pr.hashGenerateSuccess'));
  };

  const copyLink = () => {
    if (!hashResult) return;
    const url = new URL(window.location.origin + import.meta.env.BASE_URL);
    url.searchParams.set('key', hashResult);
    navigator.clipboard.writeText(url.toString());
    message.success(t('pr.linkGenerateSuccess'));
  };

  return (
    <Card
      className='mt-8 border border-[var(--shell-border)]'
      style={{ background: 'var(--color-surface-1)' }}
      title={
        <div className='flex items-center gap-2'>
          <KeyOutlined className='text-[var(--color-accent)]' />
          <span>{t('pr.roleAccessAdminTitle')}</span>
        </div>
      }
    >
      <div className='flex flex-col xl:flex-row gap-8'>
        <div className='flex-1'>
          <Title
            level={5}
            className='!text-[var(--color-text-primary)] !mt-0 !mb-4'
          >
            {t('pr.permissionsMatrix')}
          </Title>
          <div className='overflow-x-auto'>
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              size='small'
              bordered
              className='bg-transparent'
            />
          </div>
          <Paragraph className='mt-2 text-xs text-[var(--color-text-secondary)]'>
            * {t('pr.permissionsMatrixDesc')}
          </Paragraph>
        </div>

        <div className='xl:w-1/3 flex flex-col'>
          <Title
            level={5}
            className='!text-[var(--color-text-primary)] !mt-0 !mb-4'
          >
            {t('pr.hashTool')}
          </Title>
          <div className='p-4 rounded-xl border border-[var(--shell-border)] bg-[var(--color-surface-2)] flex flex-col gap-4'>
            <div>
              <div className='text-sm mb-1 text-[var(--color-text-secondary)]'>
                {t('pr.plainText')}
              </div>
              <Input.Search
                placeholder={t('pr.plainTextPlaceholder')}
                value={plainText}
                onChange={(e) => setPlainText(e.target.value)}
                enterButton={t('pr.generateHash')}
                onSearch={handleGenerateHash}
                loading={isGenerating}
                size='large'
              />
            </div>

            {hashResult && (
              <div className='animate-fade-in'>
                <div className='text-sm mb-1 text-[var(--color-text-secondary)]'>
                  {t('pr.hashResult')}
                </div>
                <div className='p-3 bg-black/30 rounded font-mono text-xs break-all text-[var(--color-text-primary)] border border-white/5 mb-3'>
                  {hashResult}
                </div>
                <Space className='w-full mb-3'>
                  <Button
                    icon={<CopyOutlined />}
                    onClick={copyHash}
                    className='flex-1'
                  >
                    {t('pr.copyHash')}
                  </Button>
                  <Button
                    type='primary'
                    icon={<LinkOutlined />}
                    onClick={copyLink}
                    className='flex-1'
                  >
                    {t('pr.copyLink')}
                  </Button>
                </Space>
                {onGeneratePR && (
                  <Button
                    className='w-full'
                    onClick={() => {
                      const prText = `${t('admin.rolesAdmin.prTemplate.title')}

${t('admin.rolesAdmin.prTemplate.descriptionHeading')}
${t('admin.rolesAdmin.prTemplate.descriptionText')}

${t('admin.rolesAdmin.prTemplate.contentHeading')}
\`\`\`typescript
${t('admin.rolesAdmin.prTemplate.contentComment')}
'${hashResult}': 'YOUR_ROLE_HERE',
\`\`\`

${t('admin.rolesAdmin.prTemplate.checklistHeading')}
${t('admin.rolesAdmin.prTemplate.checklistNoPlaintext')}
${t('admin.rolesAdmin.prTemplate.checklistValidRole')}`;
                      onGeneratePR(prText);
                    }}
                  >
                    {t('pr.createPrProposal')}
                  </Button>
                )}

                <Paragraph className='mt-3 text-xs text-[var(--color-text-secondary)]'>
                  {t('pr.hashSetupInstructions')}
                </Paragraph>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
