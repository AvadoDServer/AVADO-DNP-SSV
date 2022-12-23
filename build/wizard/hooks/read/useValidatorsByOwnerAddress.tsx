import { useContractRead } from "wagmi";
import config from '../../utils/contractConfig.json'

export function useValidatorsByOwnerAddress(owner_address ?: string) {
    
    const { data, error, isLoading } = useContractRead({
        address: config.address,
        abi: config.abi,
        functionName: 'getValidatorsByOwnerAddress',
        args: [owner_address],
    })
    
    return { data: data as string[], error, isLoading };
}
