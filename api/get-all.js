import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // 提示してくれた通り、3つのカラムを取得するSQL
    const rows = await sql`
      SELECT
          id,
          prompt_name,
          official_name
      FROM
          ms_artists
      ORDER BY
          id ASC
    `;

    // 今までは文字列の配列だったけど、オブジェクトの配列（そのまま全プロパティ）を返すようにする
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Database error: ' + error.message });
  }
}
