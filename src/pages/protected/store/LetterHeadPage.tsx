import { LetterHeadForm } from "../../../form"
import { Card } from "../../../components/ui"
import { PageHeader, SuspenseWrap } from "../../../components/page"


const LetterHead = () => {
    return (
        <SuspenseWrap>
            <div className="p-6 fade-in">
                <PageHeader title="Letter Head" subtitle="Create or edit letter head for your documents here."
                />
                <Card className="p-4">
                    <LetterHeadForm />
                </Card>
            </div>
        </SuspenseWrap>

    )

}

export default LetterHead



