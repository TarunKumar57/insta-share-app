import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import LoadingView from '../LoadingView'
import FailureView from '../FailureView'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Profile extends Component {
  state = {
    profileData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileData()
  }

  getProfileData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/insta-share/my-profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = {
        id: fetchedData.profile.id,
        userId: fetchedData.profile.user_id,
        userName: fetchedData.profile.user_name,
        profilePic: fetchedData.profile.profile_pic,
        followersCount: fetchedData.profile.followers_count,
        followingCount: fetchedData.profile.following_count,
        userBio: fetchedData.profile.user_bio,
        posts: fetchedData.profile.posts,
        postsCount: fetchedData.profile.posts_count,
        stories: fetchedData.profile.stories,
      }
      console.log(updatedData)
      this.setState({
        profileData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderProfileView = () => {
    const {profileData} = this.state
    const {
      // id,
      userId,
      userName,
      profilePic,
      followersCount,
      followingCount,
      userBio,
      posts,
      postsCount,
      stories,
    } = profileData

    return (
      <>
        <div className="user-container">
          <img src={profilePic} alt="my profile" className="user-img" />
          <div className="about-user-container">
            <h1 className="user-user-name">{userName}</h1>
            <div className="user-posts-follow-container">
              <p className="user-posts-follow">
                <span className="count">{postsCount}</span> posts
              </p>
              <p className="user-posts-follow">
                <span className="count">{followersCount}</span>
                followers
              </p>
              <p className="user-posts-follow">
                <span className="count">{followingCount}</span>
                following
              </p>
            </div>
            <p className="user-name">{userId}</p>
            <p className="user-bio">{userBio}</p>
          </div>
        </div>
        <div className="mobile-user-container">
          <h1 className="user-user-name">{userName}</h1>
          <div className="user-img-post-follow-container">
            <img src={profilePic} alt="my profile" className="user-img" />
            <div className="user-posts-follow-container">
              <p className="user-posts-follow">
                <span className="count">{postsCount}</span>
                <br /> posts
              </p>
              <p className="user-posts-follow">
                <span className="count">{followersCount}</span>
                <br /> followers
              </p>
              <p className="user-posts-follow">
                <span className="count">{followingCount}</span>
                <br /> following
              </p>
            </div>
          </div>
          <p className="user-name">{userName}</p>
          <p className="user-bio">{userBio}</p>
        </div>
        <ul className="stories-container">
          {stories.map(each => (
            <li key={each.id} className="user-story-item">
              <img
                src={each.image}
                alt="user story"
                className="user-story-img"
              />
            </li>
          ))}
        </ul>
        <hr className="horizontal-line" />
        <div className="posts-container">
          <h1 className="posts-heading">
            <BsGrid3X3 /> Posts
          </h1>
          {posts.length === 0 ? (
            this.renderNoPostsView()
          ) : (
            <ul className="post-list-container">
              {posts.map(each => (
                <li key={each.id} className="post-list-item">
                  <img src={each.image} alt="post" className="post-item" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </>
    )
  }

  renderNoPostsView = () => (
    <div className="no-posts-container">
      <div className="bs-camera-container ">
        <BiCamera className="bs-camera" />
      </div>
      <p className="no-posts-heading">No Posts Yet</p>
    </div>
  )

  renderLoadingView = () => <LoadingView />

  onTryAgain = () => {
    this.getProfileData()
  }

  renderFailureView = () => <FailureView onTryAgain={this.onTryAgain} />

  renderView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="user-profile-container">{this.renderView()}</div>
      </>
    )
  }
}

export default Profile
