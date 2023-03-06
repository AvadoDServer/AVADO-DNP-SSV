import { Address, useContractRead } from "wagmi";
import config from '../../utils/contractConfig.json'

export function useValidatorsByOwnerAddress(owner_address ?: Address) {
    
    const { data, error, isLoading } = useContractRead({
        address: config.address as Address,
        abi: config.abi,
        functionName: 'getValidatorsByOwnerAddress',
        args: [owner_address],
    })
    
    return { data: data as string[], error, isLoading };
}
