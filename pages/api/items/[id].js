// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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
    if(req.method === 'DELETE')
    {
      return Delete(conn, id, req, res, user)
    }
    return res.status(404)
  }
  return res.status(404)
});


async function Get(conn, id, req, res, user)
{
  const [data] = await conn.query(
    'SELECT items.id AS id, taxonomies.title AS taxonomy, items.item_id AS itemId FROM items JOIN taxonomies ON items.taxonomy = taxonomies.id WHERE id = ? AND user = ?',
    [id, user.sub]
  );
  return res.status(200).json(data)
}

async function Delete(conn, id, req, res, user)
{
  var json = JSON.parse(req.body)
  var itemId = parseInt(json.itemId)
  if(json.type === 'notes')
  {
    const [data] = await conn.query(
      'DELETE FROM notes WHERE id = ?; DELETE FROM items WHERE id = ?', //also delete from items, also get id from items.id, join tables for first delete to check user sub
      [itemId,id],
    );
    return res.status(200).json(data)
  }
  else
  {
    var json = JSON.parse(req.body)
    const [data] = await conn.query(
      'DELETE FROM todo WHERE id = ?; DELETE todo_item FROM todo_items JOIN todo_item ON todo_items.todoitem_id = todo_item.id WHERE todo_items.todo_id = ?; DELETE FROM items WHERE id = ?', //also delte from items also get id form items.id
      [itemId,itemId,id],
    );
    return res.status(200).json(data)
  }
}