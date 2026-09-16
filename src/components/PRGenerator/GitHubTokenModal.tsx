import React, { useState, useEffect } from 'react';
import { Modal, Input, Typography, Alert } from 'antd';
import { useGitHubAuth } from '../../hooks/useGitHubAuth';

interface GitHubTokenModalProps {
  open: boolean;
  onClose: () => void;
}

export const GitHubTokenModal: React.FC<GitHubTokenModalProps> = ({
  open,
  onClose,
}) => {
  const { token, setToken } = useGitHubAuth();
  const [inputToken, setInputToken] = useState(token || '');

  // 每次打開 Modal 時，同步最新的 token 到輸入框
  useEffect(() => {
    if (open) {
      setInputToken(token || '');
    }
  }, [open, token]);

  const handleSave = () => {
    setToken(inputToken.trim() || null);
    onClose();
  };

  return (
    <Modal
      title='系統管理員認證 (設定 GitHub Token)'
      open={open}
      onCancel={onClose}
      onOk={handleSave}
      okText='確認儲存'
      cancelText='先不要'
    >
      <Alert
        message='這是一個純網頁的管理系統，您的認證密碼 (Token) 只會安全地存在這台電腦的瀏覽器中，不會傳送到其他不明伺服器。'
        description='請確認您輸入的 Token 有勾選 [repo] 權限，這樣系統才有辦法幫您更新資料！'
        type='info'
        showIcon
        className='mb-4'
      />
      <div className='flex flex-col gap-2'>
        <Typography.Text strong>
          請貼上您的 Personal Access Token (PAT):
        </Typography.Text>
        <Input.Password
          value={inputToken}
          onChange={(e) => setInputToken(e.target.value)}
          placeholder='ghp_xxxxxxxxxxxxxxxxxxxxxxxx'
        />
        <Typography.Text type='secondary' className='text-sm'>
          忘記怎麼取得嗎？請登入 GitHub 後前往 Settings {'>'} Developer settings{' '}
          {'>'} Personal access tokens 來產生一組。
        </Typography.Text>
      </div>
    </Modal>
  );
};
