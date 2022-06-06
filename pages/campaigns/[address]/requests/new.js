import React, { useState } from "react";
import { Form, Button, Message, Input, Divider, TextArea } from "semantic-ui-react";
import Layout from "../../../../components/Layout";
import createCampaignInstance from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";
const NewRequest = ({ address }) => {
  const [value, setValue] = useState("0");
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const formSubmitHandler = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    if (transactionStatus === "loading") return;

    setTransactionStatus("loading");
    try {
      const campaignInstance = await createCampaignInstance(address);

      const resp = await campaignInstance.methods.createRequest(description, web3.utils.toWei(value, "ether"), recipient).send({
        from: window.ethereum.selectedAddress
      });
      console.log(resp);
      setTransactionStatus("success");
      setStatusMessage(`Transaction Hash: ${resp.transactionHash}, Gas Used: ${resp.gasUsed}`);
    } catch (error) {
      console.log(error);
      setTransactionStatus("error");
      setStatusMessage(error.message);
    }
  };
  return (
    <Layout>
      <Divider horizontal>
        <h3 style={{ color: "#fff" }}>New Request</h3>
      </Divider>
      <Form inverted loading={transactionStatus === "loading"} error={transactionStatus === "error"} success={transactionStatus === "success"} onSubmit={formSubmitHandler}>
        <Form.Field>
          <label>Description</label>
          <TextArea required onChange={(e) => setDescription(e.target.value)} value={description} placeholder="Why do you wanna spend this money?" />
        </Form.Field>
        <Form.Field>
          <label>Value</label>
          <Input required onChange={(e) => setValue(e.target.value)} value={value} label="ETH" labelPosition="right" placeholder="(in ether)" />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input required onChange={(e) => setRecipient(e.target.value)} value={recipient} placeholder="something like 0x2xwa..." />
        </Form.Field>
        <Button primary type="submit">
          Create
        </Button>
        <Message success header="Transaction Complete" content={statusMessage} />
        <Message error header="Error Occured" content={statusMessage} />
      </Form>
    </Layout>
  );
};

export default NewRequest;

NewRequest.getInitialProps = async (ctx) => {
  return { address: ctx.query.address };
};
