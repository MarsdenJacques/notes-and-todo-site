import Link from 'next/Link'
import {useState, useEffect} from 'react'
import { useUser } from '@auth0/nextjs-auth0';
import Note from '../components/note.js'
import Todo from '../components/todo.js'
import Toggle from '../components/state-toggle.js'
import style from './index.module.css'



//don't state and effect for adding/removing items, instead just update db and items from the add/delete functions
//pass deleteitemn as callback to item for delete? yes

export default function Home(props)
{

    const { user, error, isLoading } = useUser();

    const [loadingState, setloadingState] = useState('notLoaded')
    const [loaded, setLoaded] = Toggle()
    const [items, setItems] = useState([])

    useEffect(() => {
        if(loaded){setLoaded()}
        if(user)
        {
            loadingState === 'load' ? null : setloadingState('load')
        }
        else
        {
            setloadingState('notLoaded')
        }
    }, [])

    useEffect(() => {
        if(user)
        {
            loadingState === 'load' ? null : setloadingState('load')
        }
        else
        {
            setloadingState('notLoaded')
        }
    },[user])

    useEffect(() => { //change to using "hasLoad" and "noLoad" state plus "loaded" and "not loaded" states
        if(loadingState === 'load')
        {
            fetch('/api/items',{
                method: 'GET'
            })
                .then((res) => {
                    if(res.status !== 200){
                        console.log('status not 200')
                        return null
                    }
                    return res.json()
                })
                .then((data) => {
                    if(data !== null)
                    {
                        if(loadingState === 'load')//&& successful
                        {
                            setItems(data)
                            setloadingState('loaded')
                            if(!loaded){setLoaded()}
                        }
                        else
                        {
                            console.log('error or canceled')
                            setItems([])
                            setloadingState('notLoaded')
                        }
                    }
                    else
                    {
                        console.log('error, no data')
                    }
                })
                .catch((res) => console.log(res))
        }
    }, [loadingState])

    function AddItem(type)
    {
        if(type === 'note')
        {
            AddNote()
        }
        else
        {
            AddTodo()
        }
    }

    function AddNote()
    {
        var body = JSON.stringify({
            taxonomy: 1,
            user: user
        });
        fetch('/api/items/',{
            method: 'POST',
            body: body
        })
            .then((res) => {
                if(res.status === 200)
                {
                    setloadingState('load') //change to manually adding later?
                }
            })
    }

    function AddTodo()
    {
        var body = JSON.stringify({
            taxonomy: 2,
            user: user
        });
        fetch('/api/items/',{
            method: 'POST',
            body: body
        })
            .then((res) => {
                if(res.status === 200)
                {
                    setloadingState('load')
                }
            })
    }

    function DeleteItem(id, itemId, type) //this is the item id not the id of the note/todo
    {
        var body = JSON.stringify({
            id: id, itemId: itemId, type: type,
            user: user
        });
        fetch('/api/items/' + id,{
            method: 'DELETE',
            body: body
        })
        .then((res) => {
            if(res.status !== 200)
            {
                console.log('error')
                return NULL
            }
            var newItems = items.slice()
            var index = -1;
            for(var item = 0; item < newItems.length; item++)
            {
                if(newItems[item].id === id)
                {
                    index = item
                    break;
                }
            }
            if(index === -1)
            {
                console.log("item doesn't exist")
                return
            }
            newItems.splice(index, 1)
            setItems(newItems)
        })
    }

    return(
        <div>
            {user && (loadingState === 'loaded' || loaded) && <AddItemButton AddItem = {AddItem} className = {style.addItem}/>}
            <ItemsCanvas data = {items} user = {user} loadingState = {loadingState} DeleteItem = {DeleteItem} loaded = {loaded}/>
        </div>
    )
}

function ItemsCanvas(props){
    if(props.user)
    {
        if(props.loadingState === 'loaded' || props.loaded)
        {
            return(
                <Items data = {props.data} DeleteItem = {props.DeleteItem}/>
            )
        }
        return(
            <div>
                loading...
            </div>
        )
    }
    return (
        <div className = {style.pleaseLogin}>
            Please login first!
        </div>
    )
}

function Items(props){
    return(
        <div className = {style.canvas}>
            {props.data.map((item) => {
                if(item.taxonomy === 'note')
                {
                    return <Note key = {item.id} id = {item.id} itemId = {item.itemId} DeleteItem = {props.DeleteItem}/>
                }
                else if(item.taxonomy === 'todo')
                {
                    return <Todo key = {item.id} id = {item.id} itemId = {item.itemId}  DeleteItem = {props.DeleteItem}/>
                }
                else
                {
                    return <div key = {item.id}>error</div>
                }
            })}
        </div>
    )
}

function AddItemButton(props)
{

    const [dropDown, setDropdown] = Toggle()

    var showDD = ' ' + style.hideDropdown
    var noteSelection = style.noteSelectionClosed
    var todoSelection = style.todoSelectionClosed

    if(dropDown)
    {
      showDD = ''
      noteSelection = style.noteSelectionOpen
      todoSelection = style.todoSelectionOpen
    }

    function toggleDropdown(entering)
    {
        if(entering)
        {
            if(!dropDown){setDropdown()}
            return
        }
        if(dropDown){setDropdown()}
    }

    return(
        <div className = {style.newItemContainer}>
            <div className = {style.newItem} onMouseLeave = {() => toggleDropdown(false)} >
                <button onClick = {() => {if(!dropDown){setDropdown()}}} onMouseEnter = {() => toggleDropdown(true)} className = {style.newItemButton}>
                    New Item
                </button>
                <div className = {style.dropdown + showDD}>
                    <button onClick = {() => {
                        props.AddItem('note')
                    }} className = {style.newSelection + ' ' + noteSelection}>Note</button>
                    <button onClick = {() => {
                        props.AddItem('todo')
                    }} className = {style.newSelection + ' ' + todoSelection}>Todo List</button>
                </div>
            </div>
        </div>
    )
}

    /*useEffect(() => {
        if(props.signedIn === 'signedIn')
        {
            loadingState === 'load' ? null : setloadingState('load')
        }
        else if(props.signedIn === 'signedOut')
        {
            if(loadingState === 'loaded')
            {
                setItems([])
            }
            setloadingState('notLoaded')
        }
        else
        {
            console.log('wait for sign in')
        }
    }, [props.signedIn])*/

/*import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/Link'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <Link href = "/testing">Testing</Link>
        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
*/