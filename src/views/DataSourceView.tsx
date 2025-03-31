import React, { useEffect, useState } from "react";
import { Collection, Card, Heading, Text, useTheme } from "@aws-amplify/ui-react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export const DataSourceView: React.FC = () => {
  const [dataSources, setDataSources] = useState<Array<Schema["DataSource"]["type"]>>([]);
  const { tokens } = useTheme();

  useEffect(() => {
    const fetchDataSources = async () => {
      const result = await client.models.DataSource.list();
      setDataSources(result.data || []); // Ensure `data` is used correctly
    };

    fetchDataSources();
  }, []);

  return (
    <Card variation="elevated">
      <Heading level={1} marginBottom={tokens.space.medium}>
        Data Sources
      </Heading>
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
