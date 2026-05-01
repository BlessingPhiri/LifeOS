import { Client } from 'pg';

const defaultUserId = process.env.LIFEOS_USER_ID || '00000000-0000-0000-0000-000000000001';

function withClient(fn) {
  return async (...args) => {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    try {
      return await fn(client, ...args);
    } finally {
      await client.end();
    }
  };
}

export const importFinanceTransactions = withClient(async (client, transactions = []) => {
  await client.query('begin');
  try {
    for (const tx of transactions) {
      await client.query(
        `insert into transactions (id, user_id, tx_date, description, category, amount, tx_type, source)
         values ($1,$2,$3,$4,$5,$6,$7,$8)
         on conflict (id) do update
         set tx_date=excluded.tx_date,
             description=excluded.description,
             category=excluded.category,
             amount=excluded.amount,
             tx_type=excluded.tx_type,
             source=excluded.source`,
        [
          tx.id,
          defaultUserId,
          tx.date || null,
          tx.description || null,
          tx.category || null,
          Number(tx.amount || 0),
          tx.type || 'expense',
          'google_sheet'
        ]
      );
    }

    await client.query('commit');
    return { imported: transactions.length };
  } catch (error) {
    await client.query('rollback');
    throw error;
  }
});

export const listTransactions = withClient(async (client, limit = 100) => {
  const result = await client.query(
    `select id, tx_date, description, category, amount, tx_type
     from transactions where user_id = $1
     order by tx_date desc nulls last, created_at desc
     limit $2`,
    [defaultUserId, limit]
  );

  return result.rows.map((row) => ({
    id: row.id,
    date: row.tx_date,
    description: row.description,
    category: row.category,
    amount: Number(row.amount),
    type: row.tx_type
  }));
});


export const upsertHabitDefinition = withClient(async (client, habit) => {
  await client.query(
    `insert into habit_definitions (id, user_id, name, color, icon)
     values ($1,$2,$3,$4,$5)
     on conflict (id, user_id) do update
     set name=excluded.name,
         color=excluded.color,
         icon=excluded.icon`,
    [habit.id, defaultUserId, habit.name, habit.color || null, habit.icon || null]
  );

  return habit;
});

export const insertHabitLog = withClient(async (client, log) => {
  await client.query(
    `insert into habit_logs (user_id, habit_id, log_date, completed)
     values ($1,$2,$3,$4)`,
    [defaultUserId, log.habitId, log.date, Boolean(log.completed)]
  );

  return log;
});

export const insertQuickCapture = withClient(async (client, capture) => {
  await client.query(
    `insert into quick_captures (id, user_id, capture_type, payload)
     values ($1,$2,$3,$4::jsonb)
     on conflict (id) do nothing`,
    [capture.id, defaultUserId, capture.type, JSON.stringify(capture.value || {})]
  );

  return capture;
});
