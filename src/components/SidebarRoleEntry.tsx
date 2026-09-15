import React, { useState } from 'react';
import { Modal, Input, message, Button } from 'antd';
import { useRole } from '../context/RoleContext';
import { useTranslation } from 'react-i18next';

interface SidebarRoleEntryProps {
  collapsed: boolean;
}

export const SidebarRoleEntry: React.FC<SidebarRoleEntryProps> = ({
  collapsed,
}) => {
  const { role, loginWithKey, logout } = useRole();
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!keyInput.trim()) return;

    setLoading(true);
    const success = await loginWithKey(keyInput.trim());
    setLoading(false);

    if (success) {
      message.success(t('role.verifySuccess'));
      setModalOpen(false);
      setKeyInput('');
    } else {
      message.error(t('role.invalidKey'));
    }
  };

  const handleLogout = () => {
    logout();
    message.success(t('role.switchedToGuest'));
    setModalOpen(false);
  };

  return (
    <div className='p-3 border-t border-white/10 mt-auto'>
      <button
        onClick={() => setModalOpen(true)}
        className='flex items-center gap-3 w-full px-2 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors rounded-lg hover:bg-white/5'
        title={t('role.switchView')}
      >
        <svg
          className='w-5 h-5 shrink-0'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z'
          />
        </svg>
        {!collapsed && (
          <span className='text-xs tracking-wider whitespace-nowrap overflow-hidden text-ellipsis'>
            {t('role.viewLabel', { role: t(`role.${role}`) })}
          </span>
        )}
      </button>

      <Modal
        title={t('role.verifyTitle')}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setKeyInput('');
        }}
        footer={null}
        destroyOnHidden={true}
        width={400}
      >
        <div className='py-4 flex flex-col gap-4'>
          <div className='text-sm text-[var(--color-text-secondary)] mb-2'>
            {t('role.verifyDescription')}
          </div>

          <Input.Password
            placeholder={t('role.keyPlaceholder')}
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            onPressEnter={handleVerify}
            size='large'
            autoFocus
          />

          <div className='flex justify-end gap-3 mt-4'>
            {role !== 'guest' && (
              <Button onClick={handleLogout}>{t('role.switchToGuest')}</Button>
            )}
            <Button
              type='primary'
              onClick={handleVerify}
              loading={loading}
              disabled={!keyInput.trim()}
            >
              {t('role.verify')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
