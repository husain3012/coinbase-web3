import React, { useState } from "react";
import { Table, Button } from "semantic-ui-react";
import createCampaignInstance from "../ethereum/campaign";
import { useRouter } from "next/router";
const RequestRow = ({ address, request, totalApprovers, index }) => {
  const router = useRouter();
  const [transactionStatus, setTransactionStatus] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const approveRequestHandler = async () => {
    if (transactionStatus === "loading-approve" || transactionStatus === "loading-finalize") return;
    try {
      setTransactionStatus("loading-approve");
      console.log(transactionStatus);
      const campaign = await createCampaignInstance(address);
      await campaign.methods.approveRequest(index).send({
        from: window.ethereum.selectedAddress,
      });
      console.log("Request approved!");
      setTransactionStatus("success");
      router.reload();
    } catch (error) {
      setTransactionStatus("error");
      console.log(error);
      setStatusMessage(error.message);
    }
  };
  const finalizeRequestHandler = async () => {
    if (transactionStatus === "loading-approve" || transactionStatus === "loading-finalize") return;
    try {
      setTransactionStatus("loading-finalize");
      console.log(transactionStatus);
      const campaign = await createCampaignInstance(address);
      await campaign.methods.finalizeRequest(index).send({
        from: window.ethereum.selectedAddress,
      });
      setTransactionStatus("success-finalize");
      router.reload();

    } catch (error) {
      setTransactionStatus("error");
      console.log(error);
      setStatusMessage(error.message);
    }
  };
  console.log(request);
  return (
    <Table.Row disabled={request.complete} key={index}>
      <Table.Cell>{index}</Table.Cell>
      <Table.Cell>{request.description}</Table.Cell>
      <Table.Cell>{request.value}</Table.Cell>
      <Table.Cell>{request.recipent}</Table.Cell>
      <Table.Cell>{`${request.approverCount}/${totalApprovers}`}</Table.Cell>
      {!request.complete && (
        <>
          <Table.Cell>
            <Button loading={transactionStatus === "loading-approve"} color="green" basic onClick={approveRequestHandler}>
              Approve
            </Button>
          </Table.Cell>
          <Table.Cell>
            <Button disabled={request.approverCount < totalApprovers / 2} loading={transactionStatus === "loading-finalize"} color="teal" basic onClick={() => finalizeRequestHandler(request.index)}>
              Finalize
            </Button>
          </Table.Cell>
        </>
      )}
    </Table.Row>
  );
};

export default RequestRow;
