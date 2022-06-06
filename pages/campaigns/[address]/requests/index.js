import React from "react";
import Layout from "../../../../components/Layout";
import { Button, Divider, Grid, Table } from "semantic-ui-react";
import createCampaignInstance from "../../../../ethereum/campaign";
import Link from "next/link";
import { useRouter } from "next/router";
import RequestRow from "../../../../components/RequestRow";
const Requests = ({ address, requests, requestCount, totalApprovers }) => {
  const router = useRouter();


  return (
    <Layout>
      <Divider horizontal>
        <h3 style={{ color: "#fff" }}>Requests</h3>
      </Divider>

      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Recipient</Table.HeaderCell>
            <Table.HeaderCell>Approval Count</Table.HeaderCell>
            <Table.HeaderCell>Approve</Table.HeaderCell>
            <Table.HeaderCell>Finalize</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {requests.map((request, index) => {
            return (
            <RequestRow index={index} address={address} key={index} request={request} totalApprovers={totalApprovers} />
            );
          })}
        </Table.Body>
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell colSpan="6">
              <Link href={`/campaigns/${address}/requests/new`}>
                <Button floated="right">Create Request</Button>
              </Link>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </Layout>
  );
};

export default Requests;
Requests.getInitialProps = async (ctx) => {
  const address = ctx.query.address;
  const campaign = await createCampaignInstance(address);
  const requestCount = await campaign.methods.getRequestsCount().call();
  const totalApprovers = await campaign.methods.totalApprovers().call();
  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );
  return { address, requests, requestCount, totalApprovers };
};
