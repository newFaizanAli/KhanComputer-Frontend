import { ProfileForm } from "../../form";
import { PageHeader, SuspenseWrap } from "../../components/page";
import { Card } from "../../components/ui";


const ProfilePage = () => {


    return (
        <SuspenseWrap>

            <PageHeader title="Profile Information" subtitle="Update your profile information here."
            />
            <Card className="p-4">
                <ProfileForm />
            </Card>

        </SuspenseWrap>
    );
};

export default ProfilePage;