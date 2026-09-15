import React from 'react';
import { Card, Input, Button, Checkbox, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { SkillCategory } from '../../types/types';

interface AddSkillFormProps {
  categories: SkillCategory[];
  skillName: string;
  onSkillNameChange: (name: string) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  onGeneratePR: () => void;
}

export const AddSkillForm: React.FC<AddSkillFormProps> = ({
  categories,
  skillName,
  onSkillNameChange,
  selectedCategories,
  onCategoriesChange,
  onGeneratePR,
}) => {
  const { t } = useTranslation();

  return (
    <Card className='glass-card !mb-8'>
      <h2 className='text-lg font-semibold text-[var(--color-text-primary)] mb-4'>
        {t('pr.addSkillCardTitle')}
      </h2>
      <p className='text-[var(--color-text-secondary)] text-sm mb-4'>
        {t('pr.addSkillCardDescription')}
      </p>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <label className='text-[var(--color-text-secondary)] text-sm block mb-2'>
            {t('pr.skillName')}
          </label>
          <Input
            placeholder={t('pr.skillNamePlaceholder')}
            value={skillName}
            onChange={(e) => onSkillNameChange(e.target.value)}
          />
        </div>
        <div className='md:col-span-2'>
          <label className='text-[var(--color-text-secondary)] text-sm block mb-2'>
            {t('pr.belongsToCategories')}
          </label>
          <Checkbox.Group
            value={selectedCategories}
            onChange={(values) => onCategoriesChange(values as string[])}
          >
            <Space wrap>
              {categories.map((cat) => (
                <Checkbox
                  key={cat.id}
                  value={cat.id}
                  style={{ color: cat.color }}
                >
                  <span style={{ color: cat.color }}>{cat.name}</span>
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </div>
      </div>
      <Button
        type='primary'
        icon={<PlusOutlined />}
        onClick={onGeneratePR}
        className='!mt-4'
        disabled={!skillName || selectedCategories.length === 0}
      >
        {t('pr.generateSkillPr')}
      </Button>
    </Card>
  );
};

export default AddSkillForm;
