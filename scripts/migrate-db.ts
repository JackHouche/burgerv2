import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { getLocalDb } from '../lib/db/client';

async function migrateDatabase() {
  console.log('🏗️ Application des migrations...');

  try {
    const db = getLocalDb();

    await migrate(db, { migrationsFolder: './drizzle' });

    console.log('✅ Migrations appliquées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors des migrations :', error);
    process.exit(1);
  }
}

if (require.main === module) {
  migrateDatabase();
}

export { migrateDatabase };
