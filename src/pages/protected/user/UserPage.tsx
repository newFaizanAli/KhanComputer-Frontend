import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import type { User } from "../../../types";
import { useUserStore } from "../../../store";
import UserForm from "../../../form/UserForm";
import { Modal, SuspenseWrap, DataTable } from "../../../components/page";
import { Button, Card } from "../../../components/ui";
import { PageHeader } from "../../../components/page";



const UserPage = () => {

    const [modal, setModal] = useState(false);
    const { users, fetchUsers, isFetched } = useUserStore()

    const defaultValues = {
        name: "",
        email: "",
        password: "",
        role: "subadmin"
    }

    const [userDefaults, setUserDefaults] = useState<User>(defaultValues as User)
    const [isEdit, setIsEdit] = useState(false)


    useEffect(() => {
        if (!isFetched) {
            fetchUsers()
        }
    }, [fetchUsers, isFetched])

    const handleEdit = (user: User) => {
        setUserDefaults(user)
        setIsEdit(true)
        setModal(true)
    }

    const handleClose = () => {
        setUserDefaults(defaultValues as User)
        setIsEdit(false)
        setModal(false)
    }

    return (
        <SuspenseWrap>
            <PageHeader title="User Management" subtitle="Manage your admin users here"
                actions={
                    <Button icon={Plus} onClick={() => setModal(true)}>Add User</Button>
                }
            />
            <Card>
                <DataTable
                    columns={[
                        {
                            key: "name", label: "Name", render: (v: string) => (
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">{v[0]}</div>
                                    <span className="text-white">{v}</span>
                                </div>
                            )
                        },
                        { key: "email", label: "Email", render: (v: string) => <span className="text-slate-400">{v}</span> },
                        { key: "role", label: "Role", render: (v: string) => <span className="text-slate-400">{v}</span> },
                    ]}
                    data={users}
                    onEdit={(r: User) => handleEdit(r)}
                    onDelete={(r: User) => alert("Delete: " + r.name)}
                    searchKeys={["name", "email"]}
                />
            </Card>

            <Modal open={modal} onClose={() => handleClose()} title={isEdit ? "Edit User" : "Add Admin User"}>
                <UserForm setModal={setModal} isEdit={isEdit} defaultValues={userDefaults} handleClose={handleClose} />
            </Modal>
        </SuspenseWrap>
    )
}

export default UserPage
