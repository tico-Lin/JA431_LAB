import re

with open('src/pages/VendorPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Checkbox, Alert to antd imports
content = content.replace("  Tabs,\n  Tag,\n} from 'antd';", "  Tabs,\n  Tag,\n  Checkbox,\n  Alert,\n} from 'antd';")

# Replace icons
icons_import_old = "import { MailOutlined, ImportOutlined, BankOutlined, EnvironmentOutlined, BarcodeOutlined, ToolOutlined } from '@ant-design/icons';"
# The previous checkout reverted the icons? Let's see:
if "BankOutlined" not in content:
    content = content.replace("import { MailOutlined, ImportOutlined } from '@ant-design/icons';", "import { MailOutlined, ImportOutlined, BankOutlined, EnvironmentOutlined, BarcodeOutlined, ToolOutlined } from '@ant-design/icons';")

# Modify the render function of the name column (from the first step)
if "詳細的儀器資訊區塊" not in content:
    render_old = """        return (
          <div>
            <div className='font-bold text-[var(--color-text-primary)]'>
              {name}
            </div>
            <div className='text-xs text-[var(--color-text-secondary)]'>
              {description}
            </div>
          </div>
        );"""
    
    render_new = """        return (
          <div className='flex flex-col gap-2 my-1'>
            <div className='font-bold text-[var(--color-text-primary)] text-base'>
              {name}
            </div>
            
            {/* 詳細的儀器資訊區塊 */}
            {(record.institution || record.location || record.instrumentCode || record.serviceType) && (
              <div className='flex flex-wrap gap-2 text-xs'>
                {record.institution && (
                  <Tag icon={<BankOutlined />} color="blue" bordered={false}>{record.institution}</Tag>
                )}
                {record.instrumentCode && (
                  <Tag icon={<BarcodeOutlined />} color="cyan" bordered={false}>{record.instrumentCode}</Tag>
                )}
                {record.serviceType && (
                  <Tag icon={<ToolOutlined />} color="purple" bordered={false}>{record.serviceType}</Tag>
                )}
                {record.location && (
                  <Tag icon={<EnvironmentOutlined />} color="orange" bordered={false}>{record.location}</Tag>
                )}
              </div>
            )}
            
            <div className='text-sm text-[var(--color-text-secondary)] mt-1 border-l-2 border-[var(--color-border)] pl-3 py-0.5 bg-black/5 rounded-r'>
              {description}
            </div>
          </div>
        );"""
    content = content.replace(render_old, render_new)


# Change Tab label
content = content.replace("{ key: 'nstc', label: '他校貴儀代測', children: renderTable(nstcItems) }", "{ key: 'nstc', label: '進階表徵與技術顧問服務', children: renderTable(nstcItems) }")

# Add the banner below subtitle
banner_html = """        </div>
        <Button
          icon={<ImportOutlined />}
          onClick={() => setParseModalOpen(true)}
        >
          {t('vendor.importQuotation')}
        </Button>
      </div>

      {/* 產學合作漏斗引導 Banner */}
      <Alert
        message={<span className='font-bold'>委託檢測與產學合作方案</span>}
        description={
          <div className='flex flex-col gap-1 mt-1 text-sm'>
            <p><strong>第一階 (單次測試)</strong>：提供標準化材料表徵 (內部設備) 與進階數據解析顧問 (外部貴儀)。</p>
            <p><strong>第二階 (短期專案)</strong>：針對複雜研發瓶頸，可轉為短期技術服務合約，取得完整結案報告。</p>
            <p><strong>第三階 (長期產學)</strong>：單次委託金額若達一定門檻，可抵扣或轉置為年度產學合作計畫，享有更深入的技術指導、專屬實驗設計及智財權共享方案。</p>
          </div>
        }
        type="info"
        showIcon
        className="border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5"
      />"""
      
target_replace = """        </div>
        <Button
          icon={<ImportOutlined />}
          onClick={() => setParseModalOpen(true)}
        >
          {t('vendor.importQuotation')}
        </Button>
      </div>"""

content = content.replace(target_replace, banner_html)

# Add checkbox in form
checkbox_html = """              <Form.Item name='notes' label={t('vendor.notes')}>
                <Input.TextArea placeholder={t('vendor.notesPlaceholder')} />
              </Form.Item>

              <Form.Item name={['client', 'isShortTermProject']} valuePropName="checked" className="mb-0 bg-blue-50/50 p-3 rounded border border-blue-100 mt-4">
                <Checkbox className="text-sm">
                  <span className="font-bold text-blue-800">進階需求評估</span>：本委託涉及複雜研發瓶頸，希望進一步評估轉為「短期技術服務合約」以取得完整結案報告。
                </Checkbox>
              </Form.Item>"""

content = content.replace("""              <Form.Item name='notes' label={t('vendor.notes')}>
                <Input.TextArea placeholder={t('vendor.notesPlaceholder')} />
              </Form.Item>""", checkbox_html)

with open('src/pages/VendorPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched VendorPage correctly.")
