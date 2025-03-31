import React from "react";
import { Flex, Text, Button, useTheme } from "@aws-amplify/ui-react";
import { Link } from "react-router-dom";

export const Navbar: React.FC<{ userPersona: string; onSignOut: () => void }> = ({ userPersona, onSignOut }) => {
  const { tokens } = useTheme();

  return (
    <Flex
      as="nav"
      justifyContent="space-between"
      alignItems="center"
      padding={tokens.space.medium}
      backgroundColor={tokens.colors.background.primary} // Fixed type error
      color={tokens.colors.font.primary} // Fixed type error
      data-testid="navbar"
    >
      <Flex gap={tokens.space.large}>
        <Link to="/todos" style={{ textDecoration: "none", color: tokens.colors.font.primary }}>
          <Text>Todos</Text>
        </Link>
        <Link to="/datasource" style={{ textDecoration: "none", color: tokens.colors.font.primary }}>
          <Text>DataSource</Text>
        </Link>
      </Flex>
      <Flex alignItems="center" gap={tokens.space.medium}>
        <Text>{userPersona || "Guest"}</Text>
        <Button variation="link" onClick={onSignOut} data-testid="sign-out-button">
          Sign Out
        </Button>
      </Flex>
    </Flex>
  );
};
