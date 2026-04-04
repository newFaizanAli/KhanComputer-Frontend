import { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import {
    Calendar, CalendarClock, FileCheck2, FileText, Percent,
    User
} from 'lucide-react';
import type { Quotation } from "../../types";
import { useQuotationStore, useCustomerStore } from '../../store';
import { FormCheckbox, FormInput, FormSearchSelect, FormTextarea } from '../../components/form';
import { Button } from '../../components/ui';


interface QuotationProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    defaultValues: Quotation
    handleClose: () => void
}

const QuotationForm = ({ setModal, isEdit, defaultValues, handleClose }: QuotationProps) => {

    const { addQuotation, editQuotation } = useQuotationStore()
    const { searchCustomerByName } = useCustomerStore()


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
                valid_until: defaultValues.valid_until
                    ? defaultValues.valid_until.split("T")[0]
                    : "",
                date: defaultValues.date
                    ? defaultValues.date.split("T")[0]
                    : ""
            }
            reset(formattedValues);
        }
    }, [defaultValues, reset]);



    const onSubmit = async (data: Quotation) => {
        if (isEdit) {
            await editQuotation(defaultValues?.id as string, data)
            handleClose()
        } else {
            await addQuotation(data);
            reset();
            setModal(false);
        }
    };



    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">


            <FormSearchSelect<Quotation>
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
                    type="date"
                    label="Valid Until"
                    placeholder="Enter date"
                    icon={CalendarClock}
                    name="valid_until"
                    register={register}
                />

            </div>

            <FormCheckbox
                label="Prices Inclusive of GST"
                name="is_tax_inclusive"
                register={register}
            />


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

export default QuotationForm


