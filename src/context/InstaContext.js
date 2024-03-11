import React from 'react'

const InstaContext = React.createContext({
  isSearchActive: false,
  isActive: false,
  searchInput: '',
  searchList: [],
  onMenuToggle: () => {},
  onCloseToggle: () => {},
  onSearchItem: () => {},
  onChangeSearchInput: () => {},
  setPostsData: () => {},
})
export default InstaContext
