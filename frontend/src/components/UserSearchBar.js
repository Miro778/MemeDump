/* eslint-disable no-unused-vars */
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'
import { TextField, IconButton } from '@material-ui/core'

const UserSearchBar = (props) => {

  const HandleFilter = (event) => {
    props.setFilterData(event.target.value)
  }

  const ClearFilter = () => {
    props.setFilterData('')
  }

  return (
    <div className={props.classes.root}>
      <TextField
        id="searchField"
        type="text"
        variant="standard"
        name="SearchBar"
        value={props.filter}
        onChange={HandleFilter}
        placeholder="Search…"
        className={props.classes.textField}
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              onClick={ClearFilter}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
      />
    </div>
  )
}

export default UserSearchBar