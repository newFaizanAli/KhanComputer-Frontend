import { useForm } from 'react-hook-form'
import { Boxes, DollarSign, FileCheck2, FileText, Hash, Percent } from 'lucide-react'
import type { QuotationItem } from '../../types'
import { useQuotationItemStore } from '../../store'
import { calculateGrandTotal } from '../../utilities/functions'
import { FormInput, FormSelect, FormTextarea } from '../../components/form'
import { Button } from '../../components/ui'
import { ITEMUOM } from '../../constants'


interface QuotationItemProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>
    isEdit: boolean
    defaultValues: QuotationItem
    handleClose: () => void
}

const QuotationItemForm = ({ setModal, isEdit, defaultValues, handleClose }: QuotationItemProps) => {
    const { addQuotationItem, editQuotationItem } = useQuotationItemStore()

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<QuotationItem>({
        defaultValues
    })



    const quantity = watch('quantity');
    const price = watch('price');
    const gst = watch('gst');
    const discount = watch('discount');






    const onSubmit = async (data: QuotationItem) => {
        const total = data.price * data.quantity

        if (isEdit) {
            await editQuotationItem(defaultValues?.id as string, { ...data, total })
            handleClose()
        } else {
            await addQuotationItem({ ...data, total });
            reset();
            setModal(false);
        }

        setModal(false)
        reset()
        handleClose()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">


            <FormTextarea
                label="Product"
                placeholder="Add Item Description"
                icon={FileText}
                rows={4}
                name="description"
                register={register}
                rules={{ required: "Description required" }}
                error={errors.description?.message}
            />


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <FormSelect
                    label="Unit of Measurement"
                    name="uom"
                    icon={Boxes}
                    register={register}
                    options={[{ value: null, label: "Select UOM" }, ...ITEMUOM]}
                    rules={{ required: "UOM required" }}
                    error={errors.uom?.message}
                />


                <FormInput
                    type='number'
                    label="Price"
                    placeholder="Enter price"
                    icon={DollarSign}
                    min={1}
                    name="price"
                    register={register}
                    rules={{ required: "Price required" }}
                    error={errors.price?.message}
                />


                <FormInput
                    type='number'
                    label="Quantity"
                    placeholder="Enter quantity"
                    icon={Hash}
                    min={1}
                    name="quantity"
                    register={register}
                    rules={{ required: "Quantity required" }}
                    error={errors.quantity?.message}
                />


                <FormInput
                    type='number'
                    label="GST"
                    placeholder="Enter GST"
                    icon={Percent}
                    min={0}
                    name="gst"
                    register={register}

                    error={errors.gst?.message}
                />

                <FormInput
                    type='number'
                    label="Discount"
                    placeholder="Enter discount"
                    icon={Percent}
                    min={0}
                    name="discount"
                    register={register}
                    error={errors.discount?.message}
                />





            </div>
            {(price > 0 && quantity > 0) && (
                <div className="text-right font-semibold text-sm text-gray-600">
                    Grand Total: {calculateGrandTotal(price * quantity, gst, discount)}
                </div>
            )}

            <FormTextarea
                label="Notes / Remarks"
                placeholder="Any notes / remarks ..."
                icon={FileText}
                rows={4}
                name="notes"
                register={register}
            />




            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-1">
                <Button variant="secondary" type="button" onClick={handleClose}>
                    Cancel
                </Button>
                <Button type="submit" icon={FileCheck2}>
                    {isEdit ? "Update Quotation Item" : "Create Quotation Item"}
                </Button>
            </div>

        </form>
    )
}

export default QuotationItemForm