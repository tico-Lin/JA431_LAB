import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input, Select, Spin, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useSkillsData } from '../hooks/useSkillsData';
import VennZoomChart from '../components/SkillChart';
import MemberCard from '../components/MemberCard';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

export const OverviewPage: React.FC = () => {
  const { t } = useTranslation();
  const { data, loading, error } = useSkillsData();
  const [searchParams] = useSearchParams();
  const initialMemberName = searchParams.get('member');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);

  const focusMemberId = React.useMemo(() => {
    if (!data || !initialMemberName) return null;
    const member = data.members.find((m) => m.name === initialMemberName);
    return member ? member.id : null;
  }, [data, initialMemberName]);

  const handleMemberClick = React.useCallback(() => {
    // Scroll to members grid
    const element = document.getElementById('members-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleSkillClick = React.useCallback((skillId: string) => {
    setActiveSkillId(skillId);
    const element = document.getElementById('skill-chart');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Sync initial URL param with search term once data is loaded
  useEffect(() => {
    if (data && focusMemberId) {
      const member = data.members.find((m) => m.id === focusMemberId);
      if (member) {
        setSearchTerm(member.name);
      }
    }
  }, [data, focusMemberId]);

  const handleSelectionChange = React.useCallback(
    (memberId: string | null) => {
      if (!data) return; // Guard against data being unavailable

      if (!memberId) {
        setSearchTerm('');
        return;
      }

      const member = data.members.find((m) => m.id === memberId);
      if (member) {
        setSearchTerm(member.name);
      }
    },
    [data],
  );

  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Spin size='large' />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Empty description={error || t('common.noDataAvailable')} />
      </div>
    );
  }

  const filteredMembers = data.members.filter((member) => {
    const matchesSearch =
      searchTerm === '' ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      member.skills.some((s) => {
        const skill = data.skills.find((sk) => sk.id === s.skillId);
        return skill?.belongsTo.includes(selectedCategory);
      });

    return matchesSearch && matchesCategory;
  });

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h1 className='text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2'>
          {t('overview.title')}
        </h1>
        <p
          className='text-sm max-w-xl mx-auto'
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {t('overview.subtitle')}
        </p>
      </div>

      {/* Venn Zoom Visualization */}
      <div id='skill-chart' className='glass-card overflow-hidden'>
        <VennZoomChart
          data={data}
          onMemberClick={handleMemberClick}
          onSelectionChange={handleSelectionChange}
          focusMemberId={focusMemberId}
          focusSkillId={activeSkillId}
          height={550}
        />
      </div>

      {/* Filters */}
      <div className='flex flex-wrap gap-3'>
        <Input
          placeholder={t('overview.searchMembers')}
          prefix={<SearchOutlined className='text-gray-400' />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='max-w-xs'
          allowClear
        />
        <Select
          placeholder={t('overview.filterByCategory')}
          value={selectedCategory}
          onChange={setSelectedCategory}
          allowClear
          className='min-w-[180px]'
        >
          {data.categories.map((category) => (
            <Option key={category.id} value={category.id}>
              <span style={{ color: category.color }}>●</span> {category.name}
            </Option>
          ))}
        </Select>
      </div>

      {/* Members Grid */}
      <div id='members-grid'>
        <h2
          className='text-lg font-semibold mb-3'
          style={{ color: 'var(--color-text-primary)' }}
        >
          {t('overview.membersCount', { count: filteredMembers.length })}
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              data={data}
              onSkillClick={handleSkillClick}
            />
          ))}
        </div>
        {filteredMembers.length === 0 && (
          <Empty description={t('overview.noMembersMatch')} />
        )}
      </div>
    </div>
  );
};

export default OverviewPage;
