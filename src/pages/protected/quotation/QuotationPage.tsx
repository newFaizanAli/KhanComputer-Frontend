import { useEffect, useState } from 'react'
import { Plus, RefreshCcw } from 'lucide-react'
import { useNavigate } from "react-router-dom";
import { useQuotationStore } from '../../../store'
import type { Quotation } from '../../../types'
import { QuotationForm } from '../../../form'
import { Modal, SuspenseWrap, DataTable } from "../../../components/page";
import { Button, Card } from '../../../components/ui'
import { PageHeader } from '../../../components/page'
import { ROUTES_PATHS } from '../../../routes/routes_path';
import { calculateGrandTotal } from '../../../utilities/functions';
import { backendRoutes } from '../../../utilities/backend';
import DocumentPDFViewer from '../../../pdf/DocumentPDFViewer';



const QuotationPage = () => {
    const navigate = useNavigate()
    const [modal, setModal] = useState(false);
    const [previewId, setPreviewId] = useState<string | null>(null);
    const { fetchQuotations, deleteQuotation, isFetched, quotations } = useQuotationStore()

    const defualtValues: Quotation = {
        customerId: null,
        notes: "",
        gst: 0,
        discount: 0,
        date: new Date().toISOString().split("T")[0],
        valid_until: "",
        is_tax_inclusive: false
    }

    const [quotationDefaults, setQuotationDefaults] = useState<Quotation>(defualtValues as Quotation)
    const [isEdit, setIsEdit] = useState(false)

    const handleClose = () => {
        setQuotationDefaults(defualtValues as Quotation)
        setIsEdit(false)
        setModal(false)
    }


    const handleEdit = (quotation: Quotation) => {
        setQuotationDefaults(quotation)
        setIsEdit(true)
        setModal(true)
    }

    const handleDelete = (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this quotation?")
        if (confirm) {
            deleteQuotation(id)
        }
    }

    const handleQuotationItem = (data: Quotation) => {
        navigate(ROUTES_PATHS.DASHBOARD.QUOTATION.ITEM, {
            state: {
                quotationId: data?.id,
                quotationCode: data?.code
            }
        })
    }


    const handleViewQuotatation = (id: string) => {

        setPreviewId(id);
    }

    useEffect(() => {
        if (!isFetched) {
            fetchQuotations()
        }
    }, [fetchQuotations, isFetched])


    return (
        <SuspenseWrap>
            <PageHeader title="Quotations" subtitle="List of all orders"
                actions={
                    <div className="flex flex-wrap gap-2">
                        <Button icon={Plus} onClick={() => setModal(true)}>Add Quotation</Button>
                        <Button variant="outline" icon={RefreshCcw} onClick={fetchQuotations}>Refresh Quotations</Button>
                    </div>
                }
            />
            <Card>
                <DataTable
                    columns={[
                        { key: "code", label: "Code", render: (v: string) => <span className="text-slate-400">{v}</span> },
                        { key: 'customerName', label: 'Customer Name', render: (s: string) => <span className="text-slate-400">{s}</span> },
                        { key: 'date', label: 'Date', render: (v: Date) => <span className="text-slate-400">{new Date(v).toDateString()}</span> },
                        { key: 'valid_until', label: 'Valid Until', render: (v: Date) => <span className="text-slate-400">{new Date(v).toDateString() || "-"}</span> },
                        { key: 'gst', label: 'GST', render: (t: number) => <span className="text-slate-400">{t}%</span> },
                        { key: 'discount', label: 'Discount', render: (t: number) => <span className="text-slate-400">{t}%</span> },
                        { key: 'totalAmount', label: 'Total Amount', render: (t: number) => <span className="text-slate-400"> ₨ {t}</span> },
                        {
                            key: 'grandTotal',
                            label: 'Grand Total',
                            render: (_: string, row: Quotation) => (
                                <span className="text-slate-400">
                                    ₨ {calculateGrandTotal(row.totalAmount as number, row.gst, row.discount /*, discount if any */)}
                                </span>
                            )
                        },
                        {
                            key: "actions", // or "saleItems" but better to use "actions"
                            label: "Quotation Items",
                            render: (_: string, row: Quotation) => (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => handleQuotationItem(row)}
                                >
                                    View Items
                                </Button>
                            )
                        },

                    ]}
                    data={quotations}
                    onEdit={(r: Quotation) => handleEdit(r)}
                    onDelete={(r: Quotation) => handleDelete(r?.id as string)}
                    onView={(r: Quotation) => handleViewQuotatation(r?.id as string)}
                    searchKeys={["code"]}
                />
            </Card>

            {previewId && (
                <DocumentPDFViewer
                    id={previewId}
                    variant="quotation"
                    previewUrl={backendRoutes.quotations.root}
                    onClose={() => setPreviewId(null)}
                />
            )}

            <Modal open={modal} onClose={() => handleClose()} title={isEdit ? "Edit Quotation" : "Add Quotation"}>
                <QuotationForm setModal={setModal} isEdit={isEdit} defaultValues={quotationDefaults as Quotation} handleClose={handleClose} />
            </Modal>
        </SuspenseWrap>
    )
}

export default QuotationPage

