import React from 'react'
import { Container, PostForm } from '../components/index'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import service from '../appwrite/database'
import { useParams } from 'react-router-dom'

function AddPost() {
//   const [post, setPost] = useState(null)
//   const {slug} = useParams()
//   const navigate = useNavigate()
//   useEffect(() => {

//     if (slug) {
//         service.getPost(slug).then( (post) => {
//             if (post) {
//                 setPost(post)
//             } 
//             else {
//                 navigate("/");
//             }
//         })
//     } else {
//         setPost(null)
//     }
//   }, [slug, navigate])

    const post = {}

  return (
    <div className='py-8'>
        <Container>
            <PostForm {...post}/>
        </Container>
    </div>
  )
}

export default AddPost