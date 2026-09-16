import re

with open('/workspaces/JA431_LAB/src/components/PRGenerator/ServicesAdmin.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Tabs import
content = content.replace("import {\n  Card,", "import {\n  Card,\n  Tabs,")

# 2. Add state for category editing
state_addition = """  const [isCategoryEditing, setIsCategoryEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [categoryForm] = Form.useForm();"""
content = content.replace("const [form] = Form.useForm();", f"const [form] = Form.useForm();\n{state_addition}")

# 3. Add handlers for category
handlers_addition = """
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
            ? { ...prev, categories: prev.categories.filter((c) => c.id !== id) }
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
          id: values.id || values.name.toLowerCase().replace(/\\s+/g, '-'),
          name: values.name,
          localizedNames: values.nameEn ? { en: values.nameEn } : undefined,
        };

        const newCategories = [...prev.categories];
        if (editingCategory) {
          const idx = newCategories.findIndex((c) => c.id === editingCategory.id);
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
      render: (_: any, record: any) => record.localizedNames?.en || '-' 
    },
    {
      title: t('pr.actionsColumn'),
      key: 'actions',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title={t('pr.tooltipEditCategory')}>
            <Button type='text' icon={<EditOutlined />} onClick={() => handleCategoryEdit(record)} />
          </Tooltip>
          <Tooltip title={t('pr.tooltipDeleteCategory')}>
            <Button type='text' danger icon={<DeleteOutlined />} onClick={() => handleCategoryDelete(record.id)} />
          </Tooltip>
        </Space>
      ),
    }
  ];
"""
content = content.replace("const handleEdit = (item: ServiceItem) => {", f"{handlers_addition}\n  const handleEdit = (item: ServiceItem) => {{")


# 4. Modify JSX return to use Tabs
original_card_content = """    <Card
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
    </Card>"""

new_card_content = """    <Card
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

      <Tabs defaultActiveKey="1" items={[
        {
          key: '1',
          label: t('pr.servicesAdminTitle'),
          children: (
            <>
              <div className="flex justify-end mb-4">
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
              <div className="flex justify-end mb-4">
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
        }
      ]} />

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
            <Input disabled={!!editingCategory} placeholder='e.g. electrochemical' />
          </Form.Item>
          <Form.Item name='name' label={t('pr.categoryName')} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='nameEn' label='Category Name (English)'>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>"""

content = content.replace(original_card_content, new_card_content)

with open('/workspaces/JA431_LAB/src/components/PRGenerator/ServicesAdmin.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ServicesAdmin.tsx")
