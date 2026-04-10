import { useCustomerStore, useQuotationStore } from "../../store"
import CombinedDocumentForm from "../combine/CombinedDocumentForm"


const CombinedQuotationForm = () => {
    const { addCombinedQuotation } = useQuotationStore()
    const { searchCustomerByName } = useCustomerStore()

    return (
        <CombinedDocumentForm
            variant="quotation"
            title="Quotation Details"
            submitLabel="Create Quotation"
            searchCustomerByName={searchCustomerByName}
            onSubmit={async (data) => {
                await addCombinedQuotation({
                    customerId: data.customerId,
                    date: data.date,
                    valid_until: data.valid_until as string,
                    discount: Number(data.discount),
                    gst: Number(data.gst),
                    notes: data.notes,
                    is_tax_inclusive: data.is_tax_inclusive || false,
                    items: data.items.map(i => ({ ...i, description: i.description || "", gst: i.gst ?? 0 })),
                })
            }}
        />
    )
}


export default CombinedQuotationForm