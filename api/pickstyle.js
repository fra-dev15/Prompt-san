import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // CORSヘッダーの設定（GitHub Pagesなどの外部Webサイトからのアクセスを許可）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // URLパラメータから抽出数 (count) を取得（デフォルトは2件）
  const count = parseInt(req.query.count || '2', 10);

  try {
    // 環境変数からNeonの接続文字列を取得して接続
    const sql = neon(process.env.DATABASE_URL);

    // DBからランダムに指定件数 (count) を抽出
    const rows = await sql`
      SELECT prompt_name FROM ms_artists 
      ORDER BY RANDOM() 
      LIMIT ${count}
    `;

    // 取得したデータから prompt_name の配列を作成
    const items = rows.map(row => row.prompt_name);

    // JSON形式で結果を返す
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Database error' });
  }
}
