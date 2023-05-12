import React from "react";
import { PlayCircleFill } from "react-bootstrap-icons";
const Movie = ({ movie, selectMovie }) => {
  // console.log(movie);
  return (
    <div onClick={() => selectMovie(movie)} className={"movie"}>
      <div className="movie-title">
        {movie.poster_path ? (
          <img
            src={"https://image.tmdb.org/t/p/w342" + movie.poster_path}
            alt={movie.title}
          />
        ) : (
          <div
            style={{
              height: "355px",
              maxWidth: "100%",
              backgroundColor: "white",
              color: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              borderRadius: "7px",
            }}
          >
            No Image found
          </div>
        )}
        <div className={"flex between movie-infos"}>
          <h5 className={"movie-title"}>{movie.title}</h5>
          {movie.vote_average ? (
            <span className={"movie-voting"}>{movie.vote_average}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Movie;
