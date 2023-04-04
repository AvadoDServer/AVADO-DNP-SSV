import { Address, useContractRead } from "wagmi";
import config from '../../utils/contractConfig.json'

// https://docs.ssv.network/developers/smart-contracts/ssvnetworkviews#public-getbalance-owner-operatorids-cluster
export function useAddressBalance(address?: Address) {

    const { data, error, isLoading } = useContractRead({
        address: config.address as Address,
        abi: config.abi,
        functionName: 'getBalance',
        args: [address],
    })

    return { data, error, isLoading };
}
