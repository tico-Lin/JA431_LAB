import React from 'react';
import { Modal, Input, Button, Divider } from 'antd';
import { CopyOutlined, GithubOutlined } from '@ant-design/icons';

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
  return (
    <Modal
      title='Pull Request'
      open={open}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <div className='space-y-4'>
        <div className='bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg'>
          <h4 className='font-semibold text-yellow-400 mb-2'>
            Target Repository
          </h4>
          <div className='text-sm text-gray-400 mb-3'>
            <p className='mb-2'>
              Repository auto-detected from GitHub Pages URL. You can edit if
              needed for custom domains.
            </p>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <Input
              placeholder='Repository Owner (e.g., your-username)'
              value={targetRepo.owner}
              onChange={(e) =>
                onTargetRepoChange({ ...targetRepo, owner: e.target.value })
              }
              prefix={<GithubOutlined />}
            />
            <Input
              placeholder='Repository Name (e.g., RoboSkills)'
              value={targetRepo.repo}
              onChange={(e) =>
                onTargetRepoChange({ ...targetRepo, repo: e.target.value })
              }
            />
          </div>
        </div>

        <div className='bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg'>
          <h4 className='font-semibold text-blue-400 mb-2'>
            Automatic PR Creation
          </h4>
          <div className='text-sm text-gray-400 mb-3 space-y-2'>
            <p>
              Enter your GitHub Personal Access Token (PAT) to automatically
              create this PR.
            </p>
            <div className='bg-black/30 p-2 rounded text-xs'>
              <p className='font-semibold text-gray-300'>
                Required Permissions:
              </p>
              <ul className='list-disc list-inside ml-1 space-y-1 mt-1'>
                <li>
                  <span className='text-yellow-400'>repo</span> (Full control of
                  private repositories)
                </li>
                <li>
                  OR for Fine-grained tokens:
                  <span className='text-green-400'> Contents</span> (Read &
                  write) +<span className='text-green-400'> Pull requests</span>{' '}
                  (Read & write)
                </li>
              </ul>
            </div>
            <p>
              <a
                href='https://github.com/settings/tokens/new?scopes=repo&description=RoboSkills%20PR%20Bot'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-400 hover:text-blue-300 underline'
              >
                Click here to generate a token with 'repo' scope
              </a>
            </p>
          </div>
          <div className='flex gap-2'>
            <Input.Password
              placeholder='ghp_...'
              value={githubToken}
              onChange={(e) => onGithubTokenChange(e.target.value)}
            />
            <Button
              type='primary'
              loading={creatingPR}
              onClick={onCreatePR}
              icon={<GithubOutlined />}
            >
              Create PR
            </Button>
          </div>
        </div>

        <Divider className='!my-4 border-gray-700'>OR Manual Creation</Divider>

        <TextArea
          value={prContent}
          rows={10}
          readOnly
          className='font-mono text-sm'
          style={{ background: '#1a1a2e', color: '#fff' }}
        />

        <div className='flex justify-end gap-2 mt-4'>
          <Button onClick={onClose}>Close</Button>
          <Button
            type='default'
            icon={<CopyOutlined />}
            onClick={onCopyToClipboard}
          >
            Copy to Clipboard
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PRPreviewModal;
