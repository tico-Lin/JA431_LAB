import React, { useState } from 'react';
import {
  Card,
  Tabs,
  Table,
  Button,
  Typography,
  Modal,
  Form,
  Space,
  message,
  Tooltip,
  Input,
} from 'antd';
import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  CloudUploadOutlined,
  SettingOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useServicesData } from '../../hooks/useServicesData';
import type { ServicesData, ServiceItem } from '../../types/serviceTypes';
import { useTranslation } from 'react-i18next';
import { useDataSync } from '../../hooks/useDataSync';
import { GitHubTokenModal } from './GitHubTokenModal';
import { DynamicForm, type FieldSchema } from './DynamicForm';

const { Title } = Typography;

export const ServicesAdmin: React.FC = () => {
  const { data, loading, error } = useServicesData();
  const { t, i18n } = useTranslation();
  const isZh = i18n.language === 'zh-TW';
  const [localData, setLocalData] = useState<ServicesData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [form] = Form.useForm();
  const [isCategoryEditing, setIsCategoryEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [categoryForm] = Form.useForm();

  const [searchText, setSearchText] = useState('');

  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const { saveData, isSyncing } = useDataSync({
    repoOwner: 'tico-Lin',
    repoName: 'JA431_LAB',
    onRequireToken: () => setIsTokenModalOpen(true),
  });

  // Initialize local copy when data loads
  React.useEffect(() => {
    if (data && !localData) {
      setLocalData(JSON.parse(JSON.stringify(data)));
    }
  }, [data, localData]);

  if (loading || !localData) return <div>{t('common.loadingData')}</div>;
  if (error) return <div>{t('common.failedToLoad')}</div>;

  const handleCategoryEdit = (cat: any) => {
    setEditingCategory(cat);
    categoryForm.setFieldsValue({
      id: cat.id,
      name: cat.name,
      nameEn: cat.localizedNames?.en || '',
    });
    setIsCategoryEditing(true);
  };

  const handleCategoryAdd = () => {
    setEditingCategory(null);
    categoryForm.resetFields();
    setIsCategoryEditing(true);
  };

  const handleCategoryDelete = (id: string) => {
    Modal.confirm({
      title: t('pr.tooltipDeleteCategory'),
      onOk: () => {
        setLocalData((prev) =>
          prev
            ? {
                ...prev,
                categories: prev.categories.filter((c) => c.id !== id),
              }
            : null,
        );
      },
    });
  };

  const handleCategorySave = () => {
    categoryForm.validateFields().then((values) => {
      setLocalData((prev) => {
        if (!prev) return prev;

        const newCat = {
          id: values.id || values.name.toLowerCase().replace(/\s+/g, '-'),
          name: values.name,
          localizedNames: values.nameEn ? { en: values.nameEn } : undefined,
        };

        const newCategories = [...prev.categories];
        if (editingCategory) {
          const idx = newCategories.findIndex(
            (c) => c.id === editingCategory.id,
          );
          if (idx !== -1) newCategories[idx] = newCat;
        } else {
          newCategories.push(newCat);
        }
        return { ...prev, categories: newCategories };
      });
      setIsCategoryEditing(false);
    });
  };

  const categoryColumns = [
    { title: t('pr.idColumn'), dataIndex: 'id', key: 'id' },
    { title: t('pr.categoryName'), dataIndex: 'name', key: 'name' },
    {
      title: 'English Name',
      key: 'nameEn',
      render: (_: any, record: any) => record.localizedNames?.en || '-',
    },
    {
      title: t('pr.actionsColumn'),
      key: 'actions',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title={t('pr.tooltipEditCategory')}>
            <Button
              type='text'
              icon={<EditOutlined />}
              onClick={() => handleCategoryEdit(record)}
            />
          </Tooltip>
          <Tooltip title={t('pr.tooltipDeleteCategory')}>
            <Button
              type='text'
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleCategoryDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (item: ServiceItem) => {
    setEditingItem(item);
    const localizedNamesList = item.localizedNames
      ? Object.entries(item.localizedNames).map(([lang, value]) => ({
          lang,
          value,
        }))
      : [];
    const localizedDescriptionsList = item.localizedDescriptions
      ? Object.entries(item.localizedDescriptions).map(([lang, value]) => ({
          lang,
          value,
        }))
      : [];
    const customOptions =
      item.customOptions?.map((opt) => ({
        ...opt,
        labelEn: opt.localizedLabels?.en || '',
        descriptionEn: opt.localizedDescriptions?.en || '',
        optionsText:
          opt.options
            ?.map((o) => `${o.value}:${o.label}:${o.localizedLabels?.en || ''}`)
            .join('\n') || '',
      })) || [];

    form.setFieldsValue({
      ...item,
      localizedNamesList,
      localizedDescriptionsList,
      customOptions,
    });
    setIsEditing(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue({
      minSamples: 1,
      allowCustomParams: false,
      turnaroundDays: 3,
      requiresSampleType: [],
      dependencies: [],
      localizedNamesList: [],
      localizedDescriptionsList: [],
      customOptions: [],
    });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: t('pr.tooltipDeleteService'),
      onOk: () => {
        setLocalData((prev) =>
          prev
            ? { ...prev, items: prev.items.filter((i) => i.id !== id) }
            : null,
        );
      },
    });
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      setLocalData((prev) => {
        if (!prev) return prev;

        const localizedNames: Record<string, string> = {};
        if (values.localizedNamesList) {
          values.localizedNamesList.forEach((item: any) => {
            if (item && item.lang && item.value) {
              localizedNames[item.lang] = item.value;
            }
          });
        }

        const localizedDescriptions: Record<string, string> = {};
        if (values.localizedDescriptionsList) {
          values.localizedDescriptionsList.forEach((item: any) => {
            if (item && item.lang && item.value) {
              localizedDescriptions[item.lang] = item.value;
            }
          });
        }

        const customOptions = (values.customOptions || []).map((opt: any) => {
          let options;
          if (opt.type === 'select' && opt.optionsText) {
            options = opt.optionsText
              .split('\n')
              .filter((l: string) => l.trim())
              .map((l: string) => {
                const parts = l.split(':');
                return {
                  value: parts[0]?.trim() || '',
                  label: parts[1]?.trim() || parts[0]?.trim(),
                  localizedLabels: parts[2]
                    ? { en: parts[2].trim() }
                    : undefined,
                };
              });
          }
          return {
            id: opt.id,
            label: opt.label,
            localizedLabels: opt.labelEn ? { en: opt.labelEn } : undefined,
            type: opt.type,
            required: !!opt.required,
            description: opt.description,
            localizedDescriptions: opt.descriptionEn
              ? { en: opt.descriptionEn }
              : undefined,
            options,
          };
        });

        const updatedItem = {
          ...values,
          localizedNames,
          localizedDescriptions,
          customOptions,
        };
        delete updatedItem.localizedNamesList;
        delete updatedItem.localizedDescriptionsList;

        const newItems = [...prev.items];
        if (editingItem) {
          const idx = newItems.findIndex((i) => i.id === editingItem.id);
          if (idx !== -1)
            newItems[idx] = { ...editingItem, ...updatedItem } as ServiceItem;
        } else {
          newItems.push(updatedItem as ServiceItem);
        }
        return { ...prev, items: newItems };
      });
      setIsEditing(false);
    });
  };

  const handleSyncToGitHub = async () => {
    if (!localData) return;

    if (JSON.stringify(data) === JSON.stringify(localData)) {
      message.info(t('pr.noChangesDetected'));
      return;
    }

    await saveData(
      'public/data/servicesData.json',
      localData,
      'Update services data via Admin Panel',
    );
  };

  const columns = [
    { title: t('pr.idColumn'), dataIndex: 'id', key: 'id', width: 100 },
    {
      title: t('pr.categoriesSection'),
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (val: string) => {
        const cat = localData.categories.find((c) => c.id === val);
        const name = cat
          ? isZh
            ? cat.name
            : cat.localizedNames?.['en'] || cat.name
          : val;
        return name;
      },
    },
    {
      title: t('admin.servicesAdmin.itemName'),
      dataIndex: 'name',
      key: 'name',
      render: (val: string, record: ServiceItem) => {
        return isZh ? val : record.localizedNames?.['en'] || val;
      },
    },
    {
      title: t('pr.basePrice'),
      dataIndex: 'basePrice',
      key: 'basePrice',
      width: 100,
      render: (val: number, record: ServiceItem) => `${val} / ${record.unit}`,
    },
    {
      title: t('pr.actionsColumn'),
      key: 'actions',
      width: 120,
      render: (_: any, record: ServiceItem) => (
        <Space>
          <Tooltip title={t('pr.tooltipEditService')}>
            <Button
              type='text'
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title={t('pr.tooltipDeleteService')}>
            <Button
              type='text'
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredItems = localData.items.filter((item) => {
    const term = searchText.toLowerCase();
    const subNames = Object.values(item.localizedNames || {})
      .join(' ')
      .toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      item.id.toLowerCase().includes(term) ||
      subNames.includes(term)
    );
  });

  const serviceSchema: FieldSchema[] = [
    {
      name: 'id',
      label: t('pr.serviceId'),
      type: 'string',
      required: true,
      disabled: !!editingItem,
    },
    {
      name: 'category',
      label: t('pr.categoriesSection'),
      type: 'select',
      required: true,
      options: localData.categories.map((c) => ({
        value: c.id,
        label: isZh ? c.name : c.localizedNames?.['en'] || c.name,
      })),
    },
    {
      name: 'name',
      label: t('admin.servicesAdmin.mainName'),
      type: 'string',
      required: true,
    },
    {
      name: 'localizedNamesList',
      label: t('admin.servicesAdmin.localizedNames'),
      type: 'localized-list',
    },
    {
      name: 'basePrice',
      label: t('pr.basePrice'),
      type: 'number',
      required: true,
    },
    { name: 'unit', label: t('pr.unit'), type: 'string', required: true },
    {
      name: 'turnaroundDays',
      label: t('pr.turnaroundDays'),
      type: 'number',
      required: true,
    },
    {
      name: 'description',
      label: t('admin.servicesAdmin.mainDesc'),
      type: 'text',
      required: true,
    },
    {
      name: 'localizedDescriptionsList',
      label: t('admin.servicesAdmin.localizedDesc'),
      type: 'localized-list',
    },
    {
      name: 'requiresSampleType',
      label: t('pr.requiresSampleType'),
      type: 'select-multiple',
      options: [
        { value: 'powder', label: t('pr.samplePowder') },
        { value: 'liquid', label: t('pr.sampleLiquid') },
        { value: 'electrode_sheet', label: t('pr.sampleElectrode') },
        { value: 'other', label: t('pr.sampleOther') },
      ],
    },
    {
      name: 'dependencies',
      label: t('pr.dependencies'),
      type: 'select-multiple',
      options: localData.items.map((i) => ({ value: i.id, label: i.name })),
    },
    {
      name: 'minSamples',
      label: t('pr.minSamples'),
      type: 'number',
      required: true,
    },
    {
      name: 'allowCustomParams',
      label: t('pr.allowCustomParams'),
      type: 'boolean',
    },
    {
      name: 'customOptions',
      label: '客製化選項 (Custom Options)',
      type: 'object-list',
      placeholder: '新增選項 (Add Option)',
      subFields: [
        {
          name: 'id',
          label: 'ID (e.g. solvent)',
          type: 'string',
          required: true,
        },
        { name: 'label', label: '名稱 (中文)', type: 'string', required: true },
        { name: 'labelEn', label: '名稱 (English)', type: 'string' },
        {
          name: 'type',
          label: '類型 (Type)',
          type: 'select',
          required: true,
          options: [
            { value: 'checkbox', label: 'Checkbox' },
            { value: 'select', label: 'Select' },
            { value: 'text', label: 'Text' },
            { value: 'number', label: 'Number' },
          ],
        },
        { name: 'required', label: '必選 (Required)', type: 'boolean' },
        { name: 'description', label: '說明 (中文)', type: 'text' },
        { name: 'descriptionEn', label: '說明 (English)', type: 'text' },
        {
          name: 'optionsText',
          label:
            '下拉選單選項 (Options for Select type, one per line. Format: value:中文標籤:EnglishLabel)',
          type: 'text',
        },
      ],
    },
  ];

  return (
    <Card
      className='bg-[var(--color-surface-1)] border-[var(--shell-border)]'
      title={
        <div className='flex items-center justify-between'>
          <Space>
            <Title level={5} className='!m-0 text-[var(--color-text-primary)]'>
              {t('pr.servicesAdminTitle')}
            </Title>
            <Input
              placeholder={t('admin.servicesAdmin.searchService')}
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              className='ml-4 w-48'
            />
          </Space>
          <Space>
            <Tooltip title={t('admin.servicesAdmin.setToken')}>
              <Button
                icon={<SettingOutlined />}
                onClick={() => setIsTokenModalOpen(true)}
              />
            </Tooltip>
            <Button
              type='primary'
              icon={<CloudUploadOutlined />}
              onClick={handleSyncToGitHub}
              loading={isSyncing}
              disabled={JSON.stringify(data) === JSON.stringify(localData)}
            >
              {t('admin.servicesAdmin.saveGithub')}
            </Button>
          </Space>
        </div>
      }
    >
      <GitHubTokenModal
        open={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
      />

      <Tabs
        defaultActiveKey='1'
        items={[
          {
            key: '1',
            label: t('pr.servicesAdminTitle'),
            children: (
              <>
                <div className='flex justify-end mb-4'>
                  <Button icon={<PlusOutlined />} onClick={handleAdd}>
                    {t('pr.addService')}
                  </Button>
                </div>
                <Table
                  dataSource={filteredItems}
                  columns={columns}
                  rowKey='id'
                  size='small'
                  pagination={{ pageSize: 10 }}
                  className='bg-transparent'
                />
              </>
            ),
          },
          {
            key: '2',
            label: t('pr.categoriesSection'),
            children: (
              <>
                <div className='flex justify-end mb-4'>
                  <Button icon={<PlusOutlined />} onClick={handleCategoryAdd}>
                    {t('pr.addCategory')}
                  </Button>
                </div>
                <Table
                  dataSource={localData.categories}
                  columns={categoryColumns}
                  rowKey='id'
                  size='small'
                  pagination={{ pageSize: 10 }}
                  className='bg-transparent'
                />
              </>
            ),
          },
        ]}
      />

      <Modal
        title={editingItem ? t('pr.editService') : t('pr.addService')}
        open={isEditing}
        forceRender
        onOk={handleSave}
        onCancel={() => setIsEditing(false)}
        width={700}
      >
        <div className='max-h-[60vh] overflow-y-auto p-1'>
          <DynamicForm form={form} schema={serviceSchema} />
        </div>
      </Modal>

      <Modal
        title={editingCategory ? t('pr.editCategory') : t('pr.addNewCategory')}
        open={isCategoryEditing}
        forceRender
        onOk={handleCategorySave}
        onCancel={() => setIsCategoryEditing(false)}
      >
        <Form form={categoryForm} layout='vertical'>
          <Form.Item name='id' label='ID (Optional, auto-generated if empty)'>
            <Input
              disabled={!!editingCategory}
              placeholder='e.g. electrochemical'
            />
          </Form.Item>
          <Form.Item
            name='name'
            label={t('pr.categoryName')}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name='nameEn' label='Category Name (English)'>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
