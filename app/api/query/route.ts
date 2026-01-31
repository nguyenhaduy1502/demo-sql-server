import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';

// SQL Server configuration from environment variables
const config = {
  server: process.env.DB_SERVER || '',
  database: process.env.DB_DATABASE || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false',
    enableArithAbort: true,
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = body?.query;
    const singleBatch = body?.singleBatch === true;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Single batch: run entire script as one batch (for CURSOR, etc.)
    const queries = singleBatch
      ? [query.trim()]
      : query
          .split(';')
          .map((q: string) => q.trim())
          .filter((q: string) => q.length > 0);

    if (queries.length === 0) {
      return NextResponse.json(
        { error: 'No valid queries found' },
        { status: 400 }
      );
    }

    // Create connection pool
    const pool = await sql.connect(config);
    
    const results: any[] = [];
    let queryIndex = 0;

    try {
      // Execute each query
      for (const singleQuery of queries) {
        queryIndex++;
        try {
          const result = await pool.request().query(singleQuery);
          
          // Determine if this is a SELECT query (has recordset) or DML query (INSERT/UPDATE/DELETE)
          const isSelectQuery = result.recordset && result.recordset.length >= 0;
          const rowsAffected = result.rowsAffected?.[0] || 0;

          results.push({
            queryIndex,
            query: singleQuery,
            success: true,
            data: result.recordset || [],
            rowsAffected: rowsAffected,
            isSelectQuery: isSelectQuery && result.recordset.length > 0,
          });
        } catch (queryError: any) {
          results.push({
            queryIndex,
            query: singleQuery,
            success: false,
            error: queryError.message || 'An error occurred executing this query',
          });
        }
      }
    } finally {
      // Close connection pool
      await pool.close();
    }

    return NextResponse.json({
      success: true,
      results: results,
      totalQueries: queries.length,
    });
  } catch (error: any) {
    console.error('SQL Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An error occurred executing the query',
      },
      { status: 500 }
    );
  }
}

