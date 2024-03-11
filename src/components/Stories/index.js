import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Slider from 'react-slick'
import Header from '../Header'
import LoadingView from '../LoadingView'
import './index.css'

const settings = {
  //    dots: true,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 1234,
  pauseOnHover: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
      },
    },
  ],
}

class Stories extends Component {
  state = {
    isLoading: false,
    storiesList: [],
  }

  componentDidMount() {
    this.getStories()
  }

  getStories = async () => {
    this.setState({isLoading: true})
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
        isLoading: false,
      })
    }
  }

  render() {
    const {isLoading, storiesList} = this.state
    return (
      <>
        <Header />
        {isLoading ? (
          <LoadingView />
        ) : (
          <div className="slider-container">
            <Slider {...settings}>
              {storiesList.map(each => (
                <div key={each.userId} className="each-story-container">
                  <Link to={`/users/${each.userId}`} className="link">
                    <p className="each-story-paragraph">{each.userName}</p>
                  </Link>
                  <img
                    src={each.storyUrl}
                    alt="user story"
                    className="each-story-img"
                  />
                </div>
              ))}
            </Slider>
          </div>
        )}
      </>
    )
  }
}

export default Stories
