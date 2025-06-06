import { MongoClient, ObjectId } from 'mongodb';
import { Classification, Duplicate, Entity, Incident, Report, Submission, Subscription, User, Notification, History_Report, History_Incident, Checklist } from './generated/graphql';
import { IncomingMessage } from 'http';

export interface Context {
  user: {
    id: string,
    roles: string[],
  } | null,
  req: IncomingMessage,
  client: MongoClient,
}

export type DBIncident = Omit<Incident, 'AllegedDeployerOfAISystem' | 'AllegedDeveloperOfAISystem' | 'AllegedHarmedOrNearlyHarmedParties' | 'reports' | 'editors' | 'implicated_systems'>
  & { "Alleged deployer of AI system": string[], "Alleged developer of AI system": string[], "Alleged harmed or nearly harmed parties": string[], implicated_systems: string[] }
  & { reports: number[] }
  & { editors: string[] }

export type DBIncidentHistory = Omit<History_Incident, '__typename' | 'AllegedDeployerOfAISystem' | 'AllegedDeveloperOfAISystem' | 'AllegedHarmedOrNearlyHarmedParties' | 'implicated_systems'>
  & { "Alleged deployer of AI system": string[], "Alleged developer of AI system": string[], "Alleged harmed or nearly harmed parties": string[], implicated_systems: string[] };

export type DBEntity = Entity;

export type DBDuplicate = Duplicate;

export type DBClassification = Omit<Classification, 'incidents' | 'reports'>
  & { incidents: number[] }
  & { reports: number[] }

export type DBReport = Omit<Report, 'user'>
  & { user: string }

export type DBReportHistory = Omit<History_Report, '__typename'>;

export type DBUser = Omit<User, 'adminData'>;

export type DBSubmission = Omit<Submission, 'developers' | 'deployers' | 'harmed_parties' | 'user' | 'incident_editors' | 'implicated_systems'>
  & { developers: string[] }
  & { deployers: string[] }
  & { harmed_parties: string[] }
  & { user: string }
  & { incident_editors: string[] }
  & { implicated_systems: string[] }


export type SubscriptionTypes = 'incident' | 'new-incidents' | 'entity' | 'submission-promoted' | 'ai-briefing';

export type DBSubscription = Omit<Subscription, 'entityId' | 'incident_id' | 'userId' | 'type'>
  & { entityId?: string, incident_id?: number, userId: string, type: SubscriptionTypes };

export type NotificationTypes = 'new-report-incident' | 'incident-updated' | 'entity' | 'new-incidents' | 'submission-promoted' | 'ai-briefing'

export type DBNotification = Omit<Notification, 'userId'> & { userId?: string, type: NotificationTypes }

export type DBChecklist = Checklist;

export type DBEntityDuplicate = {
  _id: ObjectId;
  duplicate_entity_id: string;
  true_entity_id: string;
}