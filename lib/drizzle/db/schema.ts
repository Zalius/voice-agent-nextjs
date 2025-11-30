import { pgTable, index, foreignKey, unique, serial, varchar, jsonb, timestamp, boolean, text, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const interviewSessions = pgTable("interview_sessions", {
	id: serial().primaryKey().notNull(),
	sessionId: varchar("session_id", { length: 100 }).notNull(),
	companyId: varchar("company_id", { length: 100 }),
	candidateName: varchar("candidate_name", { length: 255 }),
	interviewData: jsonb("interview_data"),
	status: varchar({ length: 50 }).default('active'),
	startedAt: timestamp("started_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	endedAt: timestamp("ended_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_session_company").using("btree", table.companyId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.companyId],
			name: "interview_sessions_company_id_fkey"
		}),
	unique("interview_sessions_session_id_key").on(table.sessionId),
]);

export const interviewSettings = pgTable("interview_settings", {
	id: serial().primaryKey().notNull(),
	companyId: varchar("company_id", { length: 100 }).notNull(),
	interviewField: varchar("interview_field", { length: 100 }).notNull(),
	conversationFlow: varchar("conversation_flow", { length: 50 }).default('standard').notNull(),
	includeHr: boolean("include_hr").default(true),
	includeTechnical: boolean("include_technical").default(true),
	strictnessLevel: varchar("strictness_level", { length: 20 }).default('moderate'),
	voice: varchar({ length: 50 }).default('sage'),
	language: varchar({ length: 10 }).default('fa'),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_company_id").using("btree", table.companyId.asc().nullsLast().op("text_ops")),
	unique("interview_settings_company_id_key").on(table.companyId),
]);

export const companies = pgTable("companies", {
	id: serial().primaryKey().notNull(),
	companyId: varchar("company_id", { length: 100 }).notNull(),
	companyName: varchar("company_name", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	unique("companies_company_id_key").on(table.companyId),
]);

export const customHrQuestions = pgTable("custom_hr_questions", {
	id: serial().primaryKey().notNull(),
	companyId: varchar("company_id", { length: 100 }).notNull(),
	questionText: text("question_text").notNull(),
	orderIndex: integer("order_index").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	ask: boolean().default(true),
	field: varchar({ length: 100 }),
}, (table) => [
	index("idx_hr_questions_company").using("btree", table.companyId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.companyId],
			name: "custom_hr_questions_company_id_fkey"
		}).onDelete("cascade"),
]);

export const customTechnicalQuestions = pgTable("custom_technical_questions", {
	id: serial().primaryKey().notNull(),
	companyId: varchar("company_id", { length: 100 }).notNull(),
	questionText: text("question_text").notNull(),
	orderIndex: integer("order_index").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	ask: boolean().default(true),
	field: varchar({ length: 100 }),
}, (table) => [
	index("idx_tech_questions_company").using("btree", table.companyId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.companyId],
			name: "custom_technical_questions_company_id_fkey"
		}).onDelete("cascade"),
]);
