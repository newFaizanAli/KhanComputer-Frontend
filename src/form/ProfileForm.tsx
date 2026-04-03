import { useEffect } from 'react'
import { Lock, Mail, UserCheck, Users } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { FormInput } from '../components/form'
import { Button } from '../components/ui'
import { useProfileStore } from '../store'

const ProfileForm = () => {
    const { profile, fetchProfile, updateProfile, updatePassword } = useProfileStore()


    const {
        register: profileRegister,
        handleSubmit: handleProfileSubmit,
        reset,
        formState: { errors: profileErrors }
    } = useForm<{
        name: string;
        email: string;
    }>()


    const {
        register: passwordRegister,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors }
    } = useForm<{
        currentPassword: string;
        newPassword: string;
    }>()

    useEffect(() => {
        fetchProfile()
    }, [])

    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name,
                email: profile.email
            })
        }
    }, [profile, reset])

    const onSubmit = async (data: {
        name: string;
        email: string;
    }) => {
        await updateProfile(data)
    }

    const onPasswordUpdate = async (data: {
        currentPassword: string;
        newPassword: string;
    }) => {
        await updatePassword(data)
    }

    return (
        <div className="space-y-6">


            <form onSubmit={handleProfileSubmit(onSubmit)} className="space-y-4">
                <FormInput
                    label="Full Name"
                    icon={Users}
                    name="name"
                    register={profileRegister}
                    rules={{ required: "Name required" }}
                    error={profileErrors.name?.message}
                />

                <FormInput
                    label="Email"
                    icon={Mail}
                    name="email"
                    register={profileRegister}
                    rules={{
                        required: "Email required",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email"
                        }
                    }}
                    error={profileErrors.email?.message}
                />

                <Button type="submit" icon={UserCheck}>
                    Update Profile
                </Button>
            </form>


            <form onSubmit={handlePasswordSubmit(onPasswordUpdate)} className="space-y-4">
                <FormInput
                    label="Current Password"
                    type="text"
                    icon={Lock}
                    name="currentPassword"
                    register={passwordRegister}
                    rules={{ required: "Required" }}
                    error={passwordErrors.currentPassword?.message}
                />

                <FormInput
                    label="New Password"
                    type="text"
                    icon={Lock}
                    name="newPassword"
                    register={passwordRegister}
                    rules={{
                        required: "Required",
                        minLength: { value: 8, message: "Min 8 chars" }
                    }}
                    error={passwordErrors.newPassword?.message}
                />

                <Button type="submit">
                    Update Password
                </Button>
            </form>

        </div>
    )
}

export default ProfileForm