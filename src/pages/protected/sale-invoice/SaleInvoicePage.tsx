import { useEffect, useState } from 'react'
import { Plus, RefreshCcw } from 'lucide-react'
import { useNavigate } from "react-router-dom";
import { useSaleInvoiceStore } from '../../../store'
import type { SaleInvoice } from '../../../types'
import { ROUTES_PATHS } from '../../../routes/routes_path';
import { calculateGrandTotal } from '../../../utilities/functions';
import { backendRoutes } from '../../../utilities/backend';
import DocumentPDFViewer from '../../../pdf/DocumentPDFViewer';
import { SaleInvoiceForm } from '../../../form'
import { Modal, SuspenseWrap, DataTable } from "../../../components/page";
import { Button, Card } from '../../../components/ui'
import { PageHeader } from '../../../components/page'



const SaleInvoicePage = () => {
    const navigate = useNavigate()
    const [modal, setModal] = useState(false);
    const [previewId, setPreviewId] = useState<string | null>(null);
    const { fetchSaleInvoices, deleteSaleInvoice, isFetched, sale_invoices } = useSaleInvoiceStore()

    const defualtValues: SaleInvoice = {
        customerId: null,
        notes: "",
        gst: 0,
        discount: 0,
        date: new Date().toISOString().split("T")[0],
        order_reference_no: "",
        is_tax_inclusive: false,
        payment_method: '',
        payment_status: '',
        payment_reference: '',
    }

    const [invoiceDefaults, setInvoiceDefaults] = useState<SaleInvoice>(defualtValues as SaleInvoice)
    const [isEdit, setIsEdit] = useState(false)

    const handleClose = () => {
        setInvoiceDefaults(defualtValues as SaleInvoice)
        setIsEdit(false)
        setModal(false)
    }


    const handleEdit = (invioce: SaleInvoice) => {
        setInvoiceDefaults(invioce)
        setIsEdit(true)
        setModal(true)
    }

    const handleDelete = (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this invice?")
        if (confirm) {
            deleteSaleInvoice(id)
        }
    }

    const handleInvoiceItem = (data: SaleInvoice) => {
        navigate(ROUTES_PATHS.DASHBOARD.SALE_INVOICE.ITEM, {
            state: {
                saleInvoiceId: data?.id,
                saleInvoiceCode: data?.code
            }
        })
    }

    const handleViewInvoice = (id: string) => {
        setPreviewId(id);
    }


    useEffect(() => {
        if (!isFetched) {
            fetchSaleInvoices()
        }
    }, [fetchSaleInvoices, isFetched])


    return (
        <SuspenseWrap>
            <PageHeader title="Sale Invoices" subtitle="List of all invoices"
                actions={
                    <div className="flex flex-wrap gap-2">
                        <Button icon={Plus} onClick={() => setModal(true)}>Add Sale Invoice</Button>
                        <Button variant="outline" icon={RefreshCcw} onClick={fetchSaleInvoices}>Refresh Invoices</Button>
                    </div>
                }
            />
            <Card>
                <DataTable
                    columns={[
                        { key: "code", label: "Code", render: (v: string) => <span className="text-slate-400">{v}</span> },
                        { key: "quotationCode", label: "Quotation Code", render: (v: string) => <span className="text-slate-400">{v || "-"}</span> },
                        { key: 'customerName', label: 'Customer Name', render: (s: string) => <span className="text-slate-400">{s}</span> },
                        { key: 'date', label: 'Date', render: (v: Date) => <span className="text-slate-400">{new Date(v).toDateString()}</span> },
                        { key: 'order_reference_no', label: 'Order Reference No', render: (v: string) => <span className="text-slate-400">{v || "N/A"}</span> },
                        { key: 'gst', label: 'GST', render: (t: number) => <span className="text-slate-400">{t}%</span> },
                        { key: 'discount', label: 'Discount', render: (t: number) => <span className="text-slate-400">{t}%</span> },
                        { key: 'totalAmount', label: 'Total Amount', render: (t: number) => <span className="text-slate-400"> ₨ {t}</span> },
                        {
                            key: 'grandTotal',
                            label: 'Grand Total',
                            render: (_: string, row: SaleInvoice) => (
                                <span className="text-slate-400">
                                    ₨ {calculateGrandTotal(row.totalAmount as number, row.gst, row.discount /*, discount if any */)}
                                </span>
                            )
                        },
                        {
                            key: "actions", // or "saleItems" but better to use "actions"
                            label: "Sale Items",
                            render: (_: string, row: SaleInvoice) => (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => handleInvoiceItem(row)}
                                >
                                    View Items
                                </Button>
                            )
                        },

                    ]}
                    data={sale_invoices}
                    onEdit={(r: SaleInvoice) => handleEdit(r)}
                    onDelete={(r: SaleInvoice) => handleDelete(r?.id as string)}
                    onView={(r: SaleInvoice) => handleViewInvoice(r?.id as string)}
                    searchKeys={["code"]}
                />
            </Card>

            {previewId && (
                <DocumentPDFViewer
                    id={previewId}
                    variant="invoice"
                    previewUrl={backendRoutes.sale_invoices.root}
                    onClose={() => setPreviewId(null)}
                />
            )}

            <Modal open={modal} onClose={() => handleClose()} title={isEdit ? "Edit Invoice" : "Add Invoice"}>
                <SaleInvoiceForm setModal={setModal} isEdit={isEdit}
                    defaultValues={invoiceDefaults as SaleInvoice}
                    handleClose={handleClose} />
            </Modal>
        </SuspenseWrap>
    )
}

export default SaleInvoicePage

