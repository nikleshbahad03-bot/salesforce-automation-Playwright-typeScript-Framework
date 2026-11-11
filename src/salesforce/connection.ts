import { Connection } from 'jsforce';

let connection: Connection | undefined;

export function initializeSalesforceConnection(accessToken: string, instanceUrl: string): Connection {
  const token = accessToken.trim();
  if (!token) {
    throw new Error('Salesforce OAuth response did not include an access token.');
  }

  let normalizedInstanceUrl: URL;
  try {
    normalizedInstanceUrl = new URL(instanceUrl);
  } catch (error) {
    throw new Error('Salesforce OAuth response included an invalid instance URL.', { cause: error });
  }

  if (normalizedInstanceUrl.protocol !== 'https:' && normalizedInstanceUrl.protocol !== 'http:') {
    throw new Error('Salesforce instance URL must use HTTP or HTTPS.');
  }

  connection = new Connection({
    accessToken: token,
    instanceUrl: normalizedInstanceUrl.origin,
  });
  return connection;
}

export async function getSalesforceConnection(): Promise<Connection> {
  if (!connection) {
    throw new Error(
      'Salesforce API connection is not initialized. Authenticate the Salesforce API before running SOQL.',
    );
  }

  return connection;
}
