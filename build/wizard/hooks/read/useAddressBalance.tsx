import { useContractRead } from "wagmi";
import config from '../../utils/contractConfig.json'

export function useAddressBalance(address ?: string) {
    
    const { data, error, isLoading } = useContractRead({
        address: config.address,
        abi: config.abi,
        functionName: 'getAddressBalance',
        args: [address],
    })
    
    return { data, error, isLoading };
}
