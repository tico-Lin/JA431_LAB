import React, { useState } from 'react';
import {
  Card,
  Table,
  Input,
  InputNumber,
  Button,
  Typography,
  Modal,
  Form,
  Select,
  Space,
  message,
  Tooltip,
} from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useServicesData } from '../../hooks/useServicesData';
import type { ServicesData, ServiceItem } from '../../types/serviceTypes';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

interface ServicesAdminProps {
  onGeneratePR: (content: string, changes: ServicesData) => void;
}

export const ServicesAdmin: React.FC<ServicesAdminProps> = ({
  onGeneratePR,
}) => {
  const { data, loading, error } = useServicesData();
  const { t, i18n } = useTranslation();
  const isZh = i18n.language === 'zh-TW';
  const [localData, setLocalData] = useState<ServicesData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [form] = Form.useForm();

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
    form.setFieldsValue(item);
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
        const newItems = [...prev.items];
        if (editingItem) {
          const idx = newItems.findIndex((i) => i.id === editingItem.id);
          if (idx !== -1)
            newItems[idx] = { ...editingItem, ...values } as ServiceItem;
        } else {
          newItems.push(values as ServiceItem);
        }
        return { ...prev, items: newItems };
      });
      setIsEditing(false);
    });
  };

  const handleGeneratePR = () => {
    if (!localData) return;

    // Check if changed
    if (JSON.stringify(data) === JSON.stringify(localData)) {
      message.info(t('pr.noChangesDetected'));
      return;
    }

    const prContent = `## 更新委託檢測價目與服務 (Update Services Pricing & Items)

### 變更說明
實驗室管理員透過 RP 區管理面板修改了 \`public/data/servicesData.json\`。

### 修改明細預覽
請檢視下方 JSON 以確認服務分類、單價或說明之更新。
\`\`\`json
${JSON.stringify(localData, null, 2)}
\`\`\`

### 檢查清單
- [ ] 確認單價與交期合理。
- [ ] 確認無拼字錯誤。
`;
    onGeneratePR(prContent, localData);
  };

  const columns = [
    {
      title: t('pr.idColumn'),
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: t('pr.categoriesSection'),
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (val: string) => {
        const cat = localData.categories.find((c) => c.id === val);
        return cat ? (isZh ? cat.nameZh : cat.nameEn) : val;
      },
    },
    {
      title: isZh ? t('pr.serviceNameZh') : t('pr.serviceNameEn'),
      dataIndex: isZh ? 'nameZh' : 'nameEn',
      key: 'name',
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

  return (
    <Card
      className='mt-8 border border-[var(--shell-border)]'
      style={{ background: 'var(--color-surface-1)' }}
      title={
        <div className='flex items-center justify-between'>
          <Title level={5} className='!m-0 text-[var(--color-text-primary)]'>
            {t('pr.servicesAdminTitle')}
          </Title>
          <Space>
            <Button icon={<PlusOutlined />} onClick={handleAdd}>
              {t('pr.addService')}
            </Button>
            <Button
              type='primary'
              onClick={handleGeneratePR}
              disabled={JSON.stringify(data) === JSON.stringify(localData)}
            >
              {t('pr.generatePr')}
            </Button>
          </Space>
        </div>
      }
    >
      <Table
        dataSource={localData.items}
        columns={columns}
        rowKey='id'
        size='small'
        pagination={false}
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
        <Form form={form} layout='vertical'>
          <div className='grid grid-cols-2 gap-4'>
            <Form.Item
              name='id'
              label={t('pr.serviceId')}
              rules={[{ required: true }]}
            >
              <Input
                disabled={!!editingItem}
                placeholder={t('pr.serviceIdPlaceholder')}
              />
            </Form.Item>
            <Form.Item
              name='category'
              label={t('pr.categoriesSection')}
              rules={[{ required: true }]}
            >
              <Select
                options={localData.categories.map((c) => ({
                  value: c.id,
                  label: isZh ? c.nameZh : c.nameEn,
                }))}
              />
            </Form.Item>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Form.Item
              name='nameZh'
              label={t('pr.serviceNameZh')}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name='nameEn'
              label={t('pr.serviceNameEn')}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <Form.Item
              name='basePrice'
              label={t('pr.basePrice')}
              rules={[{ required: true }]}
            >
              <InputNumber className='w-full' min={0} />
            </Form.Item>
            <Form.Item
              name='unit'
              label={t('pr.unit')}
              rules={[{ required: true }]}
            >
              <Input placeholder={t('pr.unitPlaceholder')} />
            </Form.Item>
            <Form.Item
              name='turnaroundDays'
              label={t('pr.turnaroundDays')}
              rules={[{ required: true }]}
            >
              <InputNumber className='w-full' min={1} />
            </Form.Item>
          </div>

          <Form.Item
            name='description'
            label={t('pr.description')}
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>

          <div className='grid grid-cols-2 gap-4'>
            <Form.Item
              name='requiresSampleType'
              label={t('pr.requiresSampleType')}
            >
              <Select
                mode='multiple'
                options={[
                  { value: 'powder', label: t('pr.samplePowder') },
                  { value: 'liquid', label: t('pr.sampleLiquid') },
                  { value: 'electrode_sheet', label: t('pr.sampleElectrode') },
                  { value: 'other', label: t('pr.sampleOther') },
                ]}
              />
            </Form.Item>
            <Form.Item name='dependencies' label={t('pr.dependencies')}>
              <Select
                mode='multiple'
                options={localData.items.map((i) => ({
                  value: i.id,
                  label: isZh ? i.nameZh : i.nameEn,
                }))}
              />
            </Form.Item>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Form.Item
              name='minSamples'
              label={t('pr.minSamples')}
              rules={[{ required: true }]}
            >
              <InputNumber min={1} className='w-full' />
            </Form.Item>
            <Form.Item
              name='allowCustomParams'
              label={t('pr.allowCustomParams')}
              valuePropName='checked'
            >
              <Select
                options={[
                  { value: true, label: t('pr.yes') },
                  { value: false, label: t('pr.no') },
                ]}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </Card>
  );
};
