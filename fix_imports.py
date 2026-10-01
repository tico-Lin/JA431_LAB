import re
with open('src/pages/VendorPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'import \{\s*([\s\S]*?)\s*\} from \'antd\';', lambda m: 'import {\n  ' + ',\n  '.join(sorted(list(set([x.strip() for x in m.group(1).split(',') if x.strip()])))) + ',\n} from \'antd\';', content, 1)

with open('src/pages/VendorPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
