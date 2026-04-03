import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FileText, Mail, Phone, User2Icon, Hash, MapPin } from "lucide-react";
import type { StoreInfo } from "../types";
import { useStoreInfo } from "../store";
import { FormInput, FormTextarea } from "../components/form";
import { Button } from "../components/ui";



const StoreForm = () => {

    const { store, addStore, updateStore, fetchStore, isFetched } = useStoreInfo();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: store || {},
    });

    useEffect(() => {
        if (!isFetched) {
            fetchStore()
        }
    }, [fetchStore, isFetched]);

    useEffect(() => {
        reset(store || {});
    }, [store, reset]);

    const onSubmit = async (data: StoreInfo) => {
        if (store?.id) {
            await updateStore(store.id, data);
        } else {
            await addStore(data);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Store Name"
                    placeholder="Enter Store name"
                    icon={User2Icon}
                    name="name"
                    register={register}
                    rules={{ required: "Name required" }}
                    error={errors.name?.message}
                />
                <FormInput
                    label="Email"
                    placeholder="Enter store email"
                    icon={Mail}
                    name="email"
                    register={register}
                    error={errors.email?.message}
                />
                <FormInput
                    label="Phone"
                    placeholder="Enter store phone"
                    icon={Phone}
                    name="phone"
                    register={register}
                    error={errors.phone?.message}
                />
                <FormInput
                    label="NTN No"
                    placeholder="Enter NTN no"
                    icon={Hash}
                    name="ntn"
                    register={register}
                    error={errors.ntn?.message}
                />
                <FormInput
                    label="GST No"
                    placeholder="Enter GST no"
                    icon={FileText}
                    name="gst_no"
                    register={register}
                    error={errors.gst_no?.message}
                />
                <div className="md:col-span-2">
                    <FormTextarea
                        label="Address"
                        placeholder="Enter address"
                        icon={MapPin}
                        rows={2}
                        name="address"
                        register={register}
                        error={errors.address?.message}
                    />
                </div>
                <div className="md:col-span-2">
                    <FormTextarea
                        label="Quotation  Notes"
                        placeholder="Default notes for quotation"
                        icon={FileText}
                        rows={5}
                        name="quotation_notes"
                        register={register}
                        error={errors.quotation_notes?.message}
                    />
                </div>
                <div className="md:col-span-2">
                    <FormTextarea
                        label="Sale invoice Notes"
                        placeholder="Default notes for sale invoice"
                        icon={FileText}
                        rows={5}
                        name="sale_invoice_notes"
                        register={register}
                        error={errors.sale_invoice_notes?.message}
                    />
                </div>
                <div className="md:col-span-2">
                    <FormTextarea
                        label="General Notes"
                        placeholder="Default notes for invoices"
                        icon={FileText}
                        rows={5}
                        name="notes"
                        register={register}
                        error={errors.notes?.message}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">

                <Button type="submit" icon={User2Icon}>
                    {store?.id ? "Update Store" : "Add Store"}
                </Button>
            </div>
        </form>
    )
}

export default StoreForm
