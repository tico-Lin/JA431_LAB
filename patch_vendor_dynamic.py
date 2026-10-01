import re

with open('src/pages/VendorPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

total_html_old = """                <div className='text-3xl font-bold text-[var(--color-accent)] mt-1'>
                  TWD {totalAmount.toLocaleString()}
                </div>"""
                
total_html_new = """                <div className='text-3xl font-bold text-[var(--color-accent)] mt-1'>
                  TWD {totalAmount.toLocaleString()}
                </div>
                {totalAmount >= 10000 && (
                  <div className='mt-3 text-xs text-orange-700 bg-orange-50 p-2 border border-orange-200 rounded'>
                    💡 委託金額已達專案評估門檻，建議勾選左側表單之「<b>進階需求評估</b>」，以享有專屬樣品優先排程與技術研討會議。
                  </div>
                )}"""

content = content.replace(total_html_old, total_html_new)

# One more thing: update description to support newlines nicely since I added newlines (\n) to JSON.
# `white-space: pre-line` is needed in the description div.
desc_old = "className='text-sm text-[var(--color-text-secondary)] mt-1 border-l-2 border-[var(--color-border)] pl-3 py-0.5 bg-black/5 rounded-r'"
desc_new = "className='text-sm text-[var(--color-text-secondary)] mt-1 border-l-2 border-[var(--color-border)] pl-3 py-0.5 bg-black/5 rounded-r whitespace-pre-line'"
content = content.replace(desc_old, desc_new)

with open('src/pages/VendorPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched VendorPage dynamic alert and whitespace.")
