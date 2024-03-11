import React from 'react'

const InstaContext = React.createContext({
  isSearchActive: false,
  isActive: false,
  searchInput: '',
  onMenuToggle: () => {},
  onCloseToggle: () => {},
  onSearchItem: () => {},
  onChangeSearchInput: () => {},
})
export default InstaContext
