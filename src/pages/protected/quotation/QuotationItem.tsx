import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate, useLocation } from "react-router-dom"
import { useQuotationItemStore } from '../../../store'
import type { QuotationItem } from '../../../types'
import { QuotationItemForm } from '../../../form'
import { ROUTES_PATHS } from '../../../routes/routes_path'
import { calculateGrandTotal } from '../../../utilities/functions'
import { Modal, SuspenseWrap, DataTable } from '../../../components/page'
import { Button, Card } from '../../../components/ui'
import { PageHeader } from '../../../components/page'


const QuotationItemPage = () => {
    const [modal, setModal] = useState(false);
    const navigate = useNavigate()
    const location = useLocation()
    const { quotationId, quotationCode } = location.state || {}


    const { fetchQuotationItemByQId, deleteQuotationItem, quotation_items } = useQuotationItemStore()



    const [itemsData, setItemsData] = useState<QuotationItem[]>([])

    const defualtValues = {
        description: "",
        quotationId: quotationId,
        uom: "",
        quantity: 1,
        price: 1,
        gst: 0,
        discount: 0,
        total: 0,
        notes: "",
    }

    const [itemDefaults, setItemDefaults] = useState<QuotationItem>(defualtValues as QuotationItem)
    const [isEdit, setIsEdit] = useState(false)

    const handleClose = () => {
        setItemDefaults(defualtValues as QuotationItem)
        setIsEdit(false)
        setModal(false)
    }

    const handleEdit = (order: QuotationItem) => {
        setItemDefaults(order)
        setIsEdit(true)
        setModal(true)
    }

    const handleDelete = (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this quotation item?")
        if (confirm) {
            deleteQuotationItem(id)
        }
    }


    useEffect(() => {
        const fetchData = async () => {
            const resp = await fetchQuotationItemByQId(quotationId)
            setItemsData(resp || [])
        }

        if (quotationId) {
            fetchData()
        } else {
            navigate(ROUTES_PATHS.DASHBOARD.QUOTATION.ROOT)
        }
    }, [fetchQuotationItemByQId, quotationId, navigate, quotationCode, quotation_items])


    return (
        <SuspenseWrap>
            <PageHeader title={`Quotation Items - Quotation ${quotationCode || "N/A"}`} subtitle="List of all quotation items"
                actions={
                    <Button icon={Plus} onClick={() => setModal(true)}>Add Quotation Item</Button>
                }
            />
            <Card>
                <DataTable
                    columns={[
                        { key: 'description', label: 'Item', render: (p: string) => <span className="text-slate-400">{p}</span> },
                        { key: 'quantity', label: 'Quantity', render: (q: number) => <span className="text-slate-400">{q}</span> },
                        { key: 'uom', label: 'UOM', render: (u: string) => <span className="text-slate-400">{u}</span> },
                        { key: 'price', label: 'Price', render: (u: number) => <span className="text-slate-400">₨ {u}</span> },
                        { key: 'gst', label: 'GST', render: (u: number) => <span className="text-slate-400">₨ {u}</span> },
                        { key: 'discount', label: 'Discount', render: (u: number) => <span className="text-slate-400">₨ {u}</span> },
                        { key: 'total', label: 'Total', render: (t: number) => <span className="text-slate-400">₨ {t}</span> },
                        {
                            key: 'grandTotal',
                            label: 'Grand Total',
                            render: (_: string, row: QuotationItem) => (
                                <span className="text-slate-400">
                                    ₨ {calculateGrandTotal(row.total as number, row.gst, row.discount /*, discount if any */)}
                                </span>
                            )
                        },
                    ]}
                    data={itemsData}
                    onEdit={(r: QuotationItem) => handleEdit(r)}
                    onDelete={(r: QuotationItem) => handleDelete(r?.id as string)}
                    searchKeys={["description"]}
                />
            </Card>
            <Modal open={modal} onClose={() => handleClose()} title={isEdit ? "Edit Quotation Item" : "Add Quotation Item"}>
                <QuotationItemForm setModal={setModal} isEdit={isEdit} defaultValues={itemDefaults as QuotationItem} handleClose={handleClose} />
            </Modal>
        </SuspenseWrap>
    )
}

export default QuotationItemPage



