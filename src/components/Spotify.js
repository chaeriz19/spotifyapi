import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, InputGroup, FormControl, Button, Row, Cards, Card  } from 'react-bootstrap'  
import { useState, useEffect } from 'react';
function Spotify() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState(""); 
  const [ albums, setAlbums ] = useState([]);

  const CLIENT_ID = "7593e99e570b4ca98528f0463c356199";
  const CLIENT_SECRET = "be8b91715fb4486d8202b4916e67b864";

  useEffect( (e) => {
    var parameters = {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch("https://accounts.spotify.com/api/token", parameters).then(result => {
      result.json().then(data => setAccessToken(data.access_token));
    })
  });

  async function search(input) {
    var search_parameters = {
      method: "GET",  
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    console.log("Searching " + input);
    var ARTIST_ID = await fetch("https://api.spotify.com/v1/search?q=" + input + '&type=artist', search_parameters)
    .then(response => response.json())
    .then(data => {
      return data.artists.items[0].id;
    });
    console.log(ARTIST_ID);

    var ARTIST_ALBUMS = await fetch("https://api.spotify.com/v1/artists/" + ARTIST_ID + '/albums' + '?include_groups=album&market=US&limit=50', search_parameters)
    .then(response => response.json())
    .then(data => {
      setAlbums(data.items);
    });
  }

  return (
    <div className="App">
      <Container className="mt-3">
        <InputGroup className="mb-3" size="large">
          <FormControl
          placeholder="Search.."
          type="input"
          onKeyPress={event => {
            if (event.key == "Enter") {
              search(event.target.value);
            }
          }}
          onChange={ event => setSearchInput(event.target.value)}
          />
          <Button onClick={ (event) => {
          }}>Search</Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className="mx-2 row row-cols-4">
        { albums.map( (album, i) => {console.log(album);
          return (<Card className="mb-2 mt-2">
          <Card.Img src={album.images[0].url}/>
          <Card.Body>
          <Card.Title>{album.name}</Card.Title>
          <Card.Text>{album.artists[0].name}</Card.Text>
          <Card.Text>{album.release_date}</Card.Text>

          </Card.Body>
          </Card>)
        })
        }
        </Row>
        
      </Container>
    </div>
  );
}

export default Spotify;
