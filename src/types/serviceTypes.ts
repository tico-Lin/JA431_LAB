// 檢測項目分類
export type ServiceCategory = string;

// 單一服務項目規格
export interface ServiceItem {
  id: string; // 如: "ec-cv", "spec-raman"
  category: ServiceCategory;
  name: string; // 預設主要語系名稱 (中文)
  localizedNames?: Record<string, string>; // 多語系翻譯
  basePrice: number; // 基準單價 (TWD)
  unit: string; // 計價單位 (如: "樣品/點", "小時", "次")
  turnaroundDays: number; // 預估工作天
  description: string;
  localizedDescriptions?: Record<string, string>; // 多語系說明
  requiresSampleType?: ('powder' | 'liquid' | 'electrode_sheet' | 'other')[]; // 接受樣品形態
  dependencies?: string[]; // 相依項目 ID (例如: 做 EIS 建議先勾選 CV 基準測試)
  minSamples: number; // 最少委託數量
  allowCustomParams: boolean; // 是否允許填寫客製化參數 (如電位窗口、掃速)
  customOptions?: CustomOption[]; // 手動新增的客製化選項
}

// 客製化選項規格
export interface CustomOption {
  id: string; // 選項 ID
  label: string; // 選項名稱 (中文)
  localizedLabels?: Record<string, string>; // 多語系選項名稱
  type: 'checkbox' | 'select' | 'text' | 'number'; // 欄位類型
  required: boolean; // 是否必填
  description?: string; // 說明
  localizedDescriptions?: Record<string, string>; // 多語系說明
  options?: {
    value: string;
    label: string;
    localizedLabels?: Record<string, string>;
  }[]; // 供下拉選單 (select) 使用的選項
}

// 估價單表單狀態
export interface QuotationFormState {
  quotationId: string; // 系統產生 (格式: JA431-EST-YYYYMMDD-XXXX)
  client: {
    company: string;
    contactName: string;
    email: string;
    phone: string;
  };
  sample: {
    name: string;
    form: 'powder' | 'liquid' | 'electrode_sheet' | 'other';
    count: number; // 嚴格純數字 (正整數)
    hazardNotes: string; // 毒性/揮發性/儲存注意事項
  };
  selectedItems: {
    serviceId: string;
    sampleCount: number; // 純數字
    customNotes?: string; // 測試條件 (如: 0.1M KOH, 10 mV/s)
  }[];
  notes: string;
}

export interface ServicesData {
  categories: {
    id: ServiceCategory;
    name: string;
    localizedNames?: Record<string, string>;
  }[];
  items: ServiceItem[];
}
