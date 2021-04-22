import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

import {connection} from "../../../lib/db.js"

export default withApiAuthRequired(async (req, res) => {
  const { user } = getSession(req, res);
  if(user)
  {
    var conn = await connection;
    const { id } = req.query
    if(req.method === 'GET')
    {
      return Get(conn, id, req, res, user)
    }
    if(req.method === 'PATCH')
    {
      return Patch(conn, id, req, res, user)
    }
    if(req.method === 'DELETE')
    {
      return Delete(conn, id, req, res, user)
    }
    return res.status(404)
  }
  return res.status(401)
});

async function Get(conn, id, req, res, user)
{
  const [data] = await conn.query(
    'SELECT notes.title AS title, notes.content AS content FROM notes WHERE notes.id = ?',
    [id]
  );
  return res.status(200).json(data)
}

async function Patch(conn, id, req, res, user)
{
  var json = JSON.parse(req.body)
  if(json.edit === 'title')
  {
    const [data] = await conn.query(
      'UPDATE notes SET title = ? WHERE id = ?',
      [json.newVal, id],
    );
    return res.status(200).json(data)
  }
  if(json.edit === 'text')
  {
    const [data] = await conn.query(
      'UPDATE notes SET content = ? WHERE id = ?',
      [json.newVal, id],
    );
    return res.status(200).json(data)
  }
  return res.status(404)
}

async function Delete(conn, id, req, res, user)
{
  const [data] = await conn.query(
    'DELETE FROM notes WHERE id = ?',
    [id],
  );
  return res.status(200).json(data)
}