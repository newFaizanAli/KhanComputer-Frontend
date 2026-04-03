import { StoreForm } from "../../form";
import { PageHeader, SuspenseWrap } from "../../components/page";
import { Card } from "../../components/ui";


const StorePage = () => {


    return (
        <SuspenseWrap>

            <PageHeader title="Store Information" subtitle="Update your store information here."
            />
            <Card className="p-4">
                <StoreForm />
            </Card>

        </SuspenseWrap>
    );
};

export default StorePage;