import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

import {connection} from "../../lib/db.js"

export default withApiAuthRequired(async (req, res) => {
  const { user } = getSession(req, res);
  var conn = await connection;
  if(user)
  {
    if(req.method === 'GET')
    {
      return Get(conn, req, res)
    }
    return res.status(404)
  }
  return res.status(401)
});

async function Get(conn, req, res)
{
  const [data] = await conn.query(
    'SELECT notes.id AS id, notes.title AS title, notes.content AS content FROM notes'
  );
  return res.status(200).json(data)
}