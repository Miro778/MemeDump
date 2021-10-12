/**
   * Laskee parametrina annetun käyttäjän kaikkien meemien tykkäykset.
   * @param user käyttäjä, jonka tykkäykset lasketaan.
   * @returns parametrina annetun käyttäjän kaikkien meemien tykkäysten summa.
   */
function getLikes( user, memes ) {

  var likes = 0

  for (var i = 0; i < memes.length; i++) {
    if (memes[i].user.id === user.id) likes = likes + memes[i].likes
  }
  return likes
}

/**
   * Laskee parametrina annetun käyttäjän kaikkien meemien kommenttien määrän.
   * @param user käyttäjä, jonka meemien kommenttien määrä lasketaan.
   * @returns parametrina annetun käyttäjän kaikkien meemien kommenttien määrä.
   */
function getComments( user,memes ) {

  var comments = 0

  for (var i = 0; i < memes.length; i++) {
    for (var j = 0; j < memes[i].comments.length; j++) {
      if (memes[i].comments[j].user === user.username) comments++
    }
  }
  return comments
}


/**
   * Selvittää, mikä sija (indeksi) käyttäjien listassa parametrinä annetulla käyttäjällä on, ja palauttaa siten kyseisen sijan (indeksin)
   * @param user käyttäjä, jonka sija palautetaan.
   * @returns parametrinä annetun käyttäjän indeksi. Jos käyttäjää ei löydy, palautetaan viimeisenä käyttäjien listalla olevan indeksi.
   */
function getRank( user,users ) {

  for (var i = 0; i < users.length; i++) {
    if (users[i] === user) return i+1
  }
  return users.length-1
}

/**
   * Vertailee kahden objektin tykkäyksiä keskenään.
   * @param a ensimmäinen vertailtava objekti
   * @param b toinen vertailtava objekti
   * @returns -1 jos a:n tykkäykset suuremmat. 1 jos b:n tykkäykset suuremmat. 0 jos yhtäsuuret.
   */
function compareByLikes( a, b ) {
  if ( a.likes > b.likes ){
    return -1
  }
  if ( a.likes < b.likes ){
    return 1
  }
  return 0
}

/**
   * Muuttaa String-muotoisen päivämäärän ilmaisun Date-muotoon.
   * @param input Päivämäärä String-muodossa.
   * @return päivämäärä Date-muodossa.
  */
function parseDate(input) {
  var parts = input.match(/(\d+)/g)

  return new Date(parts[0], parts[1]-1, parts[2])
}

/**
   * Vertailee kahden objektin päivämääriä keskenään.
   * @param a ensimmäinen vertailtava objekti
   * @param b toinen vertailtava objekti
   * @returns -1 jos a:n päivämäärä uudempi. 1 jos b:n päivämäärä uudempi. 0 jos sama päivämäärä.
   */
function compareByDate( a, b ) {
  var date1 = parseDate(a.date)
  var date2 = parseDate(b.date)

  if ( date1.getTime() > date2.getTime() ){
    return -1
  }
  if ( date1.getTime() < date2.getTime() ){
    return 1
  }
  return 0
}

const exportedObject = {
  getLikes,
  getComments,
  getRank,
  compareByLikes,
  compareByDate
}

export default exportedObject