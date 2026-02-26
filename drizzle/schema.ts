import { DAYS_OF_WEEK_IN_ORDER } from "@/constants";
import { relations } from "drizzle-orm";
import { pgTable, boolean, integer, text, uuid, timestamp, index, pgEnum } from "drizzle-orm/pg-core";

const createdAt = timestamp("createdAt").notNull().defaultNow()
const updatedAt = timestamp("updatedAt").notNull().defaultNow().$onUpdate(() => new Date())

export const EventTable = pgTable(
    "events",
    {
        id: uuid("id").primaryKey().defaultRandom(), // creates a id as a uuid, sets as a primary key and fills it qith default random value generated with the uuid
        name: text("name").notNull(),
        description: text("description"),
        durationInMinutes: integer("durationInMinutes").notNull(),
        clerkUserId: text("clerkUserId").notNull(),
        isActive: boolean("IsActive").notNull().default(true),
        createdAt,
        updatedAt
    },
    table => ([
        index("clerlUserIdIndex").on(table.clerkUserId), //index on clerUserId for faster quereying
    ])
)

export const ScheduleTable = pgTable(
    "schedules",
    {
        id: uuid("id").primaryKey().defaultRandom(), // creates a id as a uuid, sets as a primary key and fills it qith default random value generated with the uuid
        timezone: text("timezone").notNull(),
        clerkUserId: text("clerkUserId").notNull(),
        createdAt,
        updatedAt
    }
)

//Define relationships for ScheduleTable: a schedule has many availabilities
export const scheduleRelations = relations(ScheduleTable,
    ({many}) => ({availabilities: many(ScheduleAvailabilityTable)})
)

    export const scheduleDayOfWeekEnum = pgEnum("day", DAYS_OF_WEEK_IN_ORDER)

export const ScheduleAvailabilityTable = pgTable(
    "scheduleAvailabilties",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        scheduleId: uuid("scheduleId").notNull().references(() => ScheduleTable.id, {onDelete: "cascade"}), //foreign key
        startTime: text("startTime").notNull(),
        endTime: text("endTime").notNull(),
        dayOfWeek: scheduleDayOfWeekEnum("dayOfWeek").notNull()
    },
    table => ([
        index("scheduleIdIndex").on(table.scheduleId)
    ])
)

//Define reverse relation each availability belongs to a schedule
export const scheduleAvailabilityRalations = relations(
    ScheduleAvailabilityTable,
    ({one}) => ({
        schedule: one(ScheduleTable, {
            fields: [ScheduleAvailabilityTable.scheduleId], //local key
            references: [ScheduleTable.id]// foreign key
        }

        )
    })
)