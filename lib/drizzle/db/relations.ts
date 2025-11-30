import { relations } from "drizzle-orm/relations";
import { companies, interviewSessions, customHrQuestions, customTechnicalQuestions } from "./schema";

export const interviewSessionsRelations = relations(interviewSessions, ({one}) => ({
	company: one(companies, {
		fields: [interviewSessions.companyId],
		references: [companies.companyId]
	}),
}));

export const companiesRelations = relations(companies, ({many}) => ({
	interviewSessions: many(interviewSessions),
	customHrQuestions: many(customHrQuestions),
	customTechnicalQuestions: many(customTechnicalQuestions),
}));

export const customHrQuestionsRelations = relations(customHrQuestions, ({one}) => ({
	company: one(companies, {
		fields: [customHrQuestions.companyId],
		references: [companies.companyId]
	}),
}));

export const customTechnicalQuestionsRelations = relations(customTechnicalQuestions, ({one}) => ({
	company: one(companies, {
		fields: [customTechnicalQuestions.companyId],
		references: [companies.companyId]
	}),
}));