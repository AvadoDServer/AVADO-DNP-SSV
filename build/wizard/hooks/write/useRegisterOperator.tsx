import { BigNumber, ethers, Bytes } from 'ethers';
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractEvent,
  Address,
} from "wagmi";
import contractConfig from '../../utils/contractConfig.json'

export function useRegisterOperator({ name, publicKey, fee, onRegistered }: { name: string, publicKey: any, fee: BigNumber, onRegistered: (id: bigint) => void }) {

  const { config } = usePrepareContractWrite({
    address: contractConfig.address as Address,
    abi: contractConfig.abi,
    functionName: 'registerOperator',
    args: [publicKey, fee]
  })
  const { data, isLoading, isSuccess, error, write } = useContractWrite(config)

  useContractEvent({
    address: contractConfig.address as Address,
    abi: contractConfig.abi,
    eventName: 'OperatorAdded',
    listener(id: any, name, ownerAddress, publicKey, fee) {
      onRegistered(BigInt(id.toString()))
    },
  })
  return { data, isLoading, isSuccess, error, write };

}
