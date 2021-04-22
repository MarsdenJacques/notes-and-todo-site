import Link from 'next/Link'
import {useState} from 'react'


//const fetcher = (url) => fetch(url).then((res) => res.json())

/*async function Test(){
    var data = await fetch('/api/hello', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    taxonomy: 'cats',
  })
}).then(
    (res) => res.status
).catch(console.log('xDDD'))
console.log(data)
}*/

/*async function Test2(){
  return await fetch('/api/hello', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstParam: 'yourValue',
    secondParam: 'yourOtherValue',
  })
}).then(
    (res) => (res)
).catch(console.log('xDDD'))
}*/
/*console.log(data)
console.log(data.map(({id, title}) => (
    '<p key = {id}>id: ' + {id}.id + '<br/>title: ' + {title}.title + '</p>'
)))
return <div>test</div>*/


export default function Testing() {

    const [taxonomies, setTaxonomies] = useState([])

    /*const Test3 = () => {
        return fetch('http://localhost:3000/api/hello', {
      method: 'GET'
    }).then(
        (res) => {return res.json()
        }
    ).then((data) => {setTaxonomies(data)}).catch(console.log('xDDD'))
    }*/


    //const test1 = Test()
    //{taxonomies}
    return(<div>
    </div>
    )
}

/*
<p>{taxonomies.map(taxonomy => (
            <p>
                id: {taxonomy.id} <br/>
                title: {taxonomy.title}
            </p>
        ))}</p>

*/