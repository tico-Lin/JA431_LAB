import React from 'react';
import { Modal, Input, Button, Divider } from 'antd';
import { CopyOutlined, GithubOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;

interface PRPreviewModalProps {
  open: boolean;
  onClose: () => void;
  prContent: string;
  githubToken: string;
  onGithubTokenChange: (token: string) => void;
  onCreatePR: () => void;
  onCopyToClipboard: () => void;
  creatingPR: boolean;
  targetRepo: { owner: string; repo: string };
  onTargetRepoChange: (repo: { owner: string; repo: string }) => void;
}

export const PRPreviewModal: React.FC<PRPreviewModalProps> = ({
  open,
  onClose,
  prContent,
  githubToken,
  onGithubTokenChange,
  onCreatePR,
  onCopyToClipboard,
  creatingPR,
  targetRepo,
  onTargetRepoChange,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('pr.pullRequest')}
      open={open}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <div className='space-y-4'>
        <div className='bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg'>
          <h4 className='font-semibold text-yellow-400 mb-2'>
            {t('pr.targetRepository')}
          </h4>
          <div className='text-sm text-gray-400 mb-3'>
            <p className='mb-2'>{t('pr.repoAutoDetect')}</p>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <Input
              placeholder={t('pr.repoOwnerPlaceholder')}
              value={targetRepo.owner}
              onChange={(e) =>
                onTargetRepoChange({ ...targetRepo, owner: e.target.value })
              }
              prefix={<GithubOutlined />}
            />
            <Input
              placeholder={t('pr.repoNamePlaceholder')}
              value={targetRepo.repo}
              onChange={(e) =>
                onTargetRepoChange({ ...targetRepo, repo: e.target.value })
              }
            />
          </div>
        </div>

        <div className='bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg'>
          <h4 className='font-semibold text-blue-400 mb-2'>
            {t('pr.automaticPrCreation')}
          </h4>
          <div className='text-sm text-gray-400 mb-3 space-y-2'>
            <p>{t('pr.tokenHelp')}</p>
            <div className='bg-black/30 p-2 rounded text-xs'>
              <p className='font-semibold text-gray-300'>
                {t('pr.requiredPermissions')}
              </p>
              <ul className='list-disc list-inside ml-1 space-y-1 mt-1'>
                <li>{t('pr.tokenScopeRepo')}</li>
                <li>{t('pr.tokenScopeFine')}</li>
              </ul>
            </div>
            <p>
              <a
                href='https://github.com/settings/tokens/new?scopes=repo&description=JA431_LAB%20PR%20Bot'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-400 hover:text-blue-300 underline'
              >
                {t('pr.generateTokenLink')}
              </a>
            </p>
          </div>
          <div className='flex gap-2'>
            <Input.Password
              placeholder={t('pr.tokenPlaceholder')}
              value={githubToken}
              onChange={(e) => onGithubTokenChange(e.target.value)}
            />
            <Button
              type='primary'
              loading={creatingPR}
              onClick={onCreatePR}
              icon={<GithubOutlined />}
            >
              {t('pr.createPr')}
            </Button>
          </div>
        </div>

        <Divider className='!my-4 border-gray-700'>
          {t('pr.manualCreation')}
        </Divider>

        <TextArea
          value={prContent}
          rows={10}
          readOnly
          className='font-mono text-sm'
          style={{
            background: 'var(--color-bg-card)',
            color: 'var(--color-text-primary)',
          }}
        />

        <div className='flex justify-end gap-2 mt-4'>
          <Button onClick={onClose}>{t('pr.close')}</Button>
          <Button
            type='default'
            icon={<CopyOutlined />}
            onClick={onCopyToClipboard}
          >
            {t('pr.copyClipboard')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PRPreviewModal;
