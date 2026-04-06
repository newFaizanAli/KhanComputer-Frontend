import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import type { LetterHead } from '../../../types'
import { useLetterHeadStore } from '../../../store'
import { backendRoutes } from '../../../utilities/backend'
import { ROUTES_PATHS } from '../../../routes/routes_path'
import { SuspenseWrap, DataTable } from '../../../components/page'
import { Button, Card } from '../../../components/ui'
import { PageHeader } from '../../../components/page'
import LetterheadPDFViewer from '../../../pdf/LetterheadPDFViewer'



const LetterHeadListPage = () => {
    const navigate = useNavigate();
    const [previewId, setPreviewId] = useState<string | null>(null);
    const { fetchLetterHeads, deleteLetterHead, isFetched, letter_heads } = useLetterHeadStore()


    const handleAdd = () => {
        navigate(ROUTES_PATHS.DASHBOARD.STORE.LETTER_HEAD.FORM, {
            state: {
                value: {
                    name: "",
                    header_text: "",
                    footer_text: "",
                    default_body: "",
                    notes: "",
                    issue_date: new Date().toISOString().split("T")[0],
                },
                isEdit: false,
            }
        })
    }


    const handleEdit = (sup: LetterHead) => {

        navigate(ROUTES_PATHS.DASHBOARD.STORE.LETTER_HEAD.FORM, {
            state: {
                values: sup,
                isEdit: true,
            }
        })
    }


    const handleDelete = (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this letter head?")
        if (confirm) {
            deleteLetterHead(id)
        }
    }

    const handleViewLetterHead = (id: string) => {
        setPreviewId(id);
    }

    useEffect(() => {
        if (!isFetched) {
            fetchLetterHeads()
        }
    }, [fetchLetterHeads, isFetched])


    return (
        <SuspenseWrap>
            <PageHeader title="Letter Heads" subtitle="List of all Letter Heads"
                actions={
                    <Button icon={Plus} onClick={() => handleAdd()}>Add Letter Head</Button>
                }
            />
            <Card>
                <DataTable
                    columns={[
                        { key: "code", label: "Code", render: (v: string) => <span className="text-slate-400">{v || "-"}</span> },
                        { key: "name", label: "Name", render: (v: string) => <span className="text-slate-400">{v || "-"}</span> },
                        { key: "header_text", label: "Header Text", render: (v: string) => <span className="text-slate-400">{v || "-"}</span> },
                        { key: "issued_at", label: "Issued Date", render: (v: string) => v ? new Date(v).toLocaleDateString() : "-" },
                    ]}
                    data={letter_heads}
                    onEdit={(r: LetterHead) => handleEdit(r)}
                    onDelete={(r: LetterHead) => handleDelete(r.id || '')}
                    onView={(r: LetterHead) => handleViewLetterHead(r?.id as string)}
                    searchKeys={["code", "name"]}
                />
            </Card>

            {previewId && (
                <LetterheadPDFViewer
                    id={previewId}
                    previewUrl={backendRoutes.store.letter_head}
                    onClose={() => setPreviewId(null)}
                />
            )}

        </SuspenseWrap>
    )
}

export default LetterHeadListPage
