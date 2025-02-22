import config from '../../config';
import { MongoClient } from 'mongodb';
import { Translate } from '@google-cloud/translate/build/src/v2';
import IncidentTranslator from './incidentTranslator';
import { getLanguages } from '../../i18n';

export const translateIncidents = async () => {
  console.log('Translating incidents...');

  let mongoClient: MongoClient | null = null;

  mongoClient = new MongoClient(config.mongodb.translationsConnectionString || '');
  try {
    await mongoClient.connect();
  } catch (mongoError: any) {
    throw new Error(`Error connecting to MongoDB: ${mongoError.message}`);
  }

  if (!config.i18n.translateApikey) {
    throw new Error('Google Translate API (GOOGLE_TRANSLATE_API_KEY) key is missing.');
  }

  const translateClient = new Translate({ key: config.i18n.translateApikey });

  const translator = new IncidentTranslator({
    mongoClient,
    translateClient,
    languages: getLanguages()
      .filter((language) => language.code !== 'en')
      .map((l) => l.code), // We do not translate to English since it's the source language
    reporter: {
      log: console.log,
      error: console.error,
      warn: console.warn,
    },
  });

  // Execute the translation process
  await translator.run();

  try {
    await mongoClient.close();
    console.log('MongoDB connection closed gracefully.');
  } catch (closeError: any) {
    throw new Error(`Error closing MongoDB connection: ${closeError.message}`);
  }
};

export const run = async () => {
  try {
    await translateIncidents();
    console.log('Translation completed successfully.');
    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(1);
  }
};

if (require.main === module) {
  run();
}
