import React, { useEffect, useState } from "react";
import { Collection, Card, Heading, Text, useTheme, TextField, Button, Flex } from "@aws-amplify/ui-react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export const DataSourceView: React.FC = () => {
  const [dataSources, setDataSources] = useState<Array<Schema["DataSource"]["type"]>>([]);
  const [newDataSource, setNewDataSource] = useState({ 
    name: "", 
    url: "", 
    apiType: ""
   });
  const { tokens } = useTheme();

  useEffect(() => {
    const fetchDataSources = async () => {
      const result = await client.models.DataSource.list();
      setDataSources(result.data || []); // Ensure `data` is used correctly
    };

    fetchDataSources();
  }, []);

  const handleAddDataSource = async () => {
    if (newDataSource.name && newDataSource.url) {
      try {
        const result = await client.models.DataSource.create(newDataSource);
        if (result && result.data) {
          setDataSources((prev) => [...prev, result.data as Schema["DataSource"]["type"]]);
          setNewDataSource({ name: "", url: "", apiType: "" });
        } else {
          console.error("Failed to create data source: Invalid response", result);
        }
      } catch (error) {
        console.error("Failed to create data source:", error);
      }
    } else {
      console.warn("Name and URL are required to create a data source.");
    }
  };

  return (
    <Card variation="elevated">
      <Heading level={1} marginBottom={tokens.space.medium}>
        Data Sources
      </Heading>
      <Flex direction="row" gap={tokens.space.small} marginBottom={tokens.space.medium}>
        <TextField
          label="Name"
          value={newDataSource.name}
          onChange={(e) => setNewDataSource({ ...newDataSource, name: e.target.value })}
        />
        <TextField
          label="URL"
          value={newDataSource.url}
          onChange={(e) => setNewDataSource({ ...newDataSource, url: e.target.value })}
        />
        <TextField
          label="API Type"
          value={newDataSource.apiType}
          onChange={(e) => setNewDataSource({ ...newDataSource, apiType: e.target.value })}
        />
        
      </Flex>
              
      <Button onClick={handleAddDataSource} variation="primary">
          Add Data Source
        </Button>
      <Collection
        type="list"
        items={dataSources}
        gap={tokens.space.small}
        direction="column"
        data-testid="data-source-list"
      >
        {(dataSource) => {
          return (
            <Card key={dataSource.id} padding={tokens.space.medium}>
              <Text fontWeight="bold">{dataSource.name}</Text>
              <Text>{dataSource.url}</Text>
              <Text>{dataSource.slug}</Text>
              {newFunction(dataSource)}
            </Card>
          )
        }}
      </Collection>
    </Card>
  );
};

function newFunction(dataSource) {
  return <pre>{JSON.stringify(dataSource, null, 2)}</pre>;
}
