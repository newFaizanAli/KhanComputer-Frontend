import { useEffect, useState } from 'react'
import type { GeneralSaleInvoiceData } from '../../types'
import CombinedDocumentForm from '../combine/CombinedDocumentForm'
import { SuspenseWrap } from '../../components/page'
import DocumentPDFViewer from '../../pdf/DocumentPDFViewer'
import { useStoreInfo } from '../../store'

const CombinedGeneralInvoice = () => {
    const [previewData, setPreviewData] = useState<GeneralSaleInvoiceData | null>(null)


    const { store, isFetched, fetchStore } = useStoreInfo()


    useEffect(() => {
        if (!isFetched) {
            fetchStore()
        }
    }, [fetchStore, isFetched])


    return (
        <SuspenseWrap>
            <CombinedDocumentForm
                variant="general-sale-invoice"
                title="General Sale Invoice"
                submitLabel="Create Sale"
                onSubmit={async (data) => {
                    setPreviewData({
                        customerId: null,
                        customerName: data.customerName,
                        customerPhno: data.customerPhno || '',
                        date: data.date,
                        discount: Number(data.discount),
                        notes: data.notes,
                        order_reference_no: data.order_reference_no || '',
                        payment_method: data.payment_method || '',
                        payment_reference: data.payment_reference || '',
                        items: data.items.map(i => ({ ...i, description: i.description || '' })),
                    })
                }}
            />

            {previewData && (
                <DocumentPDFViewer
                    variant="general-invoice"
                    data={previewData}
                    store={store}        // your existing store object from context/state
                    onClose={() => setPreviewData(null)}
                />
            )}

        </SuspenseWrap>
    )



}

export default CombinedGeneralInvoice
