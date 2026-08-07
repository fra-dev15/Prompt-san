import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // 最初に必ずCORSヘッダーを設定する
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // プリフライトリクエスト（OPTIONS）への即時応答
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 環境変数からNeonの接続文字列を取得して接続
    const sql = neon(process.env.DATABASE_URL);

    // DBから全件取得
    const rows = await sql`
      SELECT * FROM ms_artists 
      ORDER BY id ASC
    `;

    // 取得したデータから prompt_name の配列を作成
    const items = rows.map(row => row.prompt_name);

    // JSON形式で結果を返す
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error(error);
    // エラー時でもCORSヘッダーが落ちないようにしつつ返す
    return res.status(500).json({ success: false, error: 'Database error: ' + error.message });
  }
}
