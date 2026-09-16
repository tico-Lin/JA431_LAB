with open('/workspaces/JA431_LAB/src/components/PRGenerator/ServicesAdmin.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

schema_addition = """    {
      name: 'allowCustomParams',
      label: t('pr.allowCustomParams'),
      type: 'boolean',
    },
    {
      name: 'customOptions',
      label: '客製化選項 (Custom Options)',
      type: 'object-list',
      placeholder: '新增選項 (Add Option)',
      subFields: [
        { name: 'id', label: 'ID (e.g. solvent)', type: 'string', required: true },
        { name: 'label', label: '名稱 (中文)', type: 'string', required: true },
        { name: 'labelEn', label: '名稱 (English)', type: 'string' },
        { 
          name: 'type', 
          label: '類型 (Type)', 
          type: 'select', 
          required: true,
          options: [
            { value: 'checkbox', label: 'Checkbox' },
            { value: 'select', label: 'Select' },
            { value: 'text', label: 'Text' },
            { value: 'number', label: 'Number' },
          ]
        },
        { name: 'required', label: '必選 (Required)', type: 'boolean' },
        { name: 'description', label: '說明 (中文)', type: 'text' },
        { name: 'descriptionEn', label: '說明 (English)', type: 'text' },
        { 
          name: 'optionsText', 
          label: '下拉選單選項 (Options for Select type, one per line. Format: value:中文標籤:EnglishLabel)', 
          type: 'text' 
        }
      ]
    },"""
content = content.replace("    {\n      name: 'allowCustomParams',\n      label: t('pr.allowCustomParams'),\n      type: 'boolean',\n    },", schema_addition)

handle_edit_search = """    form.setFieldsValue({
      ...item,
      localizedNamesList,
      localizedDescriptionsList,
    });"""
handle_edit_addition = r"""    const customOptions = item.customOptions?.map(opt => ({
      ...opt,
      labelEn: opt.localizedLabels?.en || '',
      descriptionEn: opt.localizedDescriptions?.en || '',
      optionsText: opt.options?.map(o => `${o.value}:${o.label}:${o.localizedLabels?.en || ''}`).join('\n') || ''
    })) || [];
    
    form.setFieldsValue({
      ...item,
      localizedNamesList,
      localizedDescriptionsList,
      customOptions,
    });"""
content = content.replace(handle_edit_search, handle_edit_addition)

handle_add_search = """      localizedNamesList: [],
      localizedDescriptionsList: [],"""
handle_add_addition = """      localizedNamesList: [],
      localizedDescriptionsList: [],
      customOptions: [],"""
content = content.replace(handle_add_search, handle_add_addition)

handle_save_search = """        const updatedItem = {
          ...values,
          localizedNames,
          localizedDescriptions,
        };
        delete updatedItem.localizedNamesList;
        delete updatedItem.localizedDescriptionsList;"""
handle_save_mapping = r"""        const customOptions = (values.customOptions || []).map((opt: any) => {
          let options;
          if (opt.type === 'select' && opt.optionsText) {
            options = opt.optionsText.split('\n').filter((l: string) => l.trim()).map((l: string) => {
              const parts = l.split(':');
              return {
                value: parts[0]?.trim() || '',
                label: parts[1]?.trim() || parts[0]?.trim(),
                localizedLabels: parts[2] ? { en: parts[2].trim() } : undefined
              };
            });
          }
          return {
            id: opt.id,
            label: opt.label,
            localizedLabels: opt.labelEn ? { en: opt.labelEn } : undefined,
            type: opt.type,
            required: !!opt.required,
            description: opt.description,
            localizedDescriptions: opt.descriptionEn ? { en: opt.descriptionEn } : undefined,
            options,
          };
        });

        const updatedItem = {
          ...values,
          localizedNames,
          localizedDescriptions,
          customOptions,
        };
        delete updatedItem.localizedNamesList;
        delete updatedItem.localizedDescriptionsList;"""
content = content.replace(handle_save_search, handle_save_mapping)

with open('/workspaces/JA431_LAB/src/components/PRGenerator/ServicesAdmin.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ServicesAdmin.tsx")
