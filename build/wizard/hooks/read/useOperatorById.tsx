import { Address, useContractRead } from "wagmi";
import config from '../../utils/ssvNetworkViewsConfig.json'
import { BigNumber, utils } from 'ethers';

// https://docs.ssv.network/developers/smart-contracts/operator-methods

type Operator = {
    ownerAddress: Address, //The operator’s admin address (for management purposes).
    fee: BigNumber, //The fee charged by the operator (denominated as $SSV tokens per block)
    validators: number, //The amount of managed validators
    active: boolean, //Operator network status
}

export function useOperatorById(id: bigint) {

    if (id === 0n)
        return { data: null, error: "test", isLoading: true };

    const { data, error, isLoading } = useContractRead({
        address: config.address as Address,
        abi: config.abi,
        functionName: 'getOperatorById',
        args: [id.toString()],
    })

    if (data) {

        const data_array: any[] = data as any[];
        const operatorData: Operator = {
            ownerAddress: data_array[0],
            fee: data_array[1],
            validators: data_array[2],
            active: data_array[3]
        }
        console.log(operatorData)
        return { data: operatorData as Operator, error, isLoading };
    }

    return { data: data as Operator, error, isLoading };
}
