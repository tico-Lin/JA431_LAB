import React from 'react';
import { Card, Tag, Avatar, Tooltip, Flex } from 'antd';
import { UserOutlined, GithubOutlined } from '@ant-design/icons';

// Custom SVG icons for contact — only shown when member has the data
const EmailSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox='0 0 24 24'
    width='16'
    height='16'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <rect x='2' y='4' width='20' height='16' rx='2' />
    <path d='M22 4L12 13 2 4' />
  </svg>
);

const MobileSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox='0 0 24 24'
    width='16'
    height='16'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <rect x='5' y='2' width='14' height='20' rx='2' ry='2' />
    <line x1='12' y1='18' x2='12.01' y2='18' />
  </svg>
);

const LandlineSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox='0 0 24 24'
    width='16'
    height='16'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <path d='M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z' />
  </svg>
);

/** Convert landline stored format to display and tel: href */
const formatLandline = (
  landline: string,
): { display: string; href: string } => {
  // Stored format: "04-26328001#15231"
  const match = landline.match(/^(?:\+886-?)?(\d{2})-?(\d{8})(?:#(\S*))?$/);
  if (match) {
    const [, area, main, ext] = match;
    const display = ext
      ? `+886-${area}-${main} 轉 ${ext}`
      : `+886-${area}-${main}`;
    const telDigits = ext ? `+886${area}${main},${ext}` : `+886${area}${main}`;
    return { display, href: `tel:${telDigits}` };
  }
  const legacyMatch = landline.match(
    /^\+886-(\d{2})-(\d{4})-(\d{4})(?: ext\.\s*(\S+))?$/i,
  );
  if (legacyMatch) {
    const [, area, first, second, ext] = legacyMatch;
    const main = `${first}${second}`;
    const display = ext
      ? `+886-${area}-${main} 轉 ${ext}`
      : `+886-${area}-${main}`;
    const telDigits = ext ? `+886${area}${main},${ext}` : `+886${area}${main}`;
    return { display, href: `tel:${telDigits}` };
  }
  // Fallback for other stored formats
  return { display: landline, href: `tel:${landline.replace(/[^\d+]/g, '')}` };
};
import { useTranslation } from 'react-i18next';
import type { LabMember, SkillsData, MemberSkill } from '../types/types';
import { PROFICIENCY_COLORS, PROFICIENCY_LABEL_KEYS } from '../types/types';
import {
  getSkillById,
  getMemberBlendedColor,
  getMemberCategoryWeights,
} from '../hooks/useSkillsData';

interface MemberCardProps {
  member: LabMember;
  data: SkillsData;
  onClick?: (member: LabMember) => void;
  onSkillClick?: (skillId: string) => void;
}

const SkillTag: React.FC<{
  skill: MemberSkill;
  data: SkillsData;
  onSkillClick?: (skillId: string) => void;
}> = ({ skill, data, onSkillClick }) => {
  const { t } = useTranslation();
  const skillInfo = getSkillById(data.skills, skill.skillId);
  if (!skillInfo) return null;

  // Get colors from all categories this skill belongs to
  const categories = skillInfo.belongsTo
    .map((id) => data.categories.find((c) => c.id === id))
    .filter(Boolean);

  const isOverlap = categories.length > 1;
  return (
    <Tooltip
      title={
        <div>
          <div className='font-semibold'>{skillInfo.name}</div>
          <div className='text-xs opacity-80'>
            {t(PROFICIENCY_LABEL_KEYS[skill.proficiency])}
          </div>
          {isOverlap && (
            <div className='text-xs mt-1'>
              {t('common.spansPrefix')}:{' '}
              {categories.map((c) => c?.name).join(', ')}
            </div>
          )}
        </div>
      }
    >
      <Tag
        className='category-badge m-1 cursor-pointer hover:brightness-110 transition-all'
        onClick={(e) => {
          e.stopPropagation();
          onSkillClick?.(skill.skillId);
        }}
        style={{
          background: `${PROFICIENCY_COLORS[skill.proficiency]}20`,
          borderColor: PROFICIENCY_COLORS[skill.proficiency],
          color: PROFICIENCY_COLORS[skill.proficiency],
        }}
      >
        <span
          className='proficiency-dot'
          style={{ backgroundColor: PROFICIENCY_COLORS[skill.proficiency] }}
        />
        {skillInfo.name}
        {isOverlap && <span className='ml-1 opacity-60'>⟷</span>}
      </Tag>
    </Tooltip>
  );
};

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  data,
  onClick,
  onSkillClick,
}) => {
  const { t } = useTranslation();
  const categoryWeights = getMemberCategoryWeights(member, data);
  const blendedColor = getMemberBlendedColor(categoryWeights, data.categories);

  // Group skills by ALL categories they belong to
  const skillsByCategory: Record<string, MemberSkill[]> = {};
  for (const memberSkill of member.skills) {
    const skill = getSkillById(data.skills, memberSkill.skillId);
    if (!skill) continue;

    // Add skill to all categories it belongs to
    skill.belongsTo.forEach((catId) => {
      if (!skillsByCategory[catId]) {
        skillsByCategory[catId] = [];
      }
      skillsByCategory[catId].push(memberSkill);
    });
  }

  // Sort skills by proficiency (High to Low)
  const proficiencyWeight: Record<string, number> = {
    expert: 4,
    advanced: 3,
    intermediate: 2,
    beginner: 1,
  };

  Object.values(skillsByCategory).forEach((skills) => {
    skills.sort((a, b) => {
      const weightA = proficiencyWeight[a.proficiency] || 0;
      const weightB = proficiencyWeight[b.proficiency] || 0;
      return weightB - weightA;
    });
  });

  const [expanded, setExpanded] = React.useState(false);
  const INITIAL_VISIBLE_COUNT = 5;
  const hasHiddenSkills = Object.values(skillsByCategory).some(
    (skills) => skills.length > INITIAL_VISIBLE_COUNT,
  );

  return (
    <Card
      className='glass-card overflow-hidden'
      hoverable
      onClick={() => onClick?.(member)}
      styles={{
        body: { padding: '20px' },
      }}
    >
      <div className='flex items-start gap-4'>
        <Avatar
          size={64}
          icon={<UserOutlined />}
          src={member.avatar}
          className='flex-shrink-0'
          style={{
            background: blendedColor,
            border: '2px solid var(--shell-border)',
          }}
        />
        <div className='flex-1 min-w-0'>
          <h3 className='text-lg font-semibold text-white mb-1 truncate'>
            {member.name}
          </h3>
          <p className='text-sm text-gray-400 mb-2'>{member.role}</p>
          <div className='flex flex-wrap gap-2 mb-3'>
            {member.email && (
              <Tooltip title={member.email}>
                <a
                  href={`mailto:${member.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className='text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors'
                >
                  <EmailSvg />
                </a>
              </Tooltip>
            )}
            {member.phone && (
              <Tooltip title={member.phone}>
                <a
                  href={`tel:${member.phone.replace(/[^\d+]/g, '')}`}
                  onClick={(e) => e.stopPropagation()}
                  className='text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors'
                >
                  <MobileSvg />
                </a>
              </Tooltip>
            )}
            {member.landline &&
              (() => {
                const { display, href } = formatLandline(member.landline);
                return (
                  <Tooltip title={display}>
                    <a
                      href={href}
                      onClick={(e) => e.stopPropagation()}
                      className='text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors'
                    >
                      <LandlineSvg />
                    </a>
                  </Tooltip>
                );
              })()}
            {member.github && (
              <Tooltip title={`@${member.github}`}>
                <a
                  href={`https://github.com/${member.github}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={(e) => e.stopPropagation()}
                  className='text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors'
                >
                  <GithubOutlined />
                </a>
              </Tooltip>
            )}
          </div>

          {/* Category distribution bar */}
          <div className='flex h-2 rounded-full overflow-hidden mb-3'>
            {Object.entries(categoryWeights).map(([catId, weight]) => {
              const category = data.categories.find((c) => c.id === catId);
              const totalWeight = Object.values(categoryWeights).reduce(
                (a, b) => a + b,
                0,
              );
              return (
                <Tooltip
                  key={catId}
                  title={`${category?.name}: ${Math.round((weight / totalWeight) * 100)}%`}
                >
                  <div
                    style={{
                      backgroundColor: category?.color,
                      width: `${(weight / totalWeight) * 100}%`,
                    }}
                  />
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>

      <div className='mt-4'>
        {Object.entries(skillsByCategory).map(([categoryId, skills]) => {
          const category = data.categories.find((c) => c.id === categoryId);
          const visibleSkills = expanded
            ? skills
            : skills.slice(0, INITIAL_VISIBLE_COUNT);
          const hiddenCount = skills.length - visibleSkills.length;

          if (visibleSkills.length === 0) return null;

          return (
            <div key={categoryId} className='mb-2'>
              <span
                className='text-xs font-medium uppercase tracking-wider'
                style={{
                  color: category?.color || 'var(--color-text-primary)',
                }}
              >
                {category?.name || categoryId}
              </span>
              <Flex wrap={true} gap={5}>
                {visibleSkills.map((skill) => (
                  <SkillTag
                    key={skill.skillId}
                    skill={skill}
                    data={data}
                    onSkillClick={onSkillClick}
                  />
                ))}
                {!expanded && hiddenCount > 0 && (
                  <Tag
                    className='!mt-2 cursor-pointer hover:opacity-80 transition-opacity'
                    style={{
                      background: 'var(--color-surface-2)',
                      border: '1px dashed var(--shell-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded(true);
                    }}
                  >
                    {t('common.moreCount', { count: hiddenCount })}
                  </Tag>
                )}
              </Flex>
            </div>
          );
        })}
        {expanded && hasHiddenSkills && (
          <div
            className='text-center mt-2 cursor-pointer text-xs text-gray-400 hover:text-white transition-colors'
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(false);
            }}
          >
            {t('common.showLess')}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MemberCard;
