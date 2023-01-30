import { useContractRead } from "wagmi";
import config from '../../utils/contractConfig.json'
import { BigNumber, utils } from 'ethers';

// https://docs.ssv.network/developers/smart-contracts/operator-methods

type Operator = {
    name: string, // The operator’s display name
    ownerAddress: string, //The operator’s admin address (for management purposes).
    publicKey: string, //The operator public key
    validators: number, //The amount of managed validators
    fee: BigNumber, //The fee charged by the operator (denominated as $SSV tokens per block)
    score: number, //The operator score
    active: boolean, //Operator network status
}

export function useOperatorById(id: number) {

    if (id === 0)
        return { data: null, error: "test", isLoading: true };

    const { data, error, isLoading } = useContractRead({
        address: config.address,
        abi: config.abi,
        functionName: 'getOperatorById',
        args: [id],
    })

    if (data) {
        
        const data_array: any[] = data as any[];
        const operatorData: Operator = {
            name: data_array[0],
            ownerAddress: data_array[1],
            publicKey: utils.toUtf8String(utils.stripZeros(data_array[2])),
            validators: data_array[3],
            fee: data_array[4],
            score: data_array[5],
            active: data_array[6]
        }
        return { data: operatorData as Operator, error, isLoading };
    }

    return { data: data as Operator, error, isLoading };
}
