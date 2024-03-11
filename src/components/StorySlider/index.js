import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Slider from 'react-slick'
import LoadingView from '../LoadingView'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 7,
  slidesToScroll: 6,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 5,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 4,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 3,
      },
    },
  ],
}

class StorySlider extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    storiesList: [],
  }

  componentDidMount() {
    this.getStories()
  }

  getStories = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/insta-share/stories'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.users_stories.map(story => ({
        userId: story.user_id,
        userName: story.user_name,
        storyUrl: story.story_url,
      }))
      this.setState({
        storiesList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.inProgress})
    }
  }

  renderLoadingView = () => <LoadingView />

  renderView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderStoriesView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  renderStoriesView = () => {
    const {storiesList} = this.state
    // const{userId,userName,storyUrl}=storyUrl
    return (
      <div className="slider-container">
        <Slider {...settings}>
          {storiesList.map(each => (
            <div key={each.userId} className="story-container">
              <Link to="/stories">
                <img
                  src={each.storyUrl}
                  alt="user story"
                  className="story-img"
                />
              </Link>
              <p className="story-paragraph">{each.userName}</p>
            </div>
          ))}
        </Slider>
      </div>
    )
  }

  render() {
    return <>{this.renderView()}</>
  }
}

export default StorySlider
