import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsHeart} from 'react-icons/bs'
import {FcLike} from 'react-icons/fc'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import {Link} from 'react-router-dom'
import LoadingView from '../LoadingView'
import FailureView from '../FailureView'
import Header from '../Header'
import HomePosts from '../HomePosts'
import InstaContext from '../../context/InstaContext'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class SearchResults extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    searchPostsList: [],
  }

  componentDidMount() {
    this.getSearchPosts()
  }

  getSearchPosts = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {searchInput} = this.props
    console.log(searchInput)
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.posts.map(eachPost => ({
        postId: eachPost.post_id,
        userId: eachPost.user_id,
        userName: eachPost.user_name,
        profilePicUrl: eachPost.profile_pic,
        postImageUrl: eachPost.post_details.image_url,
        postCaption: eachPost.post_details.caption,
        likesCount: eachPost.likes_count,
        comments: eachPost.comments,
        createdAt: eachPost.created_at,
      }))
      this.setState({
        searchPostsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  initiateSearchPostLikeApi = async (postId, likeStatus) => {
    const {searchPostsList} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const likeDetails = {
      like_status: likeStatus,
    }
    const apiUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'POST',
      body: JSON.stringify(likeDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    let userPostsData = searchPostsList
    userPostsData = userPostsData.map(eachObject => {
      if (eachObject.postId === postId && likeStatus) {
        return {
          ...eachObject,
          message: data.message,
          likesCount: eachObject.likesCount + 1,
        }
      }
      if (eachObject.postId === postId && !likeStatus) {
        return {
          ...eachObject,
          message: data.message,
          likesCount: eachObject.likesCount - 1,
        }
      }

      return eachObject
    })
    this.setState({searchPostsList: userPostsData})
  }

  renderLoadingView = () => <LoadingView />

  onTryAgain = () => {
    this.getSearchPosts()
  }

  renderFailureView = () => <FailureView onTryAgain={this.onTryAgain} />

  renderNoSearchView = () => (
    <div className="search-not-found-container">
      <img
        src="https://res.cloudinary.com/dz881zzvx/image/upload/v1709544318/Group_oi6ifn.png"
        alt="search not found"
        className="search-not-found-img"
      />
      <h1 className="search-not-found-heading">Search Not Found</h1>
      <p className="search-not-found-para">
        Try different keyword or search again
      </p>
    </div>
  )

  onSearchPosts = () => {
    this.getSearchPosts()
  }

  renderSuccessView = () => {
    const {searchPostsList} = this.state
    return (
      <>
        <h2>Search Results</h2>
        {searchPostsList.length > 0 ? (
          <ul className="list">
            {searchPostsList.map(each => {
              const isLiked = each.message === 'Post has been liked'
              const onLike = () => {
                this.initiateSearchPostLikeApi(each.postId, true)
                console.log(each.message)
              }
              const onUnlike = () => {
                this.initiateSearchPostLikeApi(each.postId, false)
                console.log(each.message)
              }
              return (
                <li className="home-post-item" key={each.postId}>
                  <div className="profile-pic-user-name-container">
                    <img
                      src={each.profilePicUrl}
                      alt="post author profile"
                      className="profile-pic"
                    />
                    <Link to={`/users/${each.userId}`} className="link">
                      <p className="user-name">{each.userName}</p>
                    </Link>
                  </div>
                  <img
                    src={each.postImageUrl}
                    alt="post"
                    className="post-img"
                    onDoubleClick={onLike}
                  />
                  <div className="icon-btn-container">
                    {isLiked ? (
                      <button
                        type="button"
                        data-testid="unLikeIcon"
                        className="icon-btn"
                        onClick={onUnlike}
                      >
                        <FcLike size={30} />{' '}
                      </button>
                    ) : (
                      <button
                        type="button"
                        data-testid="likeIcon"
                        className="icon-btn"
                        onClick={onLike}
                      >
                        <BsHeart />{' '}
                      </button>
                    )}
                    <button type="button" className="icon-btn">
                      <FaRegComment />{' '}
                    </button>
                    <button type="button" className="icon-btn">
                      <BiShareAlt />{' '}
                    </button>
                  </div>
                  <div className="comment-created-container">
                    <p className="likes-count">{each.likesCount} Likes</p>
                    <p className="post-caption">{each.postCaption}</p>
                    <ul className="comment-list">
                      {each.comments.map(eachCommit => (
                        <li className="comment-item" key={eachCommit.user_id}>
                          <p className="comment-user-name">
                            <Link
                              to={`/users/${eachCommit.user_id}`}
                              className="link"
                            >
                              {eachCommit.user_name}
                            </Link>
                            <span className="comment-user-comment">
                              {eachCommit.comment}
                            </span>
                          </p>
                        </li>
                      ))}
                    </ul>
                    <p className="created-at">{each.createdAt}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          this.renderNoSearchView()
        )}
      </>
    )
  }

  renderSearchResultsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  renderView = () => (
    <InstaContext.Consumer>
      {value => {
        const {searchInput} = value
        return (
          <>
            <Header onSearchPosts={this.onSearchPosts} />
            {searchInput === '' ? (
              <HomePosts />
            ) : (
              <>{this.renderSearchResultsView()} </>
            )}
          </>
        )
      }}
    </InstaContext.Consumer>
  )

  render() {
    return <>{this.renderView()}</>
  }
}

export default SearchResults
