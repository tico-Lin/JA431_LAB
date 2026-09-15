// 檢測項目分類
export type ServiceCategory =
  | 'electrochemical'
  | 'spectroscopy'
  | 'synthesis_prep'
  | 'advanced_analysis';

// 單一服務項目規格
export interface ServiceItem {
  id: string; // 如: "ec-cv", "spec-raman"
  category: ServiceCategory;
  nameZh: string; // 如: "循環伏安法測試 (CV)"
  nameEn: string;
  basePrice: number; // 基準單價 (TWD)
  unit: string; // 計價單位 (如: "樣品/點", "小時", "次")
  turnaroundDays: number; // 預估工作天
  description: string;
  requiresSampleType?: ('powder' | 'liquid' | 'electrode_sheet' | 'other')[]; // 接受樣品形態
  dependencies?: string[]; // 相依項目 ID (例如: 做 EIS 建議先勾選 CV 基準測試)
  minSamples: number; // 最少委託數量
  allowCustomParams: boolean; // 是否允許填寫客製化參數 (如電位窗口、掃速)
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
  categories: { id: ServiceCategory; nameZh: string; nameEn: string }[];
  items: ServiceItem[];
}
