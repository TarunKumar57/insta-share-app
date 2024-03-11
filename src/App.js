import {Component} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import Login from './components/LoginRoute'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/HomeRoute'
import MyProfile from './components/MyProfileRoute'
import UserProfile from './components/UserProfileRoute'
import NotFound from './components/NotFoundRoute'
import InstaContext from './context/InstaContext'
import './App.css'

class App extends Component {
  state = {
    isSearchActive: false,
    isActive: false,
    searchInput: '',
    searchList: [],
  }

  onMenuToggle = () => {
    this.setState({isActive: true})
  }

  onCloseToggle = () => {
    this.setState({isActive: false})
  }

  onSearchItem = () => {
    this.setState(prevState => ({isSearchActive: !prevState.isSearchActive}))
  }

  onChangeSearchInput = event => {
    // event.preventDefault()
    this.setState({searchInput: event.target.value})
  }

  setPostsData = updatedData => {
    this.setState({searchList: updatedData})
  }

  searchInputValue = value => {
    this.setState({searchInput: value})
  }

  render() {
    const {isSearchActive, isActive, searchInput, searchList} = this.state
    return (
      <InstaContext.Provider
        value={{
          isSearchActive,
          isActive,
          searchInput,
          searchList,
          onMenuToggle: this.onMenuToggle,
          onCloseToggle: this.onCloseToggle,
          onSearchItem: this.onSearchItem,
          onChangeSearchInput: this.onChangeSearchInput,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/my-profile" component={MyProfile} />
          <ProtectedRoute path="/users/:id" component={UserProfile} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </InstaContext.Provider>
    )
  }
}
export default App
