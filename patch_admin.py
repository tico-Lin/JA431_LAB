import re

with open('src/components/PRGenerator/ServicesAdmin.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

fields_new = """    {
      name: 'instrumentModel',
      label: '儀器型號 (Instrument Model)',
      type: 'string',
    },
    {
      name: 'institution',
      label: '單位 (Institution)',
      type: 'string',
    },
    {
      name: 'location',
      label: '放置地點 (Location)',
      type: 'string',
    },
    {
      name: 'instrumentCode',
      label: '儀器代碼 (Instrument Code)',
      type: 'string',
    },
    {
      name: 'serviceType',
      label: '服務類型 (Service Type, e.g. 委託操作)',
      type: 'string',
    },"""

fields_old = """    {
      name: 'instrumentModel',
      label: '儀器型號 (Instrument Model)',
      type: 'string',
    },"""

content = content.replace(fields_old, fields_new)

with open('src/components/PRGenerator/ServicesAdmin.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched ServicesAdmin.tsx")
