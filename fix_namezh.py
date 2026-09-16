with open('/workspaces/JA431_LAB/src/components/PRGenerator/ServicesAdmin.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("cat ? (isZh ? cat.nameZh : cat.nameEn)", "cat ? (isZh ? cat.name : cat.localizedNames?.['en'] || cat.name)")
content = content.replace("label: c.nameZh", "label: isZh ? c.name : c.localizedNames?.['en'] || c.name")

with open('/workspaces/JA431_LAB/src/components/PRGenerator/ServicesAdmin.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
