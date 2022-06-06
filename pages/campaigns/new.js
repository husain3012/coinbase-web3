import Link from "next/link";
import React, { useState } from "react";
import { Form, Button, Message, Input } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factoryInstance from "../../ethereum/factory";
const NewCampaign = () => {
  const [value, setValue] = useState("");
  const [transactionStatus, setTransactionStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const formSubmitHandler = async (event) => {
    event.preventDefault();
    setStatusMessage(null);
    if (transactionStatus === "loading") return;

    setTransactionStatus("loading");
    try {
      const resp = await factoryInstance.methods.createCampaign(value).send({ from: window.ethereum.selectedAddress });
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
   
      <h3>Create a campaign!</h3>
      <Form loading={transactionStatus === "loading"} error={transactionStatus === "error"} success={transactionStatus === "success"} onSubmit={formSubmitHandler}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input onChange={(e) => setValue(e.target.value)} label="wei" labelPosition="right" type="number" placeholder="(in wei)" />
        </Form.Field>
        <Button primary type="submit">
          Submit
        </Button>
        <Message success header="Transaction Complete" content={statusMessage} />
        <Message error header="Error Occured" content={statusMessage} />
      </Form>
    </Layout>
  );
};

export default NewCampaign;
