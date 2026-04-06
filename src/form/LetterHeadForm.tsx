import { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import {
    Calendar, FileCheck2, FileText, User, CreditCard, Edit3
} from 'lucide-react';
import type { LetterHead } from "../types";
import { FormInput, FormTextarea } from '../components/form';
import { Button } from '../components/ui';
import { useLetterHeadStore } from '../store';
import { useLocation } from 'react-router-dom';

const LetterHeadForm = () => {
    const { addLetterHead, editLetterHead } = useLetterHeadStore()
    const location = useLocation();
    const defaultValues = location.state?.values as LetterHead
    const isEdit = location.state?.isEdit || false

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LetterHead>({
        defaultValues: defaultValues || {
            name: "",
            header_text: "",
            issued_at: new Date().toISOString().split("T")[0],
            default_body: "",
            footer_text: "",
            notes: ""
        }
    });

    // Whenever defaultValues change (like editing a different letterhead), reset form
    useEffect(() => {
        if (defaultValues) {
            reset({
                ...defaultValues,
                issued_at: defaultValues.issued_at
                    ? defaultValues.issued_at.split("T")[0]
                    : new Date().toISOString().split("T")[0]
            });
        }
    }, [defaultValues, reset]);

    const onSubmit = async (data: LetterHead) => {
        if (isEdit) {
            await editLetterHead(defaultValues.id!, data);
            // Reset to updated values after edit
            reset({
                ...data,
                issued_at: data.issued_at?.split("T")[0] || new Date().toISOString().split("T")[0]
            });
        } else {
            await addLetterHead(data);
            // Reset to blank after adding new
            reset({
                name: "",
                header_text: "",
                issued_at: new Date().toISOString().split("T")[0],
                default_body: "",
                footer_text: "",
                notes: ""
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <FormInput
                type='text'
                label="Name"
                placeholder="Enter Name (e.g., Bank, Client Submission, Tax Authority, etc)"
                icon={User}
                name="name"
                rules={{ required: "Name required" }}
                error={errors.name?.message}
                register={register}
            />

            <FormInput
                type='text'
                label="Header Text"
                placeholder="Enter header text (e.g., Bank Statement, Client Submission, Tax Authority Letter, etc)"
                icon={CreditCard}
                name="header_text"
                register={register}
            />

            <FormInput
                type="date"
                label="Issued Date"
                placeholder="Enter Issued Date"
                icon={Calendar}
                name="issued_at"
                register={register}
                rules={{ required: "Date required" }}
                error={errors.issued_at?.message}
            />

            <FormTextarea
                label="Default Body"
                placeholder=" Enter default body..."
                icon={FileText}
                rows={8}
                name="default_body"
                register={register}
            />

            <FormInput
                type='text'
                label="Footer Text"
                placeholder="Enter footer text"
                icon={FileText}
                name="footer_text"
                register={register}
            />

            <FormTextarea
                label="Notes / Remarks"
                placeholder="Enter notes ..."
                icon={Edit3}
                rows={4}
                name="notes"
                register={register}
            />

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-1">
                <Button type="submit" icon={FileCheck2}>
                    {isEdit ? "Update Letter Head" : "Create Letter Head"}
                </Button>
            </div>

        </form>
    )
}

export default LetterHeadForm;