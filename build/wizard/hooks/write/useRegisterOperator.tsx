import { BigNumber, ethers, Bytes } from 'ethers';
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractEvent,
  Address,
} from "wagmi";
import contractConfig from '../../utils/contractConfig.json'

export function useRegisterOperator({ name, publicKey, fee, onRegistered }: { name: string, publicKey: any, fee: BigNumber, onRegistered: (id: number) => void }) {

  const { config } = usePrepareContractWrite({
    address: contractConfig.address as Address,
    abi: contractConfig.abi,
    functionName: 'registerOperator',
    args: [name, publicKey, fee]
  })
  const { data, isLoading, isSuccess, error, write } = useContractWrite(config)

  useContractEvent({
    address: contractConfig.address as Address,
    abi: contractConfig.abi,
    eventName: 'OperatorRegistration',
    listener(id, name, ownerAddress, publicKey, fee) {
      onRegistered(id as number)
    },
  })
  return { data, isLoading, isSuccess, error, write };

}
