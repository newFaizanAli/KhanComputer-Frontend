import { useCustomerStore, useQuotationStore, useSaleInvoiceStore } from "../../store"
import CombinedDocumentForm from "../combine/CombinedDocumentForm"

// CombinedSaleInvoiceForm.tsx
const CombinedSaleInvoiceForm = () => {
    const { addCombinedSaleInvoice } = useSaleInvoiceStore()
    const { searchCustomerByName } = useCustomerStore()
    const { searchQuotationByCode } = useQuotationStore()

    return (
        <CombinedDocumentForm
            variant="sale-invoice"
            title="Sale Invoice Details"
            submitLabel="Create Sale Invoice"
            searchCustomerByName={searchCustomerByName}
            searchQuotationByCode={searchQuotationByCode}
            onSubmit={async (data) => {
                await addCombinedSaleInvoice({
                    customerId: data.customerId,
                    quotationId: data.quotationId || null,
                    date: data.date,
                    order_reference_no: data.order_reference_no || '',
                    discount: Number(data.discount),
                    gst: Number(data.gst),
                    notes: data.notes,
                    payment_method: data.payment_method || '',
                    payment_reference: data.payment_reference || '',
                    payment_status: data.payment_status || '',
                    is_tax_inclusive: data.is_tax_inclusive || false,
                    items: data.items.map(i => ({ ...i, description: i.description || "", gst: i.gst ?? 0 })),
                })
            }}
        />
    )
}

export default CombinedSaleInvoiceForm