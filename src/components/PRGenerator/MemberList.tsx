import React from 'react';
import { Button, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
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
  return (
    <Card className='glass-card lg:col-span-1'>
      <h2 className='text-lg font-semibold text-white mb-4'>
        Existing Members
      </h2>
      <Button
        type='primary'
        icon={<PlusOutlined />}
        onClick={onNewMember}
        className='w-full !mb-4'
      >
        Add New Member
      </Button>
      <div className='space-y-2 max-h-96 overflow-y-auto'>
        {members.map((member) => (
          <div
            key={member.id}
            className={`p-3 rounded-lg cursor-pointer transition-all ${
              selectedMemberId === member.id
                ? 'bg-indigo-500/20 border border-indigo-500'
                : 'bg-white/5 hover:bg-white/10'
            }`}
            onClick={() => onSelectMember(member)}
          >
            <h3 className='font-medium text-white'>{member.name}</h3>
            <p className='text-sm text-gray-400'>{member.role}</p>
            <p className='text-xs text-gray-500'>
              {member.skills.length} skills
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default MemberList;
