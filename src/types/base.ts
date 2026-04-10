// Common base interfaces
interface BaseDocument {
  id?: string;
  code?: string;
  notes: string;
  date: string;
  discount: number;
  totalAmount?: number;
  customerName?: string;
  is_tax_inclusive?: boolean;
  customerId: string | null;
}

interface BaseItem {
  id?: string;
  uom: string;
  description: string;
  quantity: number;
  price: number;
  discount: number;
  notes: string;
  total: number;
}

// Specific extensions
export interface SaleInvoice extends BaseDocument {
  order_reference_no: string;
  payment_method: string;
  payment_reference: string;
  payment_status: string;
  is_tax_inclusive: boolean;
  quotationId?: string;
  quotationCode?: string | null;
  gst: number;
}

export interface SaleInvoiceItem extends BaseItem {
  saleInvoiceId?: string;
  saleInvoiceCode?: string;
  gst: number;
}

export interface Quotation extends BaseDocument {
  valid_until: string;
  is_tax_inclusive: boolean;
  gst: number;
}

export interface QuotationItem extends BaseItem {
  quotationId?: string;
  quotationCode?: string;
  gst: number;
}

export interface GeneralSaleInvoice extends BaseDocument {
  order_reference_no: string;
  payment_method: string;
  payment_reference: string;
  customerPhno: string;
}

export interface GeneralSaleInvoiceData {
  customerId: null;
  customerName: string;
  customerPhno?: string;
  date: string;
  discount: number;
  notes: string;
  order_reference_no?: string;
  payment_method?: string;
  payment_reference?: string;
  items: BaseItem[];
}
