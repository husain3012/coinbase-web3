import { useRouter } from "next/router";
import React from "react";
import Layout from "../../../components/Layout";
import { Divider, Card, Grid, Button } from "semantic-ui-react";
import createCampaignInstance from "../../../ethereum/campaign";
import ContributeForm from "../../../components/ContributeForm";
import Web3 from "web3";
import Link from "next/link";
const MyCampaigns = ({ address, minContribution, balance, requestsCount, approversCount, manager }) => {
  const items = [
    {
      description: "Person who created the campaign and can transaction create requests",
      header: `${manager}`,
      meta: "Manager",
      style: { overflowWrap: "break-word" },
    },
    {
      header: `${minContribution} wei`,
      description: "Minimum amount of wei required to contribute, and marked as an approver",
      meta: "Minimum Contribution",
    },
    {
      header: `${Web3.utils.fromWei(balance)} ETH`,
      description: "Total amount of wei raised to date",
      meta: "Total Balance",
    },
    {
      header: `${requestsCount}`,
      description: "Number of requests made by the manager",
      meta: "Number of Requests",
    },
    {
      header: `${approversCount}`,
      description: "Number of people who have backed the campaign",
      meta: "Number of Backers",
    },
  ];
  const router = useRouter();
  const onSuccess = () => {
    router.reload();
  };
  return (
    <Layout>
      <Divider horizontal>
        <h3 style={{ color: "#fff" }}>Campaign Details</h3>
      </Divider>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={items} />
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={address} onSuccess={onSuccess} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${address}/requests`}>
              <Button primary>View Requests</Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

export default MyCampaigns;

MyCampaigns.getInitialProps = async (ctx) => {
  const { address } = ctx.query;
  const campaignInstance = await createCampaignInstance(address);
  const campaignSummary = await campaignInstance.methods.getSummary().call();

  return {
    minContribution: campaignSummary[0],
    balance: campaignSummary[1],
    requestsCount: campaignSummary[2],
    approversCount: campaignSummary[3],
    manager: campaignSummary[4],
    address: address,
  };
};
