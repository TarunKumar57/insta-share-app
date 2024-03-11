import {Component} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import Login from './components/LoginRoute'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/HomeRoute'
import Stories from './components/Stories'
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

  searchInputValue = value => {
    this.setState({searchInput: value})
  }

  render() {
    const {isSearchActive, isActive, searchInput} = this.state
    return (
      <InstaContext.Provider
        value={{
          isSearchActive,
          isActive,
          searchInput,
          onMenuToggle: this.onMenuToggle,
          onCloseToggle: this.onCloseToggle,
          onSearchItem: this.onSearchItem,
          onChangeSearchInput: this.onChangeSearchInput,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/stories" component={Stories} />
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
