import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import {
    Calendar, FileCheck2, Hash, Package2, Plus, Trash2,
    User, ShoppingCart, Percent, StickyNote, Ruler, DollarSign
} from 'lucide-react'
import type { CombinedDocumentFormValues, DocumentItem } from '../../types'
import { ITEMUOM } from '../../constants'
import { FormInput, FormSelect, FormSearchSelect, FormTextarea } from '../../components/form'
import { Alert, Button } from '../../components/ui'



interface ExtraField {
    type: 'search' | 'text' | 'date'
    name: keyof CombinedDocumentFormValues
    label: string
    placeholder?: string
    // For search fields
    onSearch?: (q: string) => Promise<{ value: string; label: string }[]>
    linkedLabelField?: keyof CombinedDocumentFormValues
}

interface CombinedDocumentFormProps {
    title: string
    submitLabel: string
    extraFields?: ExtraField[]
    searchCustomerByName: (q: string) => Promise<{ value: string; label: string }[]>
    onSubmit: (data: CombinedDocumentFormValues) => Promise<void>
}


const defaultItem: DocumentItem = {
    description: '', quantity: 1, price: 0,
    discount: 0, gst: 0, uom: '', notes: '', total: 0,
}

const CombinedDocumentForm = ({
    title,
    submitLabel,
    extraFields = [],
    searchCustomerByName,
    onSubmit: onSubmitProp,
}: CombinedDocumentFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { register, handleSubmit, control, watch, reset, setValue, formState: { errors } } =
        useForm<CombinedDocumentFormValues>({
            defaultValues: {
                customerId: null, customerName: '',
                date: new Date().toISOString().split('T')[0],
                discount: 0, gst: 0, notes: '',
                items: [{ ...defaultItem }],
                valid_until: '', quotationId: null,
                order_reference_no: '',
            },
        })

    const { fields, append, remove } = useFieldArray({ control, name: 'items' })
    const watchedItems = watch('items')
    const gst = watch('gst')
    const discount = watch('discount')

    const getRowTotal = (item: DocumentItem) => {
        const lineTotal = (Number(item.quantity) || 0) * (Number(item.price) || 0)
        const afterItemDiscount = lineTotal - (lineTotal * (Number(item.discount) || 0)) / 100
        const itemGst = (afterItemDiscount * (Number(item.gst) || 0)) / 100
        return afterItemDiscount + itemGst
    }

    const subtotal = watchedItems.reduce((sum, item) => sum + getRowTotal(item), 0)
    const orderDiscountAmount = (subtotal * (Number(discount) || 0)) / 100
    const afterDiscount = subtotal - orderDiscountAmount
    const taxAmount = (afterDiscount * (Number(gst) || 0)) / 100
    const grandTotal = afterDiscount + taxAmount

    const onSubmit = async (data: CombinedDocumentFormValues) => {
        setIsSubmitting(true)
        try {
            await onSubmitProp({
                ...data,
                items: data.items.map(item => ({ ...item, total: getRowTotal(item) })),
            })
            reset()
        } catch (err) {
            console.error('Failed to submit:', err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* ── Header ── */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <ShoppingCart size={15} /> {title}
                </h3>

                {/* Customer */}
                <FormSearchSelect<CombinedDocumentFormValues>
                    label="Customer" placeholder="Search customer..." icon={User}
                    name="customerId" register={register}
                    rules={{ required: 'Customer required' }}
                    value={watch('customerId') ? { value: watch('customerId') as string, label: watch('customerName') || '' } : null}
                    onSearch={searchCustomerByName}
                    onChange={(opt) => { setValue('customerId', opt.value); setValue('customerName', opt.label) }}
                    error={errors.customerId?.message}
                />

                {/* Extra fields (quotationId, order_reference_no, valid_until, etc.) */}
                {extraFields.map((field) =>
                    field.type === 'search' ? (
                        <FormSearchSelect<CombinedDocumentFormValues>
                            key={field.name}
                            label={field.label}
                            placeholder={field.placeholder}
                            icon={User}
                            name={field.name}
                            register={register}
                            value={
                                watch(field.name)
                                    ? { value: watch(field.name) as string, label: watch(field.linkedLabelField!) as string || '' }
                                    : null
                            }
                            onSearch={field.onSearch!}
                            onChange={(opt) => {
                                setValue(field.name, opt.value)
                                if (field.linkedLabelField) setValue(field.linkedLabelField, opt.label)
                            }}
                        />
                    ) : (
                        <FormInput
                            key={field.name}
                            type={field.type}
                            label={field.label}
                            placeholder={field.placeholder}
                            icon={field.type === 'date' ? Calendar : Hash}
                            name={field.name}
                            register={register}
                        />
                    )
                )}

                {/* Date */}
                <FormInput
                    type="date" label="Date" icon={Calendar}
                    name="date" register={register}
                    rules={{ required: 'Date required' }}
                    error={errors.date?.message}
                />

                {/* Discount & GST */}
                <div className="grid grid-cols-2 gap-4">
                    <FormInput type="number" label="Discount (%)" placeholder="e.g. 5"
                        icon={Percent} name="discount" min={0} max={100} register={register} />
                    <FormInput type="number" label="Tax / GST (%)" placeholder="e.g. 17"
                        icon={Percent} name="gst" min={0} max={100} register={register} />
                </div>

                <FormTextarea label="Notes" placeholder="General notes or terms..."
                    icon={StickyNote} name="notes" register={register} rows={2} />
            </div>

            <div className="border-t border-dashed border-gray-800" />

            {/* ── Items ── */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <Package2 size={15} /> Items
                    </h3>
                    <Button type="button" variant="secondary" icon={Plus} onClick={() => append({ ...defaultItem })}>
                        Add Item
                    </Button>
                </div>

                {fields.length === 0 && <Alert variant="info">No items added yet. Click "Add Item" to begin.</Alert>}

                <div className="space-y-3">
                    {fields.map((field, index) => {
                        const rowTotal = getRowTotal(watchedItems[index] || defaultItem)
                        return (
                            <div key={field.id} className="border border-gray-800 rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium text-gray-400">Item #{index + 1}</span>
                                    {fields.length > 1 && (
                                        <button type="button" onClick={() => remove(index)}
                                            className="text-red-400 hover:text-red-600 transition-colors">
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                </div>

                                <FormInput type="text" label="Description" placeholder="Item description..."
                                    icon={Package2} name={`items.${index}.description`} register={register}
                                    rules={{ required: 'Description required' }}
                                    error={(errors.items?.[index])?.description?.message as string} />


                                <div className="grid grid-cols-2 gap-3">
                                    <FormInput type="number" label="Price" placeholder="Price" icon={DollarSign} min={0}
                                        name={`items.${index}.price`} register={register}
                                        rules={{ required: true, min: 0 }}
                                        error={(errors.items?.[index])?.price?.message as string} />
                                    <FormInput type="number" label="Quantity" placeholder="Qty" icon={Hash} min={1}
                                        name={`items.${index}.quantity`} register={register}
                                        rules={{ required: true, min: 1 }}
                                        error={(errors.items?.[index])?.quantity?.message as string} />
                                </div>


                                <div className="grid grid-cols-2 gap-3">
                                    <FormInput type="number" label="Discount (%)" placeholder="Item discount"
                                        icon={Percent} min={0} max={100}
                                        name={`items.${index}.discount`} register={register} />
                                    <FormInput type="number" label="GST (%)" placeholder="e.g. 17"
                                        icon={Percent} min={0} max={100}
                                        name={`items.${index}.gst`} register={register} />
                                </div>



                                <div className="grid grid-cols-2 gap-3">
                                    <FormSelect label="UOM" name={`items.${index}.uom`} icon={Ruler}
                                        register={register}
                                        options={[{ value: null, label: "Select UOM" }, ...ITEMUOM]} />
                                    <FormInput type="text" label="Item Notes" placeholder="Optional note..."
                                        icon={StickyNote} name={`items.${index}.notes`} register={register} />
                                </div>

                                {rowTotal > 0 && (
                                    <p className="text-xs text-right text-gray-400 font-medium">
                                        Row Total: <span className="text-white font-semibold">
                                            ₨ {rowTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </p>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── Summary ── */}
            {subtotal > 0 && (
                <div className="rounded-xl border border-gray-800 p-4 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500">
                        <span>Subtotal</span>
                        <span>₨ {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    {Number(discount) > 0 && (
                        <div className="flex justify-between text-gray-500">
                            <span>Discount ({discount}%)</span>
                            <span>− ₨ {orderDiscountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    )}
                    {Number(gst) > 0 && (
                        <div className="flex justify-between text-gray-500">
                            <span>Tax / GST ({gst}%)</span>
                            <span>₨ {taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-semibold text-gray-300 border-t pt-2">
                        <span>Grand Total</span>
                        <span>₨ {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
                <Button type="submit" icon={FileCheck2} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : submitLabel}
                </Button>
            </div>
        </form>
    )
}

export default CombinedDocumentForm