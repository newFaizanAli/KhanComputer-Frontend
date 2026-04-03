import { useEffect } from 'react';
import { FileText, Mail, Phone, User2Icon, UserRound, Hash, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { Customer } from '../../types';
import { useCustomerStore } from '../../store';
import { Button } from '../../components/ui';
import { FormInput, FormTextarea } from '../../components/form';


interface CustomerFormProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    defaultValues: Customer;
    handleClose: () => void
}
const CustomerForm = ({ setModal, isEdit, defaultValues, handleClose }: CustomerFormProps) => {

    const { addCustomer, editCustomer } = useCustomerStore()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: defaultValues
    });

    useEffect(() => {
        if (isEdit) {

            reset(defaultValues)
        }
    }, [defaultValues, reset, isEdit])

    const onSubmit = (data: Customer) => {
        if (isEdit) {
            editCustomer(defaultValues.id as string, data)
            handleClose()
        } else {
            addCustomer(data);
            reset();
            setModal(false);
        }
    };

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Grid container: 2 columns on md+, 1 column on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <FormInput
                    label="Customer Name"
                    placeholder="Enter customer name"
                    icon={UserRound}
                    name="name"
                    register={register}
                    rules={{ required: "Name required" }}
                    error={errors.name?.message}
                />

                <FormInput
                    label="Customer Email"
                    placeholder="Enter customer email"
                    icon={Mail}
                    name="email"
                    register={register}
                    error={errors.email?.message}
                />

                <FormInput
                    label="Customer Phone"
                    placeholder="Enter customer phone"
                    icon={Phone}
                    name="phone"
                    register={register}
                    error={errors.phone?.message}
                />

                <FormInput
                    label="Customer NTN No"
                    placeholder="Enter customer NTN no"
                    icon={Hash}
                    name="ntn"
                    register={register}
                    error={errors.ntn?.message}
                />

                <FormInput
                    label="Customer GST No"
                    placeholder="Enter customer GST no"
                    icon={FileText}
                    name="gst"
                    register={register}
                    error={errors.gst?.message}
                />

                {/* Textarea spans full width on both mobile & desktop */}
                <div className="md:col-span-2">
                    <FormTextarea
                        label="Address"
                        placeholder="Enter address"
                        icon={MapPin}
                        name="address"
                        register={register}
                        error={errors.address?.message}
                    />
                </div>

            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-1">
                <Button variant="secondary" type="button" onClick={() => handleClose()}>
                    Cancel
                </Button>
                <Button type="submit" icon={User2Icon}>
                    {isEdit ? "Update Customer" : "Create Customer"}
                </Button>
            </div>

        </form>

    )
}

export default CustomerForm
