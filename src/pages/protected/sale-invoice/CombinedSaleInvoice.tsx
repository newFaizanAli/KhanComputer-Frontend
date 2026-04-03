import { CombinedSaleInvoiceForm } from "../../../form"
import { Card } from "../../../components/ui"
import { PageHeader, SuspenseWrap } from "../../../components/page"


const CombinedSaleInvoice = () => {
    return (
        <SuspenseWrap>
            <div className="p-6 fade-in">
                <PageHeader title="Combined Sale Invoice" subtitle="Create a combined sale invoice for multiple items here."
                />
                <Card className="p-4">
                    <CombinedSaleInvoiceForm />
                </Card>
            </div>
        </SuspenseWrap>

    )

}

export default CombinedSaleInvoice



