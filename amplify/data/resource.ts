import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  DataSource: a.model({
    status: a.enum(["PENDING", "SUCCESS", "FAILED"]),
    name: a.string().required(),
    slug: a.string(),
    url: a.string().required(),
    apiType: a.string().default("SAM").required(),
    createdAt: a.datetime()
  }),
  Todo: a.model({
    content: a.string(),
  }),
  ApiKey: a.model({
    key: a.string().required(),
    type: a.string().default("SAM").required(),
    limit: a.integer().default(1000).required(),
    used: a.integer().default(0).required(),
  }),
}).authorization((allow) => [allow.publicApiKey()]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});