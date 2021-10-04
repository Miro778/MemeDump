import { TextField , Button } from '@material-ui/core'

const NewPost = (props) => {

  return (
    <div>
      <h2>Make a post</h2>
      <form onSubmit={props.addMeme}>
        <div>
          <TextField label="Title"
            id='titleField'
            type="text"
            value={props.newTitle}
            name="Title"
            onChange={({ target }) => props.setNewTitle(target.value)}
          />
        </div>
        <div>
          <TextField label ="Image link (URL)"
            id='urlField'
            type="text"
            value={props.newMedia}
            name="Url"
            onChange={({ target }) => props.setNewMedia(target.value)}
          />
        </div>
        <Button variant="contained" color="primary" id='submitMeme-button' type="submit">create</Button>
      </form>
    </div>
  )
}

export default NewPost