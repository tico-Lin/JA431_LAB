import React from 'react';
import { Button, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { LabMember } from '../../types/types';

interface MemberListProps {
  members: LabMember[];
  selectedMemberId: string | null;
  onSelectMember: (member: LabMember) => void;
  onNewMember: () => void;
}

export const MemberList: React.FC<MemberListProps> = ({
  members,
  selectedMemberId,
  onSelectMember,
  onNewMember,
}) => {
  const { t } = useTranslation();

  return (
    <Card className='glass-card lg:col-span-1'>
      <h2 className='text-lg font-semibold text-[var(--color-text-primary)] mb-4'>
        {t('pr.memberListTitle')}
      </h2>
      <Button
        type='primary'
        icon={<PlusOutlined />}
        onClick={onNewMember}
        className='w-full !mb-4'
      >
        {t('pr.addNewMember')}
      </Button>
      <div className='space-y-2 max-h-96 overflow-y-auto'>
        {members.map((member) => (
          <div
            key={member.id}
            className={`p-3 rounded-lg cursor-pointer transition-all ${
              selectedMemberId === member.id
                ? 'bg-indigo-500/20 border border-indigo-500'
                : 'bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-3)]'
            }`}
            onClick={() => onSelectMember(member)}
          >
            <h3 className='font-medium text-[var(--color-text-primary)]'>
              {member.name}
            </h3>
            <p className='text-sm text-[var(--color-text-secondary)]'>
              {member.role}
            </p>
            <p className='text-xs text-[var(--color-text-secondary)]'>
              {t('pr.memberCount', { count: member.skills.length })}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default MemberList;
