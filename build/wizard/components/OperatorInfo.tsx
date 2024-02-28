import { useOperatorByPubKey, useOperatorById } from '../hooks/read/useSSVAPI';
import ClickToCopy from './ClickToCopy';
import { SsvButtons } from './SsvButtons';

export const OperatorInfo = ({ operatorPubKey }: { operatorPubKey: string }) => {
    const { data: operatorData } = useOperatorByPubKey(operatorPubKey);
    const { data: operatorDetails } = useOperatorById(operatorData?.data?.id);

    if (!operatorData || !operatorDetails) return null;

    if (operatorData.data === null) {
        return (
            <>
                <p>Register your operator</p>
                <p>Please go to the <a href="https://app.ssv.network/my-account/">SSV account page</a> to register your operator</p>
                <p>Your operator pubKey is</p>
            </>)
    }

    return (<>
        <h2>Operator</h2>
        <textarea>{operatorPubKey}</textarea>
        <p>Operator ID:{JSON.stringify(operatorData.data.id, null, 2)}</p>
        <p>Name: {operatorDetails.setup_provider}</p>
        <p>Status: {operatorDetails.status}</p>
        <p>Validators count: {operatorDetails.validators_count}</p>
        <SsvButtons operatorId={operatorData.data.id} />

    </>)

}

