import { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import {
    Calendar, FileCheck2, FileText, Hash, Percent,
    User
} from 'lucide-react';
import type { SaleInvoice } from "../../types";
import { useSaleInvoiceStore, useCustomerStore, useQuotationStore } from '../../store';
import { FormInput, FormSearchSelect, FormTextarea } from '../../components/form';
import { Button } from '../../components/ui';


interface InvoiceProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    defaultValues: SaleInvoice
    handleClose: () => void
}

const SaleInvoiceForm = ({ setModal, isEdit, defaultValues, handleClose }: InvoiceProps) => {

    const { addSaleInvioce, editSaleInvioce } = useSaleInvoiceStore()
    const { searchCustomerByName } = useCustomerStore()
    const { searchQuotationByCode } = useQuotationStore()


    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm({
        defaultValues: defaultValues
    });


    useEffect(() => {
        if (defaultValues) {
            const formattedValues = {
                ...defaultValues,
                date: defaultValues.date
                    ? defaultValues.date.split("T")[0]
                    : ""
            }
            reset(formattedValues);
        }
    }, [defaultValues, reset]);



    const onSubmit = async (data: SaleInvoice) => {
        if (isEdit) {
            await editSaleInvioce(defaultValues?.id as string, data)
            handleClose()
        } else {
            await addSaleInvioce(data);
            reset();
            setModal(false);
        }
    };



    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <FormSearchSelect<SaleInvoice>
                label="Customer"
                placeholder="Search customer..."
                icon={User}
                name="customerId"
                register={register}
                rules={{ required: "Customer required" }}
                value={
                    defaultValues?.customerId
                        ? {
                            value: defaultValues.customerId,
                            label: defaultValues.customerName || "",
                        }
                        : null
                }
                onSearch={searchCustomerByName}
                onChange={(opt) => {
                    setValue("customerId", opt.value);
                }}
                error={errors.customerId?.message}
            />

            <FormSearchSelect<SaleInvoice>
                label="Quotation (Optional)"
                placeholder="Search quotation..."
                icon={FileCheck2}
                name="quotationId"
                register={register}

                value={
                    defaultValues?.quotationId
                        ? {
                            value: defaultValues.quotationId,
                            label: defaultValues.quotationCode || "",
                        }
                        : null
                }
                onSearch={searchQuotationByCode}
                onChange={(opt) => {
                    setValue("quotationId", opt.value);
                }}
                error={errors.quotationId?.message}
            />


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <FormInput
                    type='number'
                    label="GST"
                    placeholder="Enter GST"
                    icon={Percent}
                    name="gst"
                    min={0}
                    max={100}
                    register={register}
                />

                <FormInput
                    type='number'
                    label="Discount"
                    placeholder="Enter discount"
                    icon={Percent}
                    name="discount"
                    min={0}
                    max={100}
                    register={register}
                />

                <FormInput
                    type="date"
                    label="Date"
                    placeholder="Enter date"
                    icon={Calendar}
                    name="date"
                    register={register}
                    rules={{ required: "Date required" }}
                    error={errors.date?.message}
                />

                <FormInput
                    type="text"
                    label="Order Reference No."
                    placeholder=" Enter order reference no."
                    icon={Hash}
                    name="order_reference_no"
                    register={register}
                />

            </div>


            <FormTextarea
                label="Notes / Remarks"
                placeholder="Any notes / remarks ..."
                icon={FileText}
                rows={4}
                name="notes"
                register={register}
            />

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-1">
                <Button variant="secondary" type="button" onClick={handleClose}>
                    Cancel
                </Button>
                <Button type="submit" icon={FileCheck2}>
                    {isEdit ? "Update Quotation" : "Create Quotation"}
                </Button>
            </div>

        </form>
    )
}

export default SaleInvoiceForm


