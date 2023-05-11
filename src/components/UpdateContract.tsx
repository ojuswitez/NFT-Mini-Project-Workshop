import React, { useState, Dispatch, SetStateAction } from "react";
import { TezosToolkit, WalletContract } from "@taquito/taquito";
import { char2Bytes } from "@taquito/utils";

interface UpdateContractProps {
  contract: WalletContract | any;
  setUserBalance: Dispatch<SetStateAction<any>>;
  Tezos: TezosToolkit;
  userAddress: string;
  storage: any;
  setStorage: Dispatch<SetStateAction<any>>;
}

const UpdateContract = ({ contract, setUserBalance, Tezos, userAddress, storage, setStorage }: UpdateContractProps) => {
  const [loadingIncrement, setLoadingIncrement] = useState<boolean>(false);
  const [loadingDecrement, setLoadingDecrement] = useState<boolean>(false);

  const increment = async (): Promise<void> => {
    setLoadingIncrement(true);
    try {
      // const op = await contract.methods.increment(1).send();
      // await op.confirmation();
      const op = await contract.methods.mint(
        [
          {
            to_: userAddress,
            metadata: {
              "": char2Bytes("ipfs://QmXcd5NZQySrErQqStVAaX5NPB7ioWMsgdqGNBCMzxqECD")
            }
          }
        ]
      ).send();
      await op.confirmation();
      const newStorage: any = await contract.storage();
      if (newStorage) setStorage(newStorage);
      setUserBalance(await Tezos.tz.getBalance(userAddress));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingIncrement(false);
    }
  };

  const decrement = async (): Promise<void> => {
    setLoadingDecrement(true);
    try {
      // const op = await contract.methods.decrement(1).send();
      // await op.confirmation();
      const op = await contract.methods.burn(
        [
          {
            from_: userAddress,
            token_id: storage.last_token_id - 1,
            amount: 1
          }
        ]
      ).send();
      const newStorage: any = await contract.storage();
      if (newStorage) setStorage(newStorage);
      setUserBalance(await Tezos.tz.getBalance(userAddress));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingDecrement(false);
    }
  };

  if (!contract && !userAddress) return <div>&nbsp;</div>;
  return (
    <div className="buttons">
      <button className="button" disabled={loadingIncrement} onClick={increment}>
        {loadingIncrement ? (
          <span>
            <i className="fas fa-spinner fa-spin"></i>&nbsp; Please wait
          </span>
        ) : (
          <span>
            <i className="fas fa-plus"></i>&nbsp; Mint
          </span>
        )}
      </button>
      <button className="button" onClick={decrement}>
        {loadingDecrement ? (
          <span>
            <i className="fas fa-spinner fa-spin"></i>&nbsp; Please wait
          </span>
        ) : (
          <span>
            <i className="fas fa-minus"></i>&nbsp; Burn
          </span>
        )}
      </button>
    </div>
  );
};

export default UpdateContract;
