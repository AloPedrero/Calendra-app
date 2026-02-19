// Initialiaze the drizzle function
import { drizzle } from "drizzle-orm/neon-http";
// Initialiaze the Neon cluient using the DATABASE_URL from the .env
import { neon } from "@neondatabase/serverless";
// Initialiaze the import of the schema file
import * as schema from "./schema"

const sql = neon(process.env.DATABASE_URL!)

//Create and export the Drizzle ORM instance, tith the neon client and schema for type-safe queries
export const db = drizzle(sql, { schema })