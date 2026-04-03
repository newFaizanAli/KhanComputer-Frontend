import { useEffect } from 'react';
import { Lock, Mail, UserCheck, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { User } from '../types';
import { useUserStore } from '../store';
import { FormInput } from '../components/form';
import { Button } from '../components/ui';



interface UserFormProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    defaultValues: User;
    handleClose: () => void
}

const UserForm = ({ setModal, isEdit, defaultValues, handleClose }: UserFormProps) => {

    const { addUser, editUser } = useUserStore()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: defaultValues
    });

    const onSubmit = (data: User) => {
        if (isEdit) {
            editUser(defaultValues?.id as string, data)
            handleClose()
        } else {
            const userData = { ...data }
            addUser(userData);
            reset();
            setModal(false);
        }

    };

    useEffect(() => {
        if (isEdit) {

            reset(defaultValues)
        }
    }, [defaultValues, reset, isEdit])


    return (

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput label="Full Name" placeholder="John Doe" icon={Users} name="name" register={register} rules={{ required: "Name required" }} error={errors.name?.message} />
            <FormInput label="Email" placeholder="user@kcn.io" icon={Mail} type="email" name="email" register={register}
                rules={{ required: "Email required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } }} error={errors.email?.message} />

            {
                !isEdit &&
                <FormInput label="Password" placeholder="Min 8 characters" type="text" icon={Lock} name="password" register={register}
                    rules={{ required: "Password required", minLength: { value: 8, message: "Min 8 characters" } }} error={errors.password?.message} />

            }

            <div className="flex justify-end gap-2 pt-1">
                <Button variant="secondary" type="button" onClick={() => handleClose()}>Cancel</Button>
                <Button type="submit" icon={UserCheck}>{isEdit ? "Update User" : "Create User"}</Button>
            </div>
        </form>

    )
}

export default UserForm
