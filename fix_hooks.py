with open('src/pages/VendorPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract tabItems useMemo
start_idx = content.find("  const tabItems = useMemo(() => {")
end_idx = content.find("  }, [data, columns, selectedServices]);") + len("  }, [data, columns, selectedServices]);")

tab_items_block = content[start_idx:end_idx]

# Remove it from the original location
content = content[:start_idx] + content[end_idx:]

# Find where to insert it: before `if (loading)`
insert_idx = content.find("  if (loading)")

# Insert
new_content = content[:insert_idx] + tab_items_block + "\n\n" + content[insert_idx:]

with open('src/pages/VendorPage.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Fixed hooks order successfully.")
