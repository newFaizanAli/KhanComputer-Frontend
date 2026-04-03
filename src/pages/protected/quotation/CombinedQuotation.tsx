import { CombinedQuotationForm } from "../../../form"
import { Card } from "../../../components/ui"
import { PageHeader, SuspenseWrap } from "../../../components/page"


const CombinedQuotation = () => {
    return (
        <SuspenseWrap>
            <div className="p-6 fade-in">
                <PageHeader title="Combined Quotation" subtitle="Create a combined quotation for multiple items here."
                />
                <Card className="p-4">
                    <CombinedQuotationForm />
                </Card>
            </div>
        </SuspenseWrap>

    )

}

export default CombinedQuotation



