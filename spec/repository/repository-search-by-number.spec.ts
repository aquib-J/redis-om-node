import Globals from '../helpers/globals';
import { addBigfootSighting, createBigfootSchema, expectMatchesSighting, sortByEntityId, Bigfoot,
  A_BIGFOOT_SIGHTING, AN_ENTITY_ID, AN_ENTITY_KEY,
  ANOTHER_BIGFOOT_SIGHTING, ANOTHER_ENTITY_ID, ANOTHER_ENTITY_KEY,
  A_THIRD_BIGFOOT_SIGHTING, A_THIRD_ENTITY_ID, A_THIRD_ENTITY_KEY } from '../helpers/bigfoot-data-helper';
  
import Client from '../../lib/client';
import Schema from '../../lib/schema/schema';
import Repository from '../../lib/repository/repository';

const globals: Globals = (globalThis as unknown) as Globals;

describe("Repository", () => {

  let client: Client;
  let repository: Repository<Bigfoot>;
  let schema: Schema<Bigfoot>;
  let entities: Bigfoot[];

  beforeAll(() => {
    client = globals.client;
    schema = createBigfootSchema();
  });

  beforeEach(async () => {
    repository = client.fetchRepository<Bigfoot>(schema);
    await repository.createIndex();
  });

  describe("#search", () => {
    beforeEach(async () => {
      await addBigfootSighting(client, AN_ENTITY_KEY, A_BIGFOOT_SIGHTING);
      await addBigfootSighting(client, ANOTHER_ENTITY_KEY, ANOTHER_BIGFOOT_SIGHTING);
      await addBigfootSighting(client, A_THIRD_ENTITY_KEY, A_THIRD_BIGFOOT_SIGHTING);
    });

    describe("finding a number that equals a number", () => {
      beforeEach(async () => {
        entities = await repository.search()
          .where('temperature').eq(75)
          .run();
        entities.sort(sortByEntityId);
      });

      it("returns all the entities matching that number", () => {
        expect(entities).toHaveLength(1);
        expectMatchesSighting(entities[0], AN_ENTITY_ID, A_BIGFOOT_SIGHTING);
      });
    });

    describe("finding a number that is greater than a number", () => {
      beforeEach(async () => {
        entities = await repository.search()
          .where('temperature').gt(87)
          .run();
        entities.sort(sortByEntityId);
      });

      it("returns all the entities greater than that number", () => {
        expect(entities).toHaveLength(1);
        expectMatchesSighting(entities[0], A_THIRD_ENTITY_ID, A_THIRD_BIGFOOT_SIGHTING);
      });
    });

    describe("finding a number that is greater than or equal to a number", () => {
      beforeEach(async () => {
        entities = await repository.search()
          .where('temperature').gte(87)
          .run();
        entities.sort(sortByEntityId);
      });

      it("returns all the entities greater than or equal to that number", () => {
        expect(entities).toHaveLength(2);
        expectMatchesSighting(entities[0], ANOTHER_ENTITY_ID, ANOTHER_BIGFOOT_SIGHTING);
        expectMatchesSighting(entities[1], A_THIRD_ENTITY_ID, A_THIRD_BIGFOOT_SIGHTING);
      });
    });

    describe("finding a number that is less than a number", () => {
      beforeEach(async () => {
        entities = await repository.search()
          .where('temperature').lt(87)
          .run();
        entities.sort(sortByEntityId);
      });

      it("returns all the entities less than that number", () => {
        expect(entities).toHaveLength(1);
        expectMatchesSighting(entities[0], AN_ENTITY_ID, A_BIGFOOT_SIGHTING);
      });
    });

    describe("finding a number that is less than or equal to a number", () => {
      beforeEach(async () => {
        entities = await repository.search()
          .where('temperature').lte(87)
          .run();
        entities.sort(sortByEntityId);
      });

      it("returns all the entities less than or equal to that number", () => {
        expect(entities).toHaveLength(2);
        expectMatchesSighting(entities[0], AN_ENTITY_ID, A_BIGFOOT_SIGHTING);
        expectMatchesSighting(entities[1], ANOTHER_ENTITY_ID, ANOTHER_BIGFOOT_SIGHTING);
      });
    });

    describe("finding a number that is between a pair of numbers", () => {
      beforeEach(async () => {
        entities = await repository.search()
          .where('temperature').between(75, 87)
          .run();
        entities.sort(sortByEntityId);
      });

      it("returns all the entities in that range", () => {
        expect(entities).toHaveLength(2);
        expectMatchesSighting(entities[0], AN_ENTITY_ID, A_BIGFOOT_SIGHTING);
        expectMatchesSighting(entities[1], ANOTHER_ENTITY_ID, ANOTHER_BIGFOOT_SIGHTING);
      });
    });
  });
});
