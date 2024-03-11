import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-container ">
    <img
      src="https://res.cloudinary.com/dz881zzvx/image/upload/v1709278844/erroring_1_ncynxs.png"
      alt="page not found"
      className="not-found-img"
    />
    <h1 className="not-found-heading ">Page Not Found</h1>
    <p className="not-found-paragraph">
      we are sorry, the page you requested could not be found. Please go back to
      the homepage.
    </p>
    <Link to="/">
      <button type="button" className="home-page-button">
        Home Page
      </button>
    </Link>
  </div>
)

export default NotFound
