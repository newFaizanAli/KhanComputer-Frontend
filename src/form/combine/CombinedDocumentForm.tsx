import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import {
    Calendar, FileCheck2, Hash, Package2, Plus, Trash2,
    User, ShoppingCart, Percent, StickyNote, Ruler, DollarSign,
    Phone, CreditCard
} from 'lucide-react'
import { ITEMUOM } from '../../constants'
import { FormInput, FormSelect, FormSearchSelect, FormTextarea, FormCheckbox } from '../../components/form'
import { Alert, Button } from '../../components/ui'

// ─── Document variant types ───────────────────────────────────────────────────

export type DocumentVariant = 'sale-invoice' | 'quotation' | 'general-sale-invoice'

// Combined form values — superset of all three document types
export interface CombinedDocumentFormValues {
    // Shared
    customerId: string | null
    customerName: string
    date: string
    discount: number
    notes: string

    // Has GST (sale-invoice + quotation only)
    gst?: number
    is_tax_inclusive?: boolean

    // sale-invoice only
    order_reference_no?: string
    payment_method?: string
    payment_reference?: string
    payment_status?: string
    quotationId?: string | null
    quotationCode?: string | null

    // quotation only
    valid_until?: string

    // general-sale-invoice only
    customerPhno?: string

    // Items — gst field is optional per variant
    items: DocumentItem[]
}

export interface DocumentItem {
    description: string
    quantity: number
    price: number
    discount: number
    gst?: number          // omitted for general-sale-invoice
    uom: string
    notes: string
    total: number
}

// ─── Payment method / status options ─────────────────────────────────────────

const PAYMENT_METHODS = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'online', label: 'Online' },
]

const PAYMENT_STATUSES = [
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'partial', label: 'Partial' },
    { value: 'paid', label: 'Paid' },
]

// ─── Props ────────────────────────────────────────────────────────────────────

