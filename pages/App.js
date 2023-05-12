import { useEffect, useState } from "react";

import axios from "axios";
import MovieCard from "./components/Moviedata";
import Youtube from "react-youtube";
import { Search, ThreeDots } from "react-bootstrap-icons";
function App() {
  const SEARCH_API = "https://api.themoviedb.org/3/search/movie";
  const DISCOVER_API = "https://api.themoviedb.org/3/discover/movie";
  const BACKDROP_PATH = "https://image.tmdb.org/t/p/w1280";

  const [playing, setPlaying] = useState(false);
  const [trailer, setTrailer] = useState(null);
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [movie, setMovie] = useState({ title: "Loading Movies" });
  const [filtered, setfiltered] = useState([]);
  const fetchMovies = async (event) => {
    if (event) {
      event.preventDefault();
    }

    const { data } = await axios.get(
      `${searchKey ? SEARCH_API : DISCOVER_API}`,
      {
        params: {
          api_key: "91daf40c2e271d17ead69104a4d3ca36",
          query: searchKey,
        },
      }
    );

    console.log(data.results[0]);
    setMovies(data.results);
    setMovie(data.results[0]);
    setfiltered(data.results);
    if (data.results.length) {
      await fetchMovie(data.results[0].id);
    }
  };
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovie = async (id) => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}`,
      {
        params: {
          api_key: "91daf40c2e271d17ead69104a4d3ca36",
          append_to_response: "videos",
        },
      }
    );

    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }

    setMovie(data);
  };

  const selectMovie = (movie) => {
    fetchMovie(movie.id);
    setPlaying(false);
    setMovie(movie);
    window.scrollTo(0, 0);
  };
  const sortItems = (id) => {
    const fltr = movies.filter((data) => data.genre_ids.includes(id));
    console.log("filtered data", fltr);
    setfiltered(fltr);
    setMovie(fltr[0]);
  };
  const renderMovies = () => {
    return filtered.length < movies.length
      ? filtered.map((movie) => (
          <MovieCard selectMovie={selectMovie} key={movie.id} movie={movie} />
        ))
      : movies.map((movie) => (
          <MovieCard selectMovie={selectMovie} key={movie.id} movie={movie} />
        ));
  };

  return (
    <div className="App">
      <header className="center-max-size header">
        <span className="brand" onClick={() => sortItems(0)}>
          Movie App
        </span>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="buttons" onClick={() => sortItems(35)}>
            Comedy
          </button>
          <button className="buttons" onClick={() => sortItems(28)}>
            Action
          </button>
          <button className="buttons" onClick={() => sortItems(12)}>
            Adventure
          </button>
          <button className="buttons" onClick={() => sortItems(80)}>
            Crime
          </button>
          <button className="buttons" onClick={() => sortItems(27)}>
            Horror
          </button>
          <button className="bttn">
            <ThreeDots />
          </button>
        </div>
        <form className="form" onSubmit={fetchMovies}>
          <input
            className="search"
            type="text"
            id="search"
            placeholder="Search Movies"
            onInput={(event) => setSearchKey(event.target.value)}
          />
          <button className="submit-search" type="submit">
            <Search />
          </button>
        </form>
      </header>
      {movies.length ? (
        <main>
          {movie ? (
            <div
              className="poster"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${BACKDROP_PATH}${movie.backdrop_path})`,
              }}
            >
              {playing ? (
                <div>
                  <Youtube
                    videoId={trailer.key}
                    className={"youtube "}
                    containerClassName={"youtube-container "}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button
                    onClick={() => setPlaying(false)}
                    className={"button close-video"}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="center-max-size">
                  <div className="poster-content">
                    {trailer ? (
                      <button
                        className={"button play-video"}
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Play Trailer
                      </button>
                    ) : (
                      "Sorry, no trailer available"
                    )}
                    <h1>{movie.title}</h1>
                    <p>{movie.overview}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          <div className={"center-max-size container"}>{renderMovies()}</div>
        </main>
      ) : (
        "Sorry, no movies found"
      )}
    </div>
  );
}

export default App;
