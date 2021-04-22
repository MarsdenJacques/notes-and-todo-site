import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

import {connection} from "../../lib/db.js"

export default withApiAuthRequired(async (req, res) => {
  const { user } = getSession(req, res);
  if(user)
  {
    var conn = await connection;
    if(req.method === 'GET')
    {
      const { id } = req.query
      return Get(conn, id, req, res)
    }
    return res.status(404)
  }
  return res.status(401)
});

async function Get(conn, id, req, res)
{
  const [data] = await conn.query(
    'SELECT notes.title AS title, notes.content AS content FROM notes WHERE notes.id = ?',
    [id]
  );
  return res.status(200).json(data)
}