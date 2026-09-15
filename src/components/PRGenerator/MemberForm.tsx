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
  Space,
} from 'antd';
import {
  GithubOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
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

const LANGUAGE_OPTIONS = [
  { value: 'en', labelKey: 'english' },
  { value: 'ja', labelKey: 'japanese' },
  { value: 'ko', labelKey: 'korean' },
  { value: 'de', labelKey: 'german' },
  { value: 'fr', labelKey: 'french' },
  { value: 'es', labelKey: 'spanish' },
];

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
      <h2 className='text-lg font-semibold text-[var(--color-text-primary)] mb-4'>
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
          {/* Primary name (中文名字) - required */}
          <Form.Item
            name='name'
            label={t('pr.nameLabel')}
            rules={[{ required: true, message: t('pr.pleaseEnterName') }]}
          >
            <Input placeholder={t('pr.namePlaceholder')} />
          </Form.Item>

          {/* Role - required */}
          <Form.Item
            name='role'
            label={t('pr.role')}
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

          {/* Email - required */}
          <Form.Item
            name='email'
            label={t('pr.email')}
            rules={[
              { required: true, message: t('pr.pleaseEnterEmail') },
              { type: 'email', message: t('pr.invalidEmail') },
            ]}
          >
            <Input placeholder={t('pr.emailPlaceholder')} />
          </Form.Item>

          {/* GitHub */}
          <Form.Item name='github' label={t('pr.githubUsername')}>
            <Input
              prefix={<GithubOutlined />}
              placeholder={t('pr.githubPlaceholder')}
            />
          </Form.Item>

          {/* Mobile phone: [+country]-9-[8 digits] */}
          <Form.Item label={t('pr.phoneLabel')} className='!mb-4'>
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item
                name={['phoneData', 'country']}
                noStyle
                initialValue='+886'
                rules={[
                  {
                    pattern: /^\+\d{1,3}$/,
                    message: t('pr.phoneCountryInvalid'),
                  },
                ]}
              >
                <Input
                  style={{
                    width: '25%',
                    minWidth: '70px',
                    textAlign: 'center',
                  }}
                  maxLength={4}
                />
              </Form.Item>
              <Input
                style={{
                  width: '15%',
                  borderLeft: 0,
                  borderRight: 0,
                  pointerEvents: 'none',
                  textAlign: 'center',
                  padding: '4px 0',
                }}
                disabled
                defaultValue='-9-'
              />
              <Form.Item
                name={['phoneData', 'number']}
                noStyle
                rules={[
                  { pattern: /^\d{8}$/, message: t('pr.phoneMustBe8Digits') },
                ]}
              >
                <Input
                  style={{ width: '60%' }}
                  placeholder='12345678'
                  maxLength={8}
                  inputMode='numeric'
                />
              </Form.Item>
            </Space.Compact>
          </Form.Item>

          {/* Landline: [area 2 digits]-[main 8 digits] # [ext] */}
          <Form.Item label={t('pr.landlineLabel')} className='!mb-4'>
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item
                name={['landlineData', 'area']}
                noStyle
                initialValue='04'
                rules={[
                  { pattern: /^\d{2}$/, message: t('pr.landlineAreaInvalid') },
                ]}
              >
                <Input
                  style={{
                    width: '15%',
                    minWidth: '45px',
                    textAlign: 'center',
                  }}
                  maxLength={2}
                  inputMode='numeric'
                />
              </Form.Item>
              <Input
                style={{
                  width: '5%',
                  borderLeft: 0,
                  borderRight: 0,
                  pointerEvents: 'none',
                  textAlign: 'center',
                  padding: '4px 0',
                }}
                disabled
                defaultValue='-'
              />
              <Form.Item
                name={['landlineData', 'main']}
                noStyle
                initialValue='26328001'
                rules={[
                  { pattern: /^\d{8}$/, message: t('pr.landlineMainInvalid') },
                ]}
              >
                <Input
                  style={{
                    width: '30%',
                    minWidth: '80px',
                    textAlign: 'center',
                  }}
                  maxLength={8}
                  inputMode='numeric'
                />
              </Form.Item>
              <Input
                style={{
                  width: '15%',
                  borderLeft: 0,
                  borderRight: 0,
                  pointerEvents: 'none',
                  textAlign: 'center',
                  padding: '4px 0',
                  fontSize: '12px',
                }}
                disabled
                defaultValue={t('pr.landlineExt')}
              />
              <Form.Item
                name={['landlineData', 'ext']}
                noStyle
                initialValue='15231'
              >
                <Input
                  style={{
                    width: '35%',
                    minWidth: '55px',
                    textAlign: 'center',
                  }}
                />
              </Form.Item>
            </Space.Compact>
          </Form.Item>
        </div>

        {/* Multi-language names (extensible) */}
        <Divider style={{ borderColor: 'var(--shell-border)' }} plain>
          {t('pr.localizedNamesHeading')}
        </Divider>
        <Form.List name='localizedNamesList'>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className='flex items-start gap-2 mb-2'>
                  <Form.Item
                    {...restField}
                    name={[name, 'lang']}
                    noStyle
                    rules={[
                      { required: true, message: t('pr.selectLanguage') },
                    ]}
                  >
                    <Select
                      placeholder={t('pr.selectLanguage')}
                      style={{ width: 120 }}
                    >
                      {LANGUAGE_OPTIONS.map((opt) => (
                        <Option key={opt.value} value={opt.value}>
                          {t(`pr.languages.${opt.labelKey}`)}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'value']}
                    noStyle
                    rules={[
                      { required: true, message: t('pr.enterLocalizedName') },
                    ]}
                  >
                    <Input
                      placeholder={t('pr.localizedNamePlaceholder')}
                      style={{ flex: 1 }}
                    />
                  </Form.Item>
                  <MinusCircleOutlined
                    className='text-red-400 hover:text-red-300 cursor-pointer mt-2'
                    onClick={() => remove(name)}
                  />
                </div>
              ))}
              <Button
                type='dashed'
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                className='!mb-4'
              >
                {t('pr.addLocalizedName')}
              </Button>
            </>
          )}
        </Form.List>

        <Divider style={{ borderColor: 'var(--shell-border)' }} />

        {/* Skill Selection */}
        <h3 className='text-[var(--color-text-primary)] font-medium mb-4'>
          {t('pr.skillsHint')}
        </h3>

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
                              : 'bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border-[var(--shell-border)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]'
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
          <div className='mb-4 p-4 rounded-lg bg-[var(--color-surface-2)]'>
            <h4 className='text-[var(--color-text-primary)] text-sm mb-2'>
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
