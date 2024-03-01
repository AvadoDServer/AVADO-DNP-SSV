import CopyToClipboard from 'react-copy-to-clipboard';
import { useOperatorByPubKey, useOperatorById } from '../hooks/read/useSSVAPI';
import { SsvButtons } from './SsvButtons';

export const OperatorInfo = ({ operatorPubKey, network }: { operatorPubKey: string, network: string }) => {
    const { data: operatorData } = useOperatorByPubKey(operatorPubKey, network);
    const { data: operatorDetails } = useOperatorById(operatorData?.data?.id, network);

    if (!operatorData || !operatorDetails) {
        return (
            <>
                <p>Register your operator</p>
                <p>Please go to the <a href="https://app.ssv.network/my-account/operators-dashboard">SSV account page</a> to register your operator</p>
                <p>Your operator pubKey is</p>
                <textarea>{operatorPubKey}</textarea>
                <CopyToClipboard text={operatorPubKey}>
                    <button>Copy to clipboard</button>
                </CopyToClipboard>
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

