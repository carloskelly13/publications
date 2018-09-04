import { pg } from "./models";

const dropTables = async function() {
  try {
    await pg.schema.dropTableIfExists("shapes");
    await pg.schema.dropTableIfExists("pages");
    await pg.schema.dropTableIfExists("documents");
    await pg.schema.dropTableIfExists("users");
  } catch (e) {
    console.log(e);
  }
  return null;
};

const createTables = async function() {
  try {
    await pg.schema.createTable("users", table => {
      table.increments();
      table.string("user_name").unique();
      table.string("password_hash");
    });
    await pg.schema.createTable("documents", table => {
      table.increments();
      table.bigInteger("user_id").unsigned();
      table.foreign("user_id").references("users.id");
      table.string("name");
      table.timestamps();
    });
    await pg.schema.createTable("pages", table => {
      table.increments();
      table.bigInteger("document_id").unsigned();
      table.foreign("document_id").references("documents.id");
      table.integer("page_number");
      table.float("width");
      table.float("height");
    });
    await pg.schema.createTable("shapes", table => {
      table.increments();
      table.bigInteger("page_id").unsigned();
      table.foreign("page_id").references("pages.id");
      table.string("type");
      table.float("width");
      table.float("height");
      table.float("x");
      table.float("y");
      table.integer("z");
      table.float("r");
      table.string("fill");
      table.float("fill_opacity");
      table.string("stroke");
      table.float("stroke_width");
      table.float("stroke_opacity");
      table.text("text");
    });
  } catch (e) {
    console.log(e);
  }
  return null;
};

const migrateDB = async function() {
  try {
    await dropTables();
    await createTables();
    console.log("Publications DB created.");
  } catch (e) {
    console.log(e);
  }
  process.exit();
};

migrateDB();
