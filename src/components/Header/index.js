import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import {FaSearch} from 'react-icons/fa'
import {IoMenu, IoCloseCircle} from 'react-icons/io5'
import InstaContext from '../../context/InstaContext'
import './index.css'

class Header extends Component {
  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  onClickSearch = () => {
    const {onSearchPosts} = this.props
    onSearchPosts()
  }

  onEnterSearchInput = event => {
    const {onSearchPosts} = this.props
    if (event.key === 'Enter') {
      onSearchPosts()
    }
  }

  render() {
    return (
      <InstaContext.Consumer>
        {value => {
          const {
            isSearchActive,
            isActive,
            searchInput,
            onMenuToggle,
            onCloseToggle,
            onSearchItem,
            onChangeSearchInput,
          } = value

          const renderMobileMenuItems = () => (
            <div className="mobile-list-container">
              <ul className="mobile-list">
                <li className="mobile-list-item">
                  <Link to="/" className="link">
                    Home
                  </Link>
                </li>
                <li
                  onClick={onSearchItem}
                  className="mobile-list-item active-list-item"
                >
                  Search
                </li>
                <li className="mobile-list-item">
                  <Link to="/my-profile" className="link">
                    Profile
                  </Link>
                </li>
              </ul>
              <button
                type="button"
                onClick={this.onClickLogout}
                className="mobile-logout-button"
              >
                Logout
              </button>
              <button
                type="button"
                onClick={onCloseToggle}
                className="close-button"
              >
                {' '}
                <IoCloseCircle />
              </button>
            </div>
          )

          const renderMobileSearch = () => (
            <div className="mobile-search-container">
              <input
                type="search"
                placeholder="Search Caption"
                className="search-input"
                value={searchInput}
                onChange={onChangeSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                type="button"
                data-testid="searchIcon"
                className="search-button"
                onClick={this.onClickSearch}
              >
                {' '}
                <FaSearch />
              </button>
            </div>
          )

          return (
            <>
              <nav className="nav-container">
                <Link to="/" className="link">
                  <div className="logo-heading-container">
                    <img
                      src="https://res.cloudinary.com/dz881zzvx/image/upload/v1709271015/Standard_Collection_8_e4it34.png"
                      alt="website logo"
                      className="logo"
                    />
                    <h1 className="nav-heading">Insta Share</h1>
                  </div>
                </Link>
                <div className="search-home-profile-logout-container">
                  <div className="search-container">
                    <input
                      type="search"
                      placeholder="Search Caption"
                      className="search-input"
                      value={searchInput}
                      onChange={onChangeSearchInput}
                      onKeyDown={this.onEnterSearchInput}
                    />
                    <button
                      type="button"
                      data-testid="searchIcon"
                      className="search-button"
                      onClick={this.onClickSearch}
                    >
                      {' '}
                      <FaSearch />
                    </button>
                  </div>
                  <ul className="desk-list">
                    <li className="desk-list-item">
                      <Link to="/" className="link">
                        Home
                      </Link>
                    </li>
                    <li className="desk-list-item">
                      <Link to="/my-profile" className="link">
                        Profile
                      </Link>
                    </li>
                  </ul>
                  <button
                    type="button"
                    onClick={this.onClickLogout}
                    className="logout-button"
                  >
                    Logout
                  </button>
                </div>
                <button
                  type="button"
                  onClick={onMenuToggle}
                  className="menu-button"
                >
                  <IoMenu size={25} />{' '}
                </button>
              </nav>

              {isActive && renderMobileMenuItems()}
              {isSearchActive && renderMobileSearch()}
            </>
          )
        }}
      </InstaContext.Consumer>
    )
  }
}

export default withRouter(Header)
