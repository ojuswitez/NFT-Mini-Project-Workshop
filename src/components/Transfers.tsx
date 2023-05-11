import React, { useState, Dispatch, SetStateAction } from "react";
import { TezosToolkit } from "@taquito/taquito";

const Transfers = ({
  Tezos,
  setUserBalance,
  userAddress,
  contractAddress
}: {
  Tezos: TezosToolkit;
  setUserBalance: Dispatch<SetStateAction<number>>;
  userAddress: string;
  contractAddress: string;
}): JSX.Element => {
  const [recipient, setRecipient] = useState<string>("");
  const [tokenId, setTokenId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const sendTransfer = async (): Promise<void> => {
    if (recipient && tokenId) {
      setLoading(true);
      try {
        const contract = await Tezos.contract.at(contractAddress);
        const op = await contract.methodsObject.transfer({
          from_: userAddress,
          txs: [{
            to_: recipient,
            token_id: parseInt(tokenId),
            amount: 1
          }]
        }).send();
        await op.confirmation();
        setRecipient("");
        setTokenId("");
        const balance = await Tezos.tz.getBalance(userAddress);
        setUserBalance(balance.toNumber());
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div id="transfer-inputs">
      <input
        type="text"
        placeholder="Recipient"
        value={recipient}
        onChange={e => setRecipient(e.target.value)}
      />
      <input
        type="number"
        placeholder="TokenID"
        value={tokenId}
        onChange={e => setTokenId(e.target.value)}
      />
      <button
        className="button"
        disabled={!recipient && !tokenId}
        onClick={sendTransfer}
      >
        {loading ? (
          <span>
            <i className="fas fa-spinner fa-spin"></i>&nbsp; Please wait
          </span>
        ) : (
          <span>
            <i className="far fa-paper-plane"></i>&nbsp; Send
          </span>
        )}
      </button>
    </div>
  );
};

export default Transfers;
