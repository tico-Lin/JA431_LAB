import React, { useState } from 'react';
import {
  Card,
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
    form.setFieldsValue({
      ...item,
      localizedNamesList,
      localizedDescriptionsList,
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

        const updatedItem = {
          ...values,
          localizedNames,
          localizedDescriptions,
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
        const name = cat ? (isZh ? cat.nameZh : cat.nameEn) : val;
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
        label: c.nameZh,
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
            <Button icon={<PlusOutlined />} onClick={handleAdd}>
              {t('pr.addService')}
            </Button>
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

      <Table
        dataSource={filteredItems}
        columns={columns}
        rowKey='id'
        size='small'
        pagination={{ pageSize: 10 }}
        className='bg-transparent'
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
    </Card>
  );
};
