import { useCustomerStore, useQuotationStore, useSaleInvoiceStore } from "../../store"
import CombinedDocumentForm from "../combine/CombinedDocumentForm"

// CombinedSaleInvoiceForm.tsx
const CombinedSaleInvoiceForm = () => {
    const { addCombinedSaleInvoice } = useSaleInvoiceStore()
    const { searchCustomerByName } = useCustomerStore()
    const { searchQuotationByCode } = useQuotationStore()

    return (
        <CombinedDocumentForm
            title="Sale Invoice Details"
            submitLabel="Create Sale Invoice"
            searchCustomerByName={searchCustomerByName}
            extraFields={[
                {
                    type: 'search', name: 'quotationId', label: 'Quotation (optional)',
                    placeholder: 'Search quotation...', onSearch: searchQuotationByCode,
                    linkedLabelField: 'quotationCode',
                },
                { type: 'text', name: 'order_reference_no', label: 'Order Reference No.', placeholder: 'Order reference number' },
            ]}
            onSubmit={async (data) => {
                await addCombinedSaleInvoice({
                    customerId: data.customerId,
                    quotationId: data.quotationId || null,
                    date: data.date,
                    order_reference_no: data.order_reference_no || '',
                    discount: Number(data.discount),
                    gst: Number(data.gst),
                    notes: data.notes,
                    items: data.items.map(i => ({ ...i, description: i.description || "" })),
                })
            }}
        />
    )
}

export default CombinedSaleInvoiceForm