import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { LogOut, User2, Menu, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { setUser } from '@/redux/authSlice'
import { USER_API_END_POINT } from '@/utils/constant'
import axios from 'axios'

const Navbar = () => {
  const { user } = useSelector(store => store.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true })
      if (res.data.success) {
        dispatch(setUser(null))
        navigate('/')
        toast.success(res.data.message)
      }
    } catch (e) {
      console.error(e)
      toast.error(e.response?.data?.message || 'Logout failed')
    }
  }

  // Links JSX for reuse
  const links = user && user.role === 'recruiter' ? (
    <>
      <li>
        <Link to="/admin/companies" className="hover:text-indigo-600 transition-colors duration-200">
          Companies
        </Link>
      </li>
      <li>
        <Link to="/admin/jobs" className="hover:text-indigo-600 transition-colors duration-200">
          Jobs
        </Link>
      </li>
    </>
  ) : (
    <>
      <li>
        <Link to="/" className="hover:text-indigo-600 transition-colors duration-200 text-white">
          Home
        </Link>
      </li>
      <li>
        <Link to="/jobs" className="hover:text-indigo-600 transition-colors duration-200 text-white">
          Jobs
        </Link>
      </li>
      <li>
        <Link to="/browse" className="hover:text-indigo-600 transition-colors text-white selection:duration-200">
          Browse
        </Link>
      </li>
    </>
  )

  return (
    <nav className="bg-black/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
        {/* Logo */}
        <div>
          <h1 className="text-2xl font-extrabold text-red-500">
            Placement <span className="text-indigo-600">Portal</span>
          </h1>
        </div>

        {/* Desktop nav links - hidden on small */}
        <ul className="hidden sm:flex font-medium items-center gap-6 text-gray-700">{links}</ul>

        {/* Desktop right side */}
        <div className="hidden sm:flex items-center gap-8">
          {!user ? (
            <>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    className="rounded-full h-10 w-10 border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-200"
                    src={user?.profile?.profilePhoto}
                    alt="User profile"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-64 bg-white rounded-lg shadow-xl p-4 border border-gray-100">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage
                        className="rounded-full h-12 w-12"
                        src={user?.profile?.profilePhoto}
                        alt="User profile"
                      />
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-gray-800">{user?.fullName}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2">{user?.profile?.bio || 'No bio available'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {user && user.role === 'student' && (
                      <Link to="/profile">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                        >
                          <User2 className="mr-2 h-4 w-4" />
                          View Profile
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      onClick={logoutHandler}
                      className="w-full justify-start text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-black/90 backdrop-blur-sm border-t border-gray-700">
          <ul className="flex flex-col px-4 py-4 gap-4 font-medium text-white">
            {links}
          </ul>
          <div className="px-4 pb-4 flex flex-col gap-4">
            {!user ? (
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="border-indigo-300 text-indigo-600 hover:bg-indigo-50 w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {user && user.role === 'student' && (
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-white">
                      <User2 className="mr-2 h-4 w-4" />
                      View Profile
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  onClick={() => {
                    logoutHandler()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full justify-start text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
