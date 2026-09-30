import re

with open('src/pages/VendorPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

tabs_logic = """
  const tabItems = useMemo(() => {
    if (!data) return [];
    const allItems = data.items;
    
    // 他校貴儀代測
    const nstcItems = allItems.filter(item => item.id.includes('-nstc'));
    
    // 表徵分析 (排除 nstc)
    const charItems = allItems.filter(item => 
      !item.id.includes('-nstc') && 
      (item.category === 'spectroscopy' || item.category === 'advanced_analysis' || item.category === 'chromatography' || item.id === 'prep-sem-gold' || item.id === 'prep-general')
    );
    
    // 電化學分析 (排除 nstc)
    const ecItems = allItems.filter(item => 
      !item.id.includes('-nstc') && 
      (item.category === 'electrochemical' || item.category === 'synthesis_prep' || item.id === 'prep-electrode' || item.id === 'prep-general')
    );

    const renderTable = (dataSource: ServiceItem[]) => (
      <Table
        dataSource={dataSource}
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
    );

    return [
      { key: 'all', label: '全部', children: renderTable(allItems) },
      { key: 'char', label: '表徵分析', children: renderTable(charItems) },
      { key: 'ec', label: '電化學分析', children: renderTable(ecItems) },
      { key: 'nstc', label: '他校貴儀代測', children: renderTable(nstcItems) },
    ];
  }, [data, columns, selectedServices]);

  return ("""

content = content.replace("  return (\n    <div className='space-y-8 animate-fade-in'>", tabs_logic + "\n    <div className='space-y-8 animate-fade-in'>")

table_old = """            <Table
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
            />"""

table_new = """            <Tabs items={tabItems} defaultActiveKey="all" className="p-4" />"""

content = content.replace(table_old, table_new)

with open('src/pages/VendorPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched VendorPage.tsx successfully.")