interface CombinedDocumentFormProps {
    variant: DocumentVariant
    title: string
    submitLabel: string
    // not needed for general-sale-invoice (manual entry)
    searchCustomerByName?: (q: string) => Promise<{ value: string; label: string }[]>
    searchQuotationByCode?: (q: string) => Promise<{ value: string; label: string }[]>
    onSubmit: (data: CombinedDocumentFormValues) => Promise<void>
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const hasGst = (variant: DocumentVariant) => variant !== 'general-sale-invoice'
const hasPayment = (variant: DocumentVariant) =>
    variant === 'sale-invoice' || variant === 'general-sale-invoice'
const hasTaxInclusive = (variant: DocumentVariant) =>
    variant === 'sale-invoice' || variant === 'quotation'
const hasQuotationRef = (variant: DocumentVariant) => variant === 'sale-invoice'
const hasValidUntil = (variant: DocumentVariant) => variant === 'quotation'
const hasOrderRef = (variant: DocumentVariant) =>
    variant === 'sale-invoice' || variant === 'general-sale-invoice'

// ─── Default item factory (gst optional) ─────────────────────────────────────

const makeDefaultItem = (withGst: boolean): DocumentItem => ({
    description: '',
    quantity: 1,
    price: 0,
    discount: 0,
    ...(withGst ? { gst: 0 } : {}),
    uom: '',
    notes: '',
    total: 0,
})

// ─── Component ────────────────────────────────────────────────────────────────

const CombinedDocumentForm = ({
    variant,
    title,
    submitLabel,
    searchCustomerByName,
    searchQuotationByCode,
    onSubmit: onSubmitProp,
}: CombinedDocumentFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const withGst = hasGst(variant)

    const { register, handleSubmit, control, watch, reset, setValue, formState: { errors } } =
        useForm<CombinedDocumentFormValues>({
            defaultValues: {
                customerId: null,
                customerName: '',
                date: new Date().toISOString().split('T')[0],
                discount: 0,
                notes: '',
                items: [makeDefaultItem(withGst)],

                // GST fields — only for invoice / quotation
                ...(withGst ? { gst: 0, is_tax_inclusive: false } : {}),

                // sale-invoice extras
                ...(variant === 'sale-invoice'
                    ? { order_reference_no: '', quotationId: null, quotationCode: null, payment_method: '', payment_reference: '', payment_status: 'unpaid' }
                    : {}),

                // quotation extras
                ...(variant === 'quotation' ? { valid_until: '' } : {}),

                // general-sale-invoice extras
                ...(variant === 'general-sale-invoice'
                    ? { customerPhno: '', order_reference_no: '', payment_method: '', payment_reference: '' }
                    : {}),
            },
        })

    const { fields, append, remove } = useFieldArray({ control, name: 'items' })
    const watchedItems = watch('items')
    const gst = withGst ? watch('gst') : 0
    const discount = watch('discount')

    // ── Row total ──────────────────────────────────────────────────────────────
    const getRowTotal = (item: DocumentItem) => {
        const lineTotal = (Number(item.quantity) || 0) * (Number(item.price) || 0)
        const afterItemDiscount = lineTotal - (lineTotal * (Number(item.discount) || 0)) / 100
        const itemGst = withGst ? (afterItemDiscount * (Number(item.gst) || 0)) / 100 : 0
        return afterItemDiscount + itemGst
    }

    const subtotal = watchedItems.reduce((sum, item) => sum + getRowTotal(item), 0)
    const orderDiscountAmount = (subtotal * (Number(discount) || 0)) / 100
    const afterDiscount = subtotal - orderDiscountAmount
    const taxAmount = withGst ? (afterDiscount * (Number(gst) || 0)) / 100 : 0
    const grandTotal = afterDiscount + taxAmount

    // ── Submit ─────────────────────────────────────────────────────────────────
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-2 sm:px-4 md:px-6">

            {/* ── Header ───────────────────────────────────────────────────────── */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex flex-wrap items-center gap-2">
                    <ShoppingCart size={15} /> {title}
                </h3>

                {/* Customer — search for invoice/quotation, manual entry for general */}
                {variant === 'general-sale-invoice' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInput
                            type="text"
                            label="Customer Name"
                            placeholder="e.g. Ali Traders"
                            icon={User}
                            name="customerName"
                            register={register}
                            rules={{ required: 'Customer name required' }}
                            error={errors.customerName?.message}
                        />
                        <FormInput
                            type="text"
                            label="Customer Phone"
                            placeholder="e.g. +92 300 1234567"
                            icon={Phone}
                            name="customerPhno"
                            register={register}
                        />
                    </div>
                ) : (
                    <FormSearchSelect<CombinedDocumentFormValues>
                        label="Customer"
                        placeholder="Search customer..."
                        icon={User}
                        name="customerId"
                        register={register}
                        rules={{ required: 'Customer required' }}
                        value={
                            watch('customerId')
                                ? { value: watch('customerId') as string, label: watch('customerName') || '' }
                                : null
                        }
                        onSearch={searchCustomerByName!}
                        onChange={(opt) => {
                            setValue('customerId', opt.value)
                            setValue('customerName', opt.label)
                        }}
                        error={errors.customerId?.message}
                    />
                )}

                {/* Sale invoice: quotation reference */}
                {hasQuotationRef(variant) && searchQuotationByCode && (
                    <FormSearchSelect<CombinedDocumentFormValues>
                        label="Linked Quotation (optional)"
                        placeholder="Search quotation..."
                        icon={FileCheck2}
                        name="quotationId"
                        register={register}
                        value={
                            watch('quotationId')
                                ? { value: watch('quotationId') as string, label: watch('quotationCode') || '' }
                                : null
                        }
                        onSearch={searchQuotationByCode}
                        onChange={(opt) => {
                            setValue('quotationId', opt.value)
                            setValue('quotationCode', opt.label)
                        }}
                    />
                )}

                {/* Order reference (sale-invoice + general) */}
                {hasOrderRef(variant) && (
                    <FormInput
                        type="text"
                        label="Order Reference No."
                        placeholder="e.g. PO-12345"
                        icon={Hash}
                        name="order_reference_no"
                        register={register}
                    />
                )}

                {/* Quotation: valid until */}
                {hasValidUntil(variant) && (
                    <FormInput
                        type="date"
                        label="Valid Until"
                        icon={Calendar}
                        name="valid_until"
                        register={register}
                    />
                )}

                {/* Tax inclusive toggle (sale-invoice + quotation) */}
                {hasTaxInclusive(variant) && (
                    <FormCheckbox
                        label="Tax Inclusive"
                        name="is_tax_inclusive"
                        register={register}
                    />
                )}

                {/* Date */}
                <FormInput
                    type="date"
                    label="Date"
                    icon={Calendar}
                    name="date"
                    register={register}
                    rules={{ required: 'Date required' }}
                    error={errors.date?.message}
                />

                {/* Discount & GST (GST only for invoice / quotation) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                        type="number"
                        label="Discount (%)"
                        placeholder="e.g. 5"
                        icon={Percent}
                        name="discount"
                        min={0}
                        max={100}
                        register={register}
                    />
                    {withGst && (
                        <FormInput
                            type="number"
                            label="Tax / GST (%)"
                            placeholder="e.g. 17"
                            icon={Percent}
                            name="gst"
                            min={0}
                            max={100}
                            register={register}
                        />
                    )}
                </div>

                {/* Payment fields (sale-invoice + general-sale-invoice) */}
                {hasPayment(variant) && (
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormSelect
                                label="Payment Method"
                                name="payment_method"
                                icon={CreditCard}
                                register={register}
                                options={[{ value: '', label: 'Select method' }, ...PAYMENT_METHODS]}
                            />
                            <FormInput
                                type="text"
                                label="Payment Reference"
                                placeholder="Cheque / TXN no."
                                icon={Hash}
                                name="payment_reference"
                                register={register}
                            />
                        </div>
                        {/* payment_status only for sale-invoice (general doesn't track it) */}
                        {variant === 'sale-invoice' && (
                            <FormSelect
                                label="Payment Status"
                                name="payment_status"
                                register={register}
                                options={PAYMENT_STATUSES}
                            />
                        )}
                    </div>
                )}

                <FormTextarea
                    label="Notes"
                    placeholder="General notes or terms..."
                    icon={StickyNote}
                    name="notes"
                    register={register}
                    rows={2}
                />
            </div>

            <div className="border-t border-dashed border-gray-800" />

            {/* ── Items ────────────────────────────────────────────────────────── */}
            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex flex-wrap items-center gap-2">
                        <Package2 size={15} /> Items
                    </h3>
                    <Button
                        type="button"
                        variant="secondary"
                        icon={Plus}
                        onClick={() => append(makeDefaultItem(withGst))}
                    >
                        Add Item
                    </Button>
                </div>

                {fields.length === 0 && (
                    <Alert variant="info">No items added yet. Click "Add Item" to begin.</Alert>
                )}

                <div className="space-y-3">
                    {fields.map((field, index) => {
                        const rowTotal = getRowTotal(watchedItems[index] ?? makeDefaultItem(withGst))
                        return (
                            <div key={field.id} className="border border-gray-800 rounded-lg p-4 space-y-3">
                                <div className="flex items-center flex-wrap justify-between mb-1">
                                    <span className="text-xs font-medium text-gray-400">Item #{index + 1}</span>
                                    {fields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="text-red-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                </div>

                                <FormInput
                                    type="text"
                                    label="Description"
                                    placeholder="Item description..."
                                    icon={Package2}
                                    name={`items.${index}.description`}
                                    register={register}
                                    rules={{ required: 'Description required' }}
                                    error={(errors.items?.[index])?.description?.message as string}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <FormInput
                                        type="number"
                                        label="Price"
                                        placeholder="Price"
                                        icon={DollarSign}
                                        min={0}
                                        name={`items.${index}.price`}
                                        register={register}
                                        rules={{ required: true, min: 0 }}
                                        error={(errors.items?.[index])?.price?.message as string}
                                    />
                                    <FormInput
                                        type="number"
                                        label="Quantity"
                                        placeholder="Qty"
                                        icon={Hash}
                                        min={1}
                                        name={`items.${index}.quantity`}
                                        register={register}
                                        rules={{ required: true, min: 1 }}
                                        error={(errors.items?.[index])?.quantity?.message as string}
                                    />
                                </div>

                                {/* Item discount + item GST (GST only for invoice/quotation) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <FormInput
                                        type="number"
                                        label="Discount (%)"
                                        placeholder="Item discount"
                                        icon={Percent}
                                        min={0}
                                        max={100}
                                        name={`items.${index}.discount`}
                                        register={register}
                                    />
                                    {withGst && (
                                        <FormInput
                                            type="number"
                                            label="GST (%)"
                                            placeholder="e.g. 17"
                                            icon={Percent}
                                            min={0}
                                            max={100}
                                            name={`items.${index}.gst`}
                                            register={register}
                                        />
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <FormSelect
                                        label="UOM"
                                        name={`items.${index}.uom`}
                                        icon={Ruler}
                                        register={register}
                                        options={[{ value: '', label: 'Select UOM' }, ...ITEMUOM]}
                                    />
                                    <FormInput
                                        type="text"
                                        label="Item Notes"
                                        placeholder="Optional note..."
                                        icon={StickyNote}
                                        name={`items.${index}.notes`}
                                        register={register}
                                    />
                                </div>

                                {rowTotal > 0 && (
                                    <p className="text-xs text-right text-gray-400 font-medium">
                                        Row Total:{' '}
                                        <span className="text-white font-semibold">
                                            ₨ {rowTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </p>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── Summary ──────────────────────────────────────────────────────── */}
            {subtotal > 0 && (
                <div className="rounded-xl border border-gray-800 p-4 space-y-2 text-sm">
                    <div className="flex justify-between flex-wrap text-gray-500">
                        <span>Subtotal</span>
                        <span>₨ {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    {Number(discount) > 0 && (
                        <div className="flex justify-between flex-wrap text-gray-500">
                            <span>Discount ({discount}%)</span>
                            <span>− ₨ {orderDiscountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    )}
                    {withGst && Number(gst) > 0 && (
                        <div className="flex justify-between flex-wrap text-gray-500">
                            <span>Tax / GST ({gst}%)</span>
                            <span>₨ {taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    )}
                    <div className="flex flex-wrap justify-between font-semibold text-gray-300 border-t pt-2">
                        <span>Grand Total</span>
                        <span>₨ {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                </div>
            )}

            <div className="flex flex-wrap justify-end gap-2 pt-1">
                <Button type="submit" icon={FileCheck2} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : submitLabel}
                </Button>
            </div>
        </form>
    )
}

export default CombinedDocumentForm