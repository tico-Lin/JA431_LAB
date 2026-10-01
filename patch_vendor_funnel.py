import re

with open('src/pages/VendorPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Checkbox, Alert to antd imports
content = content.replace("  Tag,\n} from 'antd';", "  Tag,\n  Checkbox,\n  Alert,\n} from 'antd';")

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
      
# Find exactly where to replace
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

              <Form.Item name={['client', 'isShortTermProject']} valuePropName="checked" className="mb-0 bg-blue-50/50 p-3 rounded border border-blue-100">
                <Checkbox className="text-sm">
                  <span className="font-bold text-blue-800">進階需求評估</span>：本委託涉及複雜研發瓶頸，希望進一步評估轉為「短期技術服務合約」以取得完整結案報告。
                </Checkbox>
              </Form.Item>"""

content = content.replace("""              <Form.Item name='notes' label={t('vendor.notes')}>
                <Input.TextArea placeholder={t('vendor.notesPlaceholder')} />
              </Form.Item>""", checkbox_html)

with open('src/pages/VendorPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched VendorPage for business funnel.")
