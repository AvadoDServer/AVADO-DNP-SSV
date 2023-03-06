import { Address, useContractRead } from "wagmi";
import config from '../../utils/contractConfig.json'

export function useAddressBalance(address ?: Address) {
    
    const { data, error, isLoading } = useContractRead({
        address: config.address as Address,
        abi: config.abi,
        functionName: 'getAddressBalance',
        args: [address],
    })
    
    return { data, error, isLoading };
}
