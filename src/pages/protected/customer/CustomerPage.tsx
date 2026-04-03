import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import type { Customer } from '../../../types'
import { useCustomerStore } from '../../../store'
import { CustomerForm } from '../../../form'
import { Modal, SuspenseWrap, DataTable } from '../../../components/page'
import { Button, Card } from '../../../components/ui'
import { PageHeader } from '../../../components/page'


const CustomerPage = () => {
    const [modal, setModal] = useState(false);
    const { fetchCustomers, deleteCustomer, isFetched, customers } = useCustomerStore()

    const defualtValues = {
        name: "",
        email: "",
        phone: "",
        address: "",
        gst: "",
        ntn: ""
    }

    const [customerDefaults, setCustomerDefaults] = useState<Customer>(defualtValues)
    const [isEdit, setIsEdit] = useState(false)

    const handleClose = () => {
        setCustomerDefaults(defualtValues)
        setIsEdit(false)
        setModal(false)
    }

    const handleEdit = (sup: Customer) => {
        setCustomerDefaults(sup)
        setIsEdit(true)
        setModal(true)
    }

    const handleDelete = (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this customer?")
        if (confirm) {
            deleteCustomer(id)
        }
    }


    useEffect(() => {
        if (!isFetched) {
            fetchCustomers()
        }
    }, [fetchCustomers, isFetched])


    return (
        <SuspenseWrap>
            <PageHeader title="Customers" subtitle="List of all customer"
                actions={
                    <Button icon={Plus} onClick={() => setModal(true)}>Add Customer</Button>
                }
            />
            <Card>
                <DataTable
                    columns={[
                        { key: "name", label: "Name", render: (v: string) => <span className="text-slate-400">{v}</span> },
                        { key: "email", label: "Email", render: (v: string) => <span className="text-slate-400">{v}</span> },
                        { key: "phone", label: "Phone", render: (v: string) => <span className="text-slate-400">{v}</span> },
                    ]}
                    data={customers}
                    onEdit={(r: Customer) => handleEdit(r)}
                    onDelete={(r: Customer) => handleDelete(r.id || '')}
                    searchKeys={["name", "email"]}
                />
            </Card>
            <Modal open={modal} onClose={() => handleClose()} title={isEdit ? "Edit Customer" : "Add Customer"}>
                <CustomerForm setModal={setModal} isEdit={isEdit}
                    defaultValues={customerDefaults} handleClose={handleClose} />
            </Modal>
        </SuspenseWrap>
    )
}

export default CustomerPage
