import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required!');
  console.error('📝 Please create a .env file with your Neon database URL:');
  console.error('   DATABASE_URL=postgresql://username:password@hostname:port/database?sslmode=require');
  console.error('🔗 Get your URL from: https://console.neon.tech/');
  process.exit(1);
}

export const sql = neon(process.env.DATABASE_URL);

// Helper function to execute queries with better error handling
export const executeQuery = async (query: string, params: any[] = []) => {
  try {
    const result = await sql(query, ...params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Helper function for single row queries
export const executeSingleQuery = async (query: string, params: any[] = []) => {
  const result = await executeQuery(query, params);
  return result[0];
};

export default sql;
