import {useState, useEffect} from 'react'
import style from './note.module.css'

export default function Note(props){
    const [edited, setEdited] = useState([])
    const [id, setId] = useState(-1)
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [editing, setEditing] = useState('no')

    useEffect(() => {
        setId(props.itemId)
        fetch('/api/notes/' + props.itemId, {
            method: 'GET'
          })
          .then((res) => res.json())
          .then((data) => {data.map((note) => {setTitle(note.title); setText(note.content)})})
    },[])
    useEffect(() => {
        if(edited.length > 0)
        {
            if(id > 0)
            {
                var edits = edited.slice()
                var change = edits.shift()
                setEdited(edits)
                var body = JSON.stringify({
                    id: change.id, edit: change.edit, newVal: change.newVal
                });
                fetch('/api/notes/' + id,{
                    method: 'PATCH',
                    body: body
                }).then((res) => {
                    if(res.status === 200)
                    {
                        if(change.edit === 'title')
                        {
                            console.log(change.newVal)
                            setTitle(change.newVal)
                        }
                        else
                        {
                            setText(change.newVal)
                        }
                    }
                    else{
                        console.log('error')
                    }
                })
            }
            else
            {
                console.log('not a valid id')
            }
        }
    },[edited])


    function Delete()
    {
        props.DeleteItem(props.id, id, 'notes')
    }

    const EditTitle = (e) =>{
        e.preventDefault()
        setEditing('no')
        var edits = edited.slice()
        edits.push({id: id, edit: 'title', newVal: e.target.firstChild.value})
        setEdited(edits)
    }

    const EditText = (e) =>{
        e.preventDefault()
        setEditing('no')
        var edits = edited.slice()
        edits.push({id: id, edit: 'text', newVal: e.target.firstChild.value})
        setEdited(edits)
    }

    return(
        <section className = {style.content}>
            <h1 className = {style.title}>
                <div onClick = {() => setEditing('title')}>{editing === 'title' ? 
                <form onSubmit = {EditTitle}>
                    <input type = 'text' defaultValue = {title}autoFocus/>
                    <button input-type = 'submit'>Save</button>
                </form> : 
                <p>{title}</p>}</div>
            </h1>
            <div  className = {style.text}>
                <div onClick = {() => setEditing('text')}>{
                    editing === 'text' ? 
                    <form onSubmit = {EditText}>
                        <input type = 'text' defaultValue = {text} autoFocus/>
                        <button input-type = 'submit'>Save</button>
                    </form> : 
                    <p>{text}</p>
                }</div>
            </div>
            <button onClick = {() => Delete()} className = {style.delete}>Delete</button>
        </section>
    )
}