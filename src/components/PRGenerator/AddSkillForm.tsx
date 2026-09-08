import React from 'react';
import { Card, Input, Button, Checkbox, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
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
  return (
    <Card className='glass-card !mb-8'>
      <h2 className='text-lg font-semibold text-white mb-4'>
        Add New Skill (with Category Overlap)
      </h2>
      <p className='text-gray-400 text-sm mb-4'>
        Create a new skill that can span multiple categories. Skills with
        multiple categories create overlap regions in the visualization.
      </p>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <label className='text-gray-300 text-sm block mb-2'>Skill Name</label>
          <Input
            placeholder='e.g., Imitation Learning'
            value={skillName}
            onChange={(e) => onSkillNameChange(e.target.value)}
          />
        </div>
        <div className='md:col-span-2'>
          <label className='text-gray-300 text-sm block mb-2'>
            Belongs to Categories (select multiple for overlap)
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
        Generate Skill PR
      </Button>
    </Card>
  );
};

export default AddSkillForm;
