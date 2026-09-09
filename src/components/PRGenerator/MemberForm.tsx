import React from 'react';
import {
  Form,
  Input,
  AutoComplete,
  Button,
  Card,
  Divider,
  Tag,
  Select,
  Tooltip,
} from 'antd';
import { GithubOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type {
  LabMember,
  MemberSkill,
  ProficiencyLevel,
  Subcategory,
  SkillCategory,
} from '../../types/types';
import { PROFICIENCY_LABEL_KEYS } from '../../types/types';

const { Option } = Select;

interface MemberFormProps {
  form: ReturnType<typeof Form.useForm>[0];
  editMode: 'new' | 'edit';
  selectedMember: LabMember | null;
  skills: MemberSkill[];
  allSkills: Subcategory[];
  categories: SkillCategory[];
  roleOptions: { value: string; label: string }[];
  hasChanges: boolean;
  onSkillsChange: (skills: MemberSkill[]) => void;
  onFormValuesChange: (changedValues: any, allValues: any) => void;
  onGeneratePR: (formData: any) => void;
  onRemoveMember: () => void;
}

export const MemberForm: React.FC<MemberFormProps> = ({
  form,
  editMode,
  selectedMember,
  skills,
  allSkills,
  categories,
  roleOptions,
  hasChanges,
  onSkillsChange,
  onFormValuesChange,
  onGeneratePR,
  onRemoveMember,
}) => {
  const { t } = useTranslation();

  const addSkill = (skillId: string, proficiency: ProficiencyLevel) => {
    const exists = skills.some((s) => s.skillId === skillId);
    if (!exists) {
      onSkillsChange([...skills, { skillId, proficiency }]);
    }
  };

  const removeSkill = (skillId: string) => {
    onSkillsChange(skills.filter((s) => s.skillId !== skillId));
  };

  const updateSkillProficiency = (
    skillId: string,
    proficiency: ProficiencyLevel,
  ) => {
    onSkillsChange(
      skills.map((s) => (s.skillId === skillId ? { ...s, proficiency } : s)),
    );
  };

  return (
    <Card className='glass-card lg:col-span-2'>
      <h2 className='text-lg font-semibold text-white mb-4'>
        {editMode === 'new'
          ? t('pr.formNewMember')
          : t('pr.formEditMember', { name: selectedMember?.name || '' })}
      </h2>

      <Form
        form={form}
        layout='vertical'
        onFinish={onGeneratePR}
        onValuesChange={onFormValuesChange}
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Form.Item
            name='name'
            label={<span className='text-gray-300'>{t('pr.name')}</span>}
            rules={[{ required: true, message: t('pr.pleaseEnterName') }]}
          >
            <Input placeholder={t('pr.namePlaceholder')} />
          </Form.Item>
          <Form.Item
            name='role'
            label={<span className='text-gray-300'>{t('pr.role')}</span>}
            rules={[{ required: true, message: t('pr.pleaseEnterRole') }]}
          >
            <AutoComplete
              options={roleOptions}
              placeholder={t('pr.rolePlaceholder')}
              filterOption={(inputValue, option) =>
                option!.value
                  .toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1
              }
            />
          </Form.Item>
          <Form.Item
            name='email'
            label={<span className='text-gray-300'>{t('pr.email')}</span>}
          >
            <Input placeholder={t('pr.emailPlaceholder')} />
          </Form.Item>
          <Form.Item
            name='github'
            label={
              <span className='text-gray-300'>{t('pr.githubUsername')}</span>
            }
          >
            <Input
              prefix={<GithubOutlined />}
              placeholder={t('pr.githubPlaceholder')}
            />
          </Form.Item>
        </div>

        <Divider className='border-gray-700' />

        {/* Skill Selection */}
        <h3 className='text-white font-medium mb-4'>{t('pr.skillsHint')}</h3>

        {/* Group skills by category */}
        {categories.map((category) => {
          const categorySkills = allSkills.filter((s) =>
            s.belongsTo.includes(category.id),
          );
          if (categorySkills.length === 0) return null;

          return (
            <div key={category.id} className='mb-4'>
              <h4
                className='text-sm font-medium mb-2'
                style={{ color: category.color }}
              >
                {category.name}
              </h4>
              <div className='flex flex-wrap gap-2'>
                {categorySkills.map((skill) => {
                  const isSelected = skills.some((s) => s.skillId === skill.id);
                  const selectedSkill = skills.find(
                    (s) => s.skillId === skill.id,
                  );
                  const isOverlap = skill.belongsTo.length > 1;

                  return (
                    <div key={skill.id} className='flex items-center gap-1'>
                      <Tooltip title={skill.description} placement='top'>
                        <Tag
                          className={`cursor-pointer transition-all border ${
                            isSelected
                              ? ''
                              : 'bg-white/5 text-gray-400 border-gray-700 hover:text-gray-300 hover:border-gray-600'
                          }`}
                          style={
                            isSelected
                              ? {
                                  backgroundColor: `${category.color}20`,
                                  color: category.color,
                                  borderColor: category.color,
                                }
                              : undefined
                          }
                          onClick={() => {
                            if (isSelected) {
                              removeSkill(skill.id);
                            } else {
                              addSkill(skill.id, 'intermediate');
                            }
                          }}
                        >
                          {skill.name}
                          {isOverlap && !isSelected && (
                            <span className='ml-1'>⟷</span>
                          )}
                        </Tag>
                      </Tooltip>
                      {isSelected && (
                        <Select
                          size='small'
                          value={selectedSkill?.proficiency}
                          onChange={(val) =>
                            updateSkillProficiency(skill.id, val)
                          }
                          style={{ width: 100 }}
                        >
                          {Object.entries(PROFICIENCY_LABEL_KEYS).map(
                            ([val, labelKey]) => (
                              <Option key={val} value={val}>
                                {t(labelKey)}
                              </Option>
                            ),
                          )}
                        </Select>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Selected Skills Summary */}
        {skills.length > 0 && (
          <div className='mb-4 p-4 rounded-lg bg-white/5'>
            <h4 className='text-gray-300 text-sm mb-2'>
              {t('pr.selectedSkills', { count: skills.length })}
            </h4>
          </div>
        )}

        <div className='flex gap-2'>
          <Button
            type='primary'
            htmlType='submit'
            icon={<GithubOutlined />}
            disabled={!hasChanges}
            className='flex-1'
          >
            {t('pr.generatePrContent')}
          </Button>
          {editMode === 'edit' && selectedMember && (
            <Button danger icon={<DeleteOutlined />} onClick={onRemoveMember}>
              {t('pr.removeMember')}
            </Button>
          )}
        </div>
      </Form>
    </Card>
  );
};

export default MemberForm;
