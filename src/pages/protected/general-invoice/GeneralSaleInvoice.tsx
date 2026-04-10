import { CombinedGeneralInvoice } from "../../../form"
import { Card } from "../../../components/ui"
import { PageHeader, SuspenseWrap } from "../../../components/page"


const GeneralSaleInvoice = () => {
    return (
        <SuspenseWrap>
            <div className="p-6 fade-in">
                <PageHeader title="General Sale Invoice" subtitle="
                Create a general sale invoice for multiple items here."
                />
                <Card className="p-4">
                    <CombinedGeneralInvoice />
                </Card>
            </div>
        </SuspenseWrap>

    )

}

export default GeneralSaleInvoice





