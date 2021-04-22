import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

import {connection} from "../../../lib/db.js"

export default withApiAuthRequired(async (req, res) => {
  const { user } = getSession(req, res);
  if(user)
  {
    const conn = await connection;
    const { id } = req.query
    if(req.method === 'GET')
    {
      return Get(conn, id, req, res, user)
    }
    else if(req.method === 'POST')
    {
      return Post(conn, id, req, res, user)
    }
    else if(req.method === 'PATCH')
    {
      return Patch(conn, id, req, res, user)
    }
    else if(req.method === 'DELETE')
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
    'SELECT todo.title AS title FROM todo WHERE id = ?; SELECT todo_item.title AS item, todo_item.state AS state, todo_item.id AS id FROM todo_items JOIN todo_item ON todo_items.todoitem_id = todo_item.id WHERE todo_items.todo_id = ?',
    [id,id]
  );
  return res.status(200).json(data)
}


async function Post(conn, id, req, res, user)
{
  const [data] = await conn.query(
    'INSERT INTO todo_item VALUES (NULL,?,?); INSERT INTO todo_items VALUES (NULL,LAST_INSERT_ID(),?);',
    [0, '', id]
  );
  return res.status(200).json(data)
}


async function Patch(conn, id, req, res, user)
{
  var json = JSON.parse(req.body)
  if(json.type === 'item')
  {
    if(json.edit === 'title')
    {
      const [data] = await conn.query(
      'UPDATE todo_item SET title = ? WHERE id = ?',
      [json.newVal, id]);
      return res.status(200).json(data)
    }
    if(json.edit === 'state')
    {
      var state = parseInt(json.newVal)
      const [data] = await conn.query(
        'UPDATE todo_item SET state = ? WHERE id = ?',
        [state, id]);
      return res.status(200).json(data)
    }
    return res.status(404)
  }
  if(json.type === 'todo')
  {
    const [data] = await conn.query(
      'UPDATE todo SET title = ? WHERE id = ?',
      [json.newVal, id]);
    return res.status(200).json(data)
  }
  return res.status(404)
}


async function Delete(conn, id, req, res, user)
{
  var json = JSON.parse(req.body)
  const [data] = await conn.query(
    'DELETE FROM todo_item WHERE id = ?; DELETE FROM todo_items WHERE todoitem_id = ?',
    [json.itemId, json.itemId]);
  return res.status(200).json(data)
}