import React from 'react';
import {
  Form,
  Input,
  InputNumber,
  Switch,
  Select,
  type FormInstance,
  Button,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export type FieldType =
  | 'string'
  | 'text'
  | 'number'
  | 'boolean'
  | 'select'
  | 'select-multiple'
  | 'localized'
  | 'localized-list'
  | 'object-list'
  | 'string-list';

export interface FieldSchema {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string | number | boolean; label: string }[];
  placeholder?: string;
  tooltip?: string;
  disabled?: boolean;
  subFields?: FieldSchema[]; // 用於 object-list
}

interface DynamicFormProps {
  form: FormInstance<any>;
  schema: FieldSchema[];
  initialValues?: any;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  form,
  schema,
  initialValues,
}) => {
  const { t } = useTranslation();

  const renderField = (field: FieldSchema) => {
    switch (field.type) {
      case 'string':
        return <Input placeholder={field.placeholder} />;
      case 'text':
        return <Input.TextArea placeholder={field.placeholder} rows={4} />;
      case 'number':
        return (
          <InputNumber className='w-full' placeholder={field.placeholder} />
        );
      case 'boolean':
        return <Switch />;
      case 'select':
        return (
          <Select
            options={field.options}
            placeholder={field.placeholder}
            disabled={field.disabled}
          />
        );
      case 'select-multiple':
        return (
          <Select
            mode='multiple'
            options={field.options}
            placeholder={field.placeholder}
            disabled={field.disabled}
          />
        );
      case 'localized':
        return (
          <div className='flex flex-col gap-2 border p-3 rounded-md bg-black/5'>
            <Form.Item
              name={[field.name, 'en']}
              label='English'
              rules={field.required ? [{ required: true }] : []}
              className='mb-0'
            >
              <Input placeholder='English value' />
            </Form.Item>
            <Form.Item
              name={[field.name, 'zh-TW']}
              label='繁體中文'
              rules={field.required ? [{ required: true }] : []}
              className='mb-0'
            >
              <Input placeholder='繁體中文內容' />
            </Form.Item>
          </div>
        );
      case 'localized-list':
        return (
          <Form.List name={field.name}>
            {(fields, { add, remove }) => (
              <div className='border border-[var(--shell-border)] p-3 rounded-md mb-4 bg-black/5'>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className='flex items-start gap-2 mb-2'>
                    <Form.Item
                      {...restField}
                      name={[name, 'lang']}
                      noStyle
                      rules={[{ required: true, message: '請選擇語系' }]}
                    >
                      <Select placeholder='語系' style={{ width: 120 }}>
                        <Select.Option value='en'>英文 (en)</Select.Option>
                        <Select.Option value='ja'>日文 (ja)</Select.Option>
                        <Select.Option value='ko'>韓文 (ko)</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      noStyle
                      rules={[{ required: true, message: '請輸入翻譯名稱' }]}
                    >
                      <Input placeholder='翻譯名稱' style={{ flex: 1 }} />
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
                >
                  新增其他語系名稱
                </Button>
              </div>
            )}
          </Form.List>
        );
      case 'object-list':
        return (
          <Form.List name={field.name}>
            {(fields, { add, remove }) => (
              <div className='border border-[var(--shell-border)] p-4 rounded-md mb-4 bg-black/5'>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    className='mb-4 relative border-b border-[var(--shell-border)] pb-4'
                  >
                    <div className='absolute right-0 top-0'>
                      <Button
                        danger
                        type='text'
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                      />
                    </div>
                    {field.subFields?.map((subField) => (
                      <Form.Item
                        key={subField.name}
                        {...restField}
                        name={[name, subField.name]}
                        label={subField.label}
                        rules={
                          subField.required
                            ? [
                                {
                                  required: true,
                                  message: t('common.required'),
                                },
                              ]
                            : []
                        }
                        tooltip={subField.tooltip}
                      >
                        {subField.type === 'text' ? (
                          <Input.TextArea
                            placeholder={subField.placeholder}
                            rows={3}
                          />
                        ) : subField.type === 'string-list' ? (
                          <Select
                            mode='tags'
                            placeholder={subField.placeholder}
                            style={{ width: '100%' }}
                          />
                        ) : (
                          <Input placeholder={subField.placeholder} />
                        )}
                      </Form.Item>
                    ))}
                  </div>
                ))}
                <Button
                  type='dashed'
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  {field.placeholder || '新增項目'}
                </Button>
              </div>
            )}
          </Form.List>
        );
      default:
        return <Input />;
    }
  };

  return (
    <Form
      form={form}
      layout='vertical'
      initialValues={initialValues}
      className='dynamic-form'
    >
      {schema.map((field) => {
        // localized fields render their own Form.Items for sub-fields
        if (
          field.type === 'localized' ||
          field.type === 'localized-list' ||
          field.type === 'object-list'
        ) {
          return (
            <Form.Item
              key={field.name}
              label={field.label}
              tooltip={field.tooltip}
              required={field.required}
            >
              {renderField(field)}
            </Form.Item>
          );
        }

        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={
              field.required
                ? [{ required: true, message: t('common.required') }]
                : []
            }
            valuePropName={field.type === 'boolean' ? 'checked' : 'value'}
            tooltip={field.tooltip}
          >
            {renderField(field)}
          </Form.Item>
        );
      })}
    </Form>
  );
};
