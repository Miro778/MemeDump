import '../index.css'

/**
 * Tarkastaa, onko meemin media video vai kuva, ja palauttaa sen perusteella kuvan/videon sopivassa muodossa.
 * @param {meme.media} props meemin media.
 * @returns media sopivassa muodossa.
 */
const Media = (props) => {

  var mediaType = props.meme.media.substr(props.meme.media.lastIndexOf('.') + 1)

  if ( mediaType === 'mp4' || mediaType === 'webm' ) {
    return (
      <video id={props.id} controls>
        <source src={props.meme.media} type='video/mp4' />
      </video> )
  } else return ( <img id={props.id} src={props.meme.media} alt={props.meme.title} /> )
}

export default Media