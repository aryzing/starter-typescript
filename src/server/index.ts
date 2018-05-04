import { performance } from 'perf_hooks';
import sourceMapSupport from 'source-map-support';

import dgraph from 'dgraph-js';
import grpc from 'grpc';
import name from './myModule';

sourceMapSupport.install();

/* Setting up the connection */
const clientStub: dgraph.DgraphClientStub = new dgraph.DgraphClientStub(
  'localhost:9080',
  grpc.credentials.createInsecure(),
);

const dgraphClient: dgraph.DgraphClient = new dgraph.DgraphClient(clientStub);

/** Setting up the database schema */
async function databaseSetup() {
  const schema = 'name: string @index(exact) .';
  const op = new dgraph.Operation();
  op.setSchema(schema);
  await dgraphClient.alter(op);
}

const a = { a: 'foo' };

if (a) {
  console.log('foo');
}

/* Completely wipe database */
async function clearDatabase() {
  const op = new dgraph.Operation();
  op.setDropAll(true);
  await dgraphClient.alter(op);
}

/* Transaction: create a user */
async function createtUser(name: string) {
  const p = { name };
  const txn = dgraphClient.newTxn();
  const mu = new dgraph.Mutation();
  mu.setSetJson(p);
  try {
    await txn.mutate(mu);
    await txn.commit();
  } catch (e) {
    console.log(e);
  } finally {
    await txn.discard();
  }
}

/* Transaction: search for user */
async function searchUser(name: string) {
  const query = `
    query all($name: string) {
      all(func: eq(name, $name)) {
        name
      }
    }
  `;
  const vars = { $name: name };
  const txn = dgraphClient.newTxn();
  try {
    const res = await txn.queryWithVars(query, vars);
    const ppl = res.getJson();

    console.log(`Number of people named ${name}: ${ppl.all.length}.`);
  } catch (e) {
    console.log(e);
  } finally {
    await txn.discard();
  }
}

async function operations() {
  const origin = performance.now();
  console.log('Before all: ', origin);

  await clearDatabase();

  const afterClearDatabase = performance.now();
  console.log('Time to clear: ', afterClearDatabase - origin);

  await databaseSetup();

  const afterDatabaseSetup = performance.now();
  console.log(
    'Time to set up database: ',
    afterDatabaseSetup - afterClearDatabase,
  );

  await createtUser(name);

  const afterCreateUser = performance.now();
  console.log('Time to create user: ', afterCreateUser - afterDatabaseSetup);

  await searchUser('Eduard');

  const afterQuery = performance.now();
  console.log('Time to query user: ', afterQuery - afterCreateUser);

  // Close connection and free resources
  clientStub.close();
}

operations();
