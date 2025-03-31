import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import { 
  Table, 
  TableCell, 
  TableHead, 
  TableRow, 
  TableBody, 
  Heading, 
  View, 
  Loader, 
  TextField, 
  Button, 
  Flex,
  Card
 } from "@aws-amplify/ui-react";
import type { Schema } from "../../amplify/data/resource";


const client = generateClient<Schema>();

const newLocal = ()=> ({
  key: "",
  apiType: "SAM",
  limit: 100,
  used: 0
});

export const ApiKeysView = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newApiKey, setNewApiKey] = useState(newLocal());

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const result = await client.models.ApiKey.list();
        setApiKeys(result.data || []);
      } catch (error) {
        console.error("Error fetching API keys:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApiKeys();
  }, []);

  const handleCreateApiKey = async (e) => {
    e.preventDefault(); // Prevent form submission default behavior
    try {
      const result = await client.models.ApiKey.create(newApiKey);
      if (result.data) {
        setApiKeys((prev) => [...prev, result.data]);
        setNewApiKey(newLocal());
      } else {
        console.error("Failed to create API key: No data returned");
      }
    } catch (error) {
      console.error("Error creating API key:", error);
    }
  };

  return (
    <View padding="1rem">
      <Card>
        <Heading level={3}>API Keys</Heading>
        <Flex as="form" direction="row" gap="1rem" marginBottom="1rem" onSubmit={handleCreateApiKey}>
          <TextField
            label="Key"
            value={newApiKey.key}
            onChange={(e) => setNewApiKey({ ...newApiKey, key: e.target.value })}
          />
          <TextField
            label="Type"
            value={newApiKey.apiType}
            onChange={(e) => setNewApiKey({ ...newApiKey, apiType: e.target.value })}
          />
          <TextField
            label="Limit"
            type="number"
            value={newApiKey.limit}
            onChange={(e) => setNewApiKey({ ...newApiKey, limit: parseInt(e.target.value, 10) })}
          />
        </Flex>
        <Button type="submit" onClick={handleCreateApiKey}>Create API Key</Button>  
      </Card>

      {loading ? (
        <Loader />
      ) : (
        <Table caption="List of API Keys">
          <TableHead>
            <TableRow>
              <TableCell as="th">Key</TableCell>
              <TableCell as="th">Type</TableCell>
              <TableCell as="th">Limit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apiKeys.map((apiKey) => (
              <TableRow key={apiKey.id}>
                <TableCell>{apiKey.key}</TableCell>
                <TableCell>{apiKey.apiType}</TableCell>
                <TableCell>{apiKey.limit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </View>

  );
};
