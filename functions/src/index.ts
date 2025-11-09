import * as admin from 'firebase-admin';

require('firebase-functions/logger/compat');

admin.initializeApp();

export * as messaging from './messaging';
