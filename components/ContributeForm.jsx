import React, { useState } from "react";
import { Form, Button, Message, Input, Card } from "semantic-ui-react";
import Web3 from "web3";
import createCampaignInstance from "../ethereum/campaign";

const ContributeForm = ({ address, onSuccess }) => {
  const [value, setValue] = useState("");
  const [transactionStatus, setTransactionStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    setStatusMessage(null);
    if (transactionStatus === "loading") return;

    setTransactionStatus("loading");
    try {
      const campaignInstance = await createCampaignInstance(address);
      const resp = await campaignInstance.methods.contribute().send({
        from: window.ethereum.selectedAddress,
        value: Web3.utils.toWei(value, "ether"),
      });
      setTransactionStatus("success");
      setStatusMessage(`Transaction Hash: ${resp.transactionHash}, Gas Used: ${resp.gasUsed}, Amount: ${value}`);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.log(error);
      setTransactionStatus("error");
      setStatusMessage(error.message);
    }
  };

  return (
    <Card>
      <Card.Content>
      <Card.Header>Contribute</Card.Header>
        <Form floating="right" loading={transactionStatus === "loading"} error={transactionStatus === "error"} success={transactionStatus === "success"} onSubmit={formSubmitHandler}>
          <Form.Field>
            <Input onChange={(e) => setValue(e.target.value)} label="ETH" labelPosition="right" placeholder="(in eth)" />
          </Form.Field>
          <Button primary type="submit">
            Send!
          </Button>
          <Message style={{ overflowWrap: "break-word" }} success header="Transaction Complete" content={statusMessage} />
          <Message style={{ overflowWrap: "break-word" }} error header="Error Occured" content={statusMessage} />
        </Form>
      </Card.Content>
    </Card>
  );
};

export default ContributeForm;
