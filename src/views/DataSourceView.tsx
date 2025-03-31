import React, { useEffect, useState } from "react";
import { Collection, Card, Heading, Text, useTheme, TextField, Button, Flex } from "@aws-amplify/ui-react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export const DataSourceView: React.FC = () => {
  const [dataSources, setDataSources] = useState<Array<Schema["DataSource"]["type"]>>([]);
  const [newDataSource, setNewDataSource] = useState({ name: "", url: "" });
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
      const result = await client.models.DataSource.create(newDataSource);
      setDataSources((prev) => [...prev, result.data]);
      setNewDataSource({ name: "", url: "" });
    }
  };

  return (
    <Card variation="elevated">
      <Heading level={1} marginBottom={tokens.space.medium}>
        Data Sources
      </Heading>
      <Flex direction="column" gap={tokens.space.small} marginBottom={tokens.space.medium}>
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
        <Button onClick={handleAddDataSource} variation="primary">
          Add Data Source
        </Button>
      </Flex>
      <Collection
        type="list"
        items={dataSources}
        gap={tokens.space.small}
        direction="column"
        data-testid="data-source-list"
      >
        {(dataSource) => (
          <Card key={dataSource.id} padding={tokens.space.medium}>
            <Text fontWeight="bold">{dataSource.name}</Text>
            <Text>{dataSource.url}</Text>
          </Card>
        )}
      </Collection>
    </Card>
  );
};
