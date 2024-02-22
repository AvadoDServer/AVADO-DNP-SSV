import { useOperatorByPubKey , useOperatorById} from '../hooks/read/useSSVAPI';
import ClickToCopy from './ClickToCopy';

export const OperatorInfo = ({ operatorPubKey }: { operatorPubKey: string }) => {
    const { data: operatorData } = useOperatorByPubKey(operatorPubKey);
    const { data: operatorDetails} = useOperatorById(operatorData?.data?.id);

    if (!operatorData || !operatorDetails) return null;


    const displayTrimmed = (input: string) => {
        //TODO: what is the correct way of doing this? No idead where the unwanted prefix comes from
        var trimmedInput = input
            .replace(/[\u0000-\u001F]/g, "")
            .trim();
        trimmedInput = trimmedInput.substring(trimmedInput.indexOf("d") + 1);

        if (trimmedInput.length < 50)
            return input;
        return <ClickToCopy text={trimmedInput}>{<div>{trimmedInput.substring(0, 8) + "…" + trimmedInput.substring(trimmedInput.length - 8)}</div>}</ClickToCopy>
    }

    if (operatorData.data === null) {
        return (
            <>
                <p>Register your operator</p>
                <p>Please go to the <a href="https://app.ssv.network/my-account/">SSV account page</a> to register your operator</p>
                <p>Your operator pubKey is</p>
                <textarea>{operatorPubKey}</textarea>
                {/* <p>{displayTrimmed(operatorPubKey)}</p> */}
            </>)
    }


    return (<>
        <h2>Operator</h2>
        <textarea>{operatorPubKey}</textarea>
        {/* <p>{displayTrimmed(operatorPubKey)}</p> */}
        <p>DATA:{JSON.stringify(operatorData.data.id, null, 2)}</p>
        <p>Name: {operatorDetails.setup_provider}</p>
        <p>Status: {operatorDetails.status}</p>
        <p>Validators count: {operatorDetails.validators_count}</p>
    </>)

}

