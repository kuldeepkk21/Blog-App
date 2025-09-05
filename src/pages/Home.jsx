import React, { useState, useEffect } from 'react'
import { Container } from '../components/index'
import authService from '../appwrite/auth'

function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser()
  }, [])

  if (loading) {
    return <h2 className="text-center">Loading...</h2>
  }

  if (user) {
    return (
        <div className='py-8 w-full'>
            <Container>
                <h2 className='text-2xl font-bold text-center'>
                Welcome back, {user.name} 👋
                </h2>
                {/* Your posts or logged-in content here */}
            </Container>
        </div>
    )
  } else {
    return (
        <div className='py-8 w-full'>
            <Container>
                <h2 className='text-2xl font-bold text-center'>
                    Please login to read posts
                </h2>
            </Container>
      </div>
    )
  }
}

export default Home

