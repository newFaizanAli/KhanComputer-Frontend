import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate, useLocation } from "react-router-dom"
import { useSaleInvoiceItemStore } from '../../../store'
import type { SaleInvoiceItem } from '../../../types'
import { SaleInvoiceItemForm } from '../../../form'
import { ROUTES_PATHS } from '../../../routes/routes_path'
import { calculateGrandTotal } from '../../../utilities/functions'
import { Modal, SuspenseWrap, DataTable } from '../../../components/page'
import { Button, Card } from '../../../components/ui'
import { PageHeader } from '../../../components/page'


const SaleInvoiceItemPage = () => {
    const [modal, setModal] = useState(false);
    const navigate = useNavigate()
    const location = useLocation()
    const { saleInvoiceId, saleInvoiceCode } = location.state || {}


    const { fetchSaleInvoiceItemBySId, deleteSaleInvoiceItem, sale_invoice_items } = useSaleInvoiceItemStore()



    const [itemsData, setItemsData] = useState<SaleInvoiceItem[]>([])

    const defualtValues = {
        description: "",
        saleInvoiceId: saleInvoiceId,
        uom: "",
        quantity: 1,
        price: 1,
        gst: 0,
        discount: 0,
        total: 0,
        notes: "",
    }

    const [itemDefaults, setItemDefaults] = useState<SaleInvoiceItem>(defualtValues as SaleInvoiceItem)
    const [isEdit, setIsEdit] = useState(false)

    const handleClose = () => {
        setItemDefaults(defualtValues as SaleInvoiceItem)
        setIsEdit(false)
        setModal(false)
    }

    const handleEdit = (order: SaleInvoiceItem) => {
        setItemDefaults(order)
        setIsEdit(true)
        setModal(true)
    }

    const handleDelete = (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this sale invoice item?")
        if (confirm) {
            deleteSaleInvoiceItem(id)
        }
    }


    useEffect(() => {
        const fetchData = async () => {
            const resp = await fetchSaleInvoiceItemBySId(saleInvoiceId)
            setItemsData(resp || [])
        }

        if (saleInvoiceId) {
            fetchData()
        } else {
            navigate(ROUTES_PATHS.DASHBOARD.QUOTATION.ROOT)
        }
    }, [fetchSaleInvoiceItemBySId, saleInvoiceId, navigate, saleInvoiceCode, sale_invoice_items])


    return (
        <SuspenseWrap>
            <PageHeader title={`Sale Invoice Items - ${saleInvoiceCode || "N/A"}`} subtitle="List of all sale items"
                actions={
                    <Button icon={Plus} onClick={() => setModal(true)}>Add Sale Item</Button>
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
                            render: (_: string, row: SaleInvoiceItem) => (
                                <span className="text-slate-400">
                                    ₨ {calculateGrandTotal(row.total as number, row.gst, row.discount /*, discount if any */)}
                                </span>
                            )
                        },
                    ]}
                    data={itemsData}
                    onEdit={(r: SaleInvoiceItem) => handleEdit(r)}
                    onDelete={(r: SaleInvoiceItem) => handleDelete(r?.id as string)}
                    searchKeys={["description"]}
                />
            </Card>
            <Modal open={modal} onClose={() => handleClose()} title={isEdit ? "Edit Sale Item" : "Add Sale Item"}>
                <SaleInvoiceItemForm setModal={setModal} isEdit={isEdit} defaultValues={itemDefaults as SaleInvoiceItem} handleClose={handleClose} />
            </Modal>
        </SuspenseWrap>
    )
}

export default SaleInvoiceItemPage



