import SearchResults from '../SearchResults'
import InstaContext from '../../context/InstaContext'

const Home = () => (
  <InstaContext.Consumer>
    {value => {
      const {searchInput} = value
      return <SearchResults searchInput={searchInput} />
    }}
  </InstaContext.Consumer>
)

export default Home
