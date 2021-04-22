// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

import {connection} from "../../lib/db.js"

export default withApiAuthRequired(async (req, res) => {
  const { user } = getSession(req, res);
  if(user)
  {
    var conn = await connection;
    if(req.method === 'GET')
    {
      return Get(conn, req, res, user)
    }
    if(req.method === 'POST')
    {
      return Post(conn,req,res, user)
    }
    return res.status(404)
  }
  return res.status(401)
});

async function Get(conn, req, res, user)
{
  const [data] = await conn.query(
    'SELECT items.id AS id, taxonomies.title AS taxonomy, items.item_id AS itemId FROM items JOIN taxonomies ON items.taxonomy = taxonomies.id WHERE user = ?',
    [user.sub]
  );
  return res.status(200).json(data)
}

async function Post(conn, req, res, user)
{
  var json = JSON.parse(req.body)
    if(json.taxonomy === 1)
    {
      const [data] = await conn.query(
        'INSERT INTO notes VALUES (NULL,?,?); INSERT INTO items VALUES (NULL,1,LAST_INSERT_ID(),?);',
        ['note', 'content', user.sub]
      );
      return res.status(200).json(data)
    }
    else
    {
      const [data] = await conn.query(
        'INSERT INTO todo VALUES (NULL,?); INSERT INTO items VALUES (NULL,2,LAST_INSERT_ID(),?)',
        ['todo', user.sub]
      );
      return res.status(200).json(data)
    }
}