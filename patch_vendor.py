import re

with open('src/pages/VendorPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add icons to import
icons_import_old = "import { MailOutlined, ImportOutlined } from '@ant-design/icons';"
icons_import_new = "import { MailOutlined, ImportOutlined, BankOutlined, EnvironmentOutlined, BarcodeOutlined, ToolOutlined } from '@ant-design/icons';"
content = content.replace(icons_import_old, icons_import_new)

# Also ensure Tag, Space are in antd imports
if "Tag," not in content and "Space," not in content:
    antd_import_old = "Modal,\n  Tabs,\n} from 'antd';"
    antd_import_new = "Modal,\n  Tabs,\n  Tag,\n  Space,\n} from 'antd';"
    content = content.replace(antd_import_old, antd_import_new)

# Modify the render function of the name column
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

with open('src/pages/VendorPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched VendorPage.tsx to add beautiful tags for NSTC items")
