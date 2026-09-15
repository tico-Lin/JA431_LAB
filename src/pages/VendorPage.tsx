import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Table,
  Button,
  Card,
  Typography,
  Divider,
  message,
  Modal,
} from 'antd';
import { MailOutlined, ImportOutlined } from '@ant-design/icons';
import { useServicesData } from '../hooks/useServicesData';
import type { ServiceItem } from '../types/serviceTypes';
import { useFormDraft } from '../hooks/useFormDraft';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

interface VendorDraftData {
  formValues: any;
  selectedServices: {
    serviceId: string;
    sampleCount: number;
    customNotes?: string;
  }[];
}

export default function VendorPage() {
  const { t } = useTranslation();
  const { data, loading, error } = useServicesData();
  const [form] = Form.useForm();

  const [selectedServices, setSelectedServices] = useState<
    { serviceId: string; sampleCount: number; customNotes?: string }[]
  >([]);
  const [parseModalOpen, setParseModalOpen] = useState(false);
  const [parseText, setParseText] = useState('');

  const { draft, saveDraft, clearDraft, isInitialized } =
    useFormDraft<VendorDraftData>('ja431_vendor_draft', 600);
  const hasPrompted = useRef(false);

  useEffect(() => {
    if (isInitialized && draft && !hasPrompted.current) {
      hasPrompted.current = true;
      Modal.confirm({
        title: t('vendor.draftFound'),
        content: t('vendor.draftQuestion', {
          date: new Date(draft.lastUpdated).toLocaleString(),
        }),
        okText: t('vendor.restoreDraft'),
        cancelText: t('vendor.clearDraft'),
        onOk: () => {
          if (draft.formData) {
            form.setFieldsValue(draft.formData.formValues);
            setSelectedServices(draft.formData.selectedServices || []);
            message.success(t('vendor.draftRestored'));
          }
        },
        onCancel: () => {
          clearDraft();
          message.info(t('vendor.draftCleared'));
        },
      });
    }
  }, [isInitialized, draft, form, clearDraft]);

  const triggerSaveDraft = (newSelected = selectedServices) => {
    saveDraft({
      formValues: form.getFieldsValue(true),
      selectedServices: newSelected,
    });
  };

  const handleFormChange = () => {
    triggerSaveDraft();
  };

  const handleServiceSelect = (serviceId: string, checked: boolean) => {
    let newSelected;
    if (checked) {
      const service = data?.items.find((i) => i.id === serviceId);
      if (service && service.dependencies) {
        const missingDeps = service.dependencies.filter(
          (depId) => !selectedServices.some((s) => s.serviceId === depId),
        );
        if (missingDeps.length > 0) {
          const depNames = missingDeps
            .map((id) => data?.items.find((i) => i.id === id)?.nameZh)
            .join(', ');
          message.warning(t('vendor.dependenciesHint', { names: depNames }));
        }
      }
      newSelected = [
        ...selectedServices,
        { serviceId, sampleCount: service?.minSamples || 1 },
      ];
    } else {
      newSelected = selectedServices.filter((s) => s.serviceId !== serviceId);
    }
    setSelectedServices(newSelected);
    triggerSaveDraft(newSelected);
  };

  const handleServiceCountChange = (serviceId: string, count: number) => {
    const newSelected = selectedServices.map((s) =>
      s.serviceId === serviceId ? { ...s, sampleCount: count } : s,
    );
    setSelectedServices(newSelected);
    triggerSaveDraft(newSelected);
  };

  const handleServiceNotesChange = (serviceId: string, notes: string) => {
    const newSelected = selectedServices.map((s) =>
      s.serviceId === serviceId ? { ...s, customNotes: notes } : s,
    );
    setSelectedServices(newSelected);
    triggerSaveDraft(newSelected);
  };

  const totalAmount = useMemo(() => {
    if (!data) return 0;
    return selectedServices.reduce((sum, sel) => {
      const service = data.items.find((i) => i.id === sel.serviceId);
      return sum + (service?.basePrice || 0) * (sel.sampleCount || 0);
    }, 0);
  }, [selectedServices, data]);

  const generateQuotationText = (formValues: any) => {
    if (!data) return '';
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const qId = `JA431-EST-${dateStr}-${Math.floor(1000 + Math.random() * 9000)}`;

    let text = `${t('vendor.quotationTitle')}\n`;
    text += `${t('vendor.quotationNumber')}: ${qId}\n\n`;
    text += `${t('vendor.clientInformation')}\n`;
    text += `${t('vendor.company')}: ${formValues.client?.company || ''}\n`;
    text += `${t('vendor.contactName')}: ${formValues.client?.contactName || ''}\n`;
    text += `Email: ${formValues.client?.email || ''}\n`;
    text += `${t('vendor.phone')}: ${formValues.client?.phone || ''}\n\n`;

    text += `${t('vendor.sampleInformation')}\n`;
    text += `${t('vendor.sampleName')}: ${formValues.sample?.name || ''}\n`;
    text += `${t('vendor.sampleForm')}: ${formValues.sample?.form || ''}\n`;
    text += `${t('vendor.estimatedCount')}: ${formValues.sample?.count || ''}\n`;
    text += `${t('vendor.hazardNotes')}: ${formValues.sample?.hazardNotes || t('vendor.none')}\n\n`;

    text += `${t('vendor.services')}\n`;
    selectedServices.forEach((sel, i) => {
      const s = data.items.find((item) => item.id === sel.serviceId);
      if (s) {
        text += `${i + 1}. [${s.id}] ${s.nameZh} x ${sel.sampleCount} ${s.unit} - ${t('vendor.estimated')} TWD ${s.basePrice * sel.sampleCount}\n`;
        if (sel.customNotes) {
          text += `   ${t('vendor.customParameters')}: ${sel.customNotes}\n`;
        }
      }
    });

    text += `\n${t('vendor.totalEstimatedAmount')}\n`;
    text += `TWD ${totalAmount}\n\n`;

    text += `${t('vendor.notes')}\n`;
    text += `${formValues.notes || t('vendor.none')}\n`;

    return text;
  };

  const handleSendEmail = async () => {
    try {
      const values = await form.validateFields();
      if (selectedServices.length === 0) {
        message.error(t('vendor.selectServiceError'));
        return;
      }

      const emailBody = generateQuotationText(values);
      const subject = encodeURIComponent(
        `${t('vendor.emailSubject')} ${values.client?.company} - ${values.sample?.name}`,
      );
      const body = encodeURIComponent(emailBody);
      window.location.href = `mailto:hsu0625@pu.edu.tw?subject=${subject}&body=${body}`;

      clearDraft();
    } catch (e) {
      message.error(t('vendor.requiredFieldsError'));
    }
  };

  const handleParseText = () => {
    if (!parseText.trim()) return;

    // Simple Regex bidirectional parser
    try {
      const escapeRegExp = (value: string) =>
        value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const fieldPattern = (label: string) =>
        new RegExp(`${escapeRegExp(label)}:\\s*(.*)`);
      const companyMatch = parseText.match(fieldPattern(t('vendor.company')));
      const contactMatch = parseText.match(
        fieldPattern(t('vendor.contactName')),
      );
      const emailMatch = parseText.match(fieldPattern('Email'));
      const phoneMatch = parseText.match(fieldPattern(t('vendor.phone')));
      const sNameMatch = parseText.match(fieldPattern(t('vendor.sampleName')));
      const sFormMatch = parseText.match(fieldPattern(t('vendor.sampleForm')));
      const sCountMatch = parseText.match(
        fieldPattern(t('vendor.estimatedCount')),
      );
      const sHazardMatch = parseText.match(
        fieldPattern(t('vendor.hazardNotes')),
      );

      form.setFieldsValue({
        client: {
          company: companyMatch ? companyMatch[1].trim() : '',
          contactName: contactMatch ? contactMatch[1].trim() : '',
          email: emailMatch ? emailMatch[1].trim() : '',
          phone: phoneMatch ? phoneMatch[1].trim() : '',
        },
        sample: {
          name: sNameMatch ? sNameMatch[1].trim() : '',
          form: sFormMatch ? sFormMatch[1].trim() : 'powder',
          count: sCountMatch ? parseInt(sCountMatch[1], 10) : 1,
          hazardNotes: sHazardMatch ? sHazardMatch[1].trim() : '',
        },
      });

      // Parse selected items
      const parsedItems: {
        serviceId: string;
        sampleCount: number;
        customNotes?: string;
      }[] = [];

      // Need to iterate lines for custom notes
      const lines = parseText.split('\n');
      let currentItem: any = null;

      lines.forEach((line) => {
        const iMatch = line.match(
          new RegExp(
            `\\[([a-zA-Z0-9-]+)\\]\\s*.*\\s+x\\s*(\\d+)\\s*.*-\\s*${escapeRegExp(t('vendor.estimated'))} TWD`,
          ),
        );
        if (iMatch) {
          currentItem = {
            serviceId: iMatch[1],
            sampleCount: parseInt(iMatch[2], 10),
          };
          parsedItems.push(currentItem);
        } else if (
          currentItem &&
          line.startsWith(`   ${t('vendor.customParameters')}:`)
        ) {
          currentItem.customNotes = line
            .split(`${t('vendor.customParameters')}:`)[1]
            .trim();
        }
      });

      if (parsedItems.length > 0) {
        setSelectedServices(parsedItems);
      }

      message.success(t('vendor.parseSuccess'));
      setParseModalOpen(false);
    } catch (e) {
      message.error(t('vendor.parseError'));
    }
  };

  const columns = [
    {
      title: t('vendor.selectColumn'),
      key: 'select',
      width: 60,
      render: (_: any, record: ServiceItem) => {
        const isSelected = selectedServices.some(
          (s) => s.serviceId === record.id,
        );
        return (
          <input
            type='checkbox'
            className='w-4 h-4 cursor-pointer'
            checked={isSelected}
            onChange={(e) => handleServiceSelect(record.id, e.target.checked)}
          />
        );
      },
    },
    {
      title: t('vendor.serviceColumn'),
      dataIndex: 'nameZh',
      key: 'nameZh',
      render: (text: string, record: ServiceItem) => (
        <div>
          <div className='font-bold text-[var(--color-text-primary)]'>
            {text}
          </div>
          <div className='text-xs text-[var(--color-text-secondary)]'>
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: t('vendor.priceColumn'),
      dataIndex: 'basePrice',
      key: 'basePrice',
      width: 120,
      render: (val: number, record: ServiceItem) => `${val} / ${record.unit}`,
    },
    {
      title: t('vendor.turnaroundColumn'),
      dataIndex: 'turnaroundDays',
      key: 'turnaroundDays',
      width: 100,
      render: (val: number) => `${val} ${t('vendor.days')}`,
    },
    {
      title: t('vendor.configurationColumn'),
      key: 'config',
      width: 200,
      render: (_: any, record: ServiceItem) => {
        const sel = selectedServices.find((s) => s.serviceId === record.id);
        if (!sel) return null;
        return (
          <div className='flex flex-col gap-2'>
            <InputNumber
              min={record.minSamples}
              value={sel.sampleCount}
              onChange={(v) =>
                handleServiceCountChange(record.id, v || record.minSamples)
              }
              size='small'
              addonBefore={t('vendor.quantity')}
            />
            {record.allowCustomParams && (
              <Input
                placeholder={t('vendor.customParametersPlaceholder')}
                size='small'
                value={sel.customNotes}
                onChange={(e) =>
                  handleServiceNotesChange(record.id, e.target.value)
                }
              />
            )}
          </div>
        );
      },
    },
  ];

  if (loading)
    return <div className='p-8 text-center'>{t('common.loadingData')}</div>;
  if (error || !data)
    return (
      <div className='p-8 text-center text-red-500'>
        {t('common.failedToLoad')}: {error}
      </div>
    );

  return (
    <div className='space-y-8 animate-fade-in'>
      <div className='flex justify-between items-end'>
        <div>
          <Title level={2} className='!text-[var(--color-text-primary)] !m-0'>
            {t('vendor.title')}
          </Title>
          <Paragraph className='text-[var(--color-text-secondary)] mt-2'>
            {t('vendor.subtitle')}
          </Paragraph>
        </div>
        <Button
          icon={<ImportOutlined />}
          onClick={() => setParseModalOpen(true)}
        >
          {t('vendor.importQuotation')}
        </Button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <Card
            title={t('vendor.chooseServices')}
            className='bg-[var(--color-surface-1)] border-[var(--shell-border)]'
          >
            <Table
              dataSource={data.items}
              columns={columns}
              rowKey='id'
              pagination={false}
              size='middle'
              className='bg-transparent'
              rowClassName={(record) =>
                selectedServices.some((s) => s.serviceId === record.id)
                  ? 'bg-[var(--color-accent)]/10'
                  : ''
              }
            />
          </Card>
        </div>

        <div className='space-y-6'>
          <Card
            title={t('vendor.requestInformation')}
            className='bg-[var(--color-surface-1)] border-[var(--shell-border)]'
          >
            <Form
              form={form}
              layout='vertical'
              onValuesChange={handleFormChange}
              initialValues={{
                client: { company: '', contactName: '', email: '', phone: '' },
                sample: { name: '', form: 'powder', count: 1, hazardNotes: '' },
                notes: '',
              }}
            >
              <Divider plain>{t('vendor.contactInformation')}</Divider>
              <Form.Item
                name={['client', 'company']}
                label={t('vendor.company')}
                rules={[{ required: true }]}
              >
                <Input placeholder={t('vendor.companyPlaceholder')} />
              </Form.Item>
              <div className='grid grid-cols-2 gap-4'>
                <Form.Item
                  name={['client', 'contactName']}
                  label={t('vendor.contactName')}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={['client', 'phone']}
                  label={t('vendor.phone')}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </div>
              <Form.Item
                name={['client', 'email']}
                label='Email'
                rules={[{ required: true, type: 'email' }]}
              >
                <Input />
              </Form.Item>

              <Divider plain>{t('vendor.sampleInformation')}</Divider>
              <Form.Item
                name={['sample', 'name']}
                label={t('vendor.sampleName')}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <div className='grid grid-cols-2 gap-4'>
                <Form.Item
                  name={['sample', 'form']}
                  label={t('vendor.sampleForm')}
                >
                  <Select
                    options={[
                      { value: 'powder', label: t('vendor.forms.powder') },
                      { value: 'liquid', label: t('vendor.forms.liquid') },
                      {
                        value: 'electrode_sheet',
                        label: t('vendor.forms.electrodeSheet'),
                      },
                      { value: 'other', label: t('vendor.forms.other') },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name={['sample', 'count']}
                  label={t('vendor.estimatedCount')}
                >
                  <InputNumber min={1} className='w-full' />
                </Form.Item>
              </div>
              <Form.Item
                name={['sample', 'hazardNotes']}
                label={t('vendor.hazardNotes')}
              >
                <Input.TextArea placeholder={t('vendor.hazardPlaceholder')} />
              </Form.Item>

              <Form.Item name='notes' label={t('vendor.notes')}>
                <Input.TextArea placeholder={t('vendor.notesPlaceholder')} />
              </Form.Item>
            </Form>
          </Card>

          <Card className='bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface-1)] border-[var(--shell-border)]'>
            <div className='flex flex-col gap-4'>
              <div>
                <div className='text-sm text-[var(--color-text-secondary)]'>
                  {t('vendor.estimatedTotal')}
                </div>
                <div className='text-3xl font-bold text-[var(--color-accent)] mt-1'>
                  TWD {totalAmount.toLocaleString()}
                </div>
              </div>
              <Button
                type='primary'
                size='large'
                icon={<MailOutlined />}
                onClick={handleSendEmail}
                className='w-full font-bold'
              >
                {t('vendor.sendQuotation')}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        title={t('vendor.parseQuotation')}
        open={parseModalOpen}
        onCancel={() => setParseModalOpen(false)}
        onOk={handleParseText}
        okText={t('vendor.parseAndApply')}
      >
        <div className='mb-2 text-sm text-[var(--color-text-secondary)]'>
          {t('vendor.parseDescription')}
        </div>
        <Input.TextArea
          rows={12}
          value={parseText}
          onChange={(e) => setParseText(e.target.value)}
          className='font-mono text-xs'
          placeholder={t('vendor.quotationPlaceholder')}
        />
      </Modal>
    </div>
  );
}
