import Link from "next/link";
import React from "react";
import { Menu, Button, Container } from "semantic-ui-react";
const Layout = ({ children }) => {
  const [activeItem, setActiveItem] = React.useState("home");
  const handleItemClick = (e) => {};

  return (
    <div>
      <Menu inverted primary style={{ borderRadius: 0 }}>
        <Link href="/">
          <Menu.Item style={{ borderRadius: 0 }} icon="ethereum" name="Crowd Coin" active={activeItem === "home"} onClick={handleItemClick} />
        </Link>
        <Menu.Item position="right">
          <Menu.Item style={{ borderRadius: 0 }} name="my" active={activeItem === "my"} onClick={handleItemClick}>
            My Campaigns
          </Menu.Item>
          <Link href="/campaigns/new">
            <Menu.Item name="new" style={{ borderRadius: 0 }} icon="add" active={activeItem === "new"} onClick={handleItemClick} />
          </Link>
        </Menu.Item>
      </Menu>

      <Container>{children}</Container>
    </div>
  );
};

export default Layout;
