import React, { use } from 'react'
import { useState, useEffect } from 'react'
import { Container, PostCard } from '../components/index'
import service from '../appwrite/database'
import { useSelector } from 'react-redux'

function AllPosts() {

    const userData = useSelector((state) => state.auth.userData);
    const [posts, setPosts] = useState([])
    useEffect(() => {
        try {
            if (navigator.onLine) {
                if (userData) {
                    service.getPosts(userData.$id).then( (posts) => {
                        if (posts) {
                            setPosts(posts.documents)
                        }
                    })
                }
                localStorage.setItem("posts", JSON.stringify(posts));
            } else {
                const localPosts = localStorage.getItem("posts");
                if (localPosts) {
                    setPosts(JSON.parse(localPosts));
                }
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
        
    }, [userData])
  return (
    <div className='py-8 w-full'>
        <Container>
            <div className='flex flex-wrap'>
                {posts.length > 0 && posts.map( (post) => (
                    <div key={post.$id} className="p-2 w-1/4">
                        <PostCard {...post}/>
                    </div>
                ))}
            </div>
        </Container>
    </div>
  )
}


export default AllPosts