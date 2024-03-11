import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsHeart} from 'react-icons/bs'
import {FcLike} from 'react-icons/fc'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import {Link} from 'react-router-dom'
import StorySlider from '../StorySlider'
import LoadingView from '../LoadingView'
import ErrorView from '../ErrorView'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class HomePosts extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    postsList: [],
  }

  componentDidMount() {
    this.getPosts()
  }

  getPosts = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/insta-share/posts'
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
        likeStatus: false,
        likesCount: eachPost.likes_count,
        comments: eachPost.comments,
        createdAt: eachPost.created_at,
      }))
      this.setState({
        postsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  initiatePostLikeApi = async (postId, likeStatus) => {
    const {postsList} = this.state
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
    let userPostsData = postsList
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

    this.setState({postsList: userPostsData})
  }

  renderLoadingView = () => <LoadingView />

  onTryAgain = () => {
    this.getPosts()
  }

  renderFailureView = () => <ErrorView onTryAgain={this.onTryAgain} />

  renderSuccessView = () => {
    const {postsList} = this.state
    return (
      <ul className="list">
        {postsList.map(each => {
          const isLiked = each.message === 'Post has been liked'
          const onLike = () => {
            this.initiatePostLikeApi(each.postId, true)
            console.log(each.message)
          }
          const onUnlike = () => {
            this.initiatePostLikeApi(each.postId, false)
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
    )
  }

  renderView = () => {
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

  render() {
    return (
      <>
        <StorySlider />
        {this.renderView()}
      </>
    )
  }
}

export default HomePosts
