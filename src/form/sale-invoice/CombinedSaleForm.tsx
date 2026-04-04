import { PAYMENT_METHODS, PAYMENT_STATUS } from "../../constants"
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
                {
                    type: 'select',
                    name: 'payment_method',
                    label: 'Payment Method',
                    options: [
                        { value: '', label: 'Select payment method' },
                        ...PAYMENT_METHODS
                    ],
                },
                {
                    type: 'text',
                    name: 'payment_reference',
                    label: 'Payment Reference',
                    placeholder: 'Transaction ID / Ref No',
                },
                {
                    type: 'select',
                    name: 'payment_status',
                    label: 'Payment Status',
                    options: [
                        { value: '', label: 'Select payment status' }, ...PAYMENT_STATUS
                    ],
                },

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
                    payment_method: data.payment_method || '',
                    payment_reference: data.payment_reference || '',
                    payment_status: data.payment_status || '',
                    is_tax_inclusive: data.is_tax_inclusive || false,
                    items: data.items.map(i => ({ ...i, description: i.description || "" })),
                })
            }}
        />
    )
}

export default CombinedSaleInvoiceForm