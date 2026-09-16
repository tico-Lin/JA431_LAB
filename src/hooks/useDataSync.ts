import { useState } from 'react';
import { message } from 'antd';
import { updateFile } from '../utils/githubApi';
import { useGitHubAuth } from './useGitHubAuth';
import { useTranslation } from 'react-i18next';

interface UseDataSyncOptions {
  repoOwner: string;
  repoName: string;
  onRequireToken?: () => void;
}

export const useDataSync = ({
  repoOwner,
  repoName,
  onRequireToken,
}: UseDataSyncOptions) => {
  const { token } = useGitHubAuth();
  const { t } = useTranslation();
  const [isSyncing, setIsSyncing] = useState(false);

  const saveData = async (
    path: string,
    content: any,
    commitMessage: string,
    onSuccess?: () => void,
  ) => {
    if (!token) {
      onRequireToken?.();
      return false;
    }

    setIsSyncing(true);
    const hideLoading = message.loading({
      content: t('dataSync.uploading'),
      duration: 0,
    });

    try {
      const jsonContent =
        typeof content === 'string'
          ? content
          : JSON.stringify(content, null, 2);

      await updateFile({
        owner: repoOwner,
        repo: repoName,
        path,
        content: jsonContent,
        message: commitMessage,
        token,
      });

      message.success({
        content: t('dataSync.success'),
        duration: 8,
      });
      onSuccess?.();
      return true;
    } catch (err: any) {
      if (err.message.includes('401')) {
        message.error({
          content: t('dataSync.errorToken'),
          duration: 6,
        });
        onRequireToken?.();
      } else {
        message.error({
          content: t('dataSync.errorGeneric', { message: err.message }),
          duration: 6,
        });
      }
      return false;
    } finally {
      hideLoading();
      setIsSyncing(false);
    }
  };

  return { saveData, isSyncing, token };
};
