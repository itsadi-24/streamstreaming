import React, { useEffect, useRef, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-player/react-player.css';
import Genres from '@/app/genres/[id]/page';
import { BASE_URL } from '@/utils/Const';

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

interface MovieDetailsProps {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: BelongsToCollection;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  videos: Videos;
}

interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

interface Genre {
  id: number;
  name: string;
}

interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

interface Videos {
  results: Result[];
}

interface Result {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
}

const MovieDetails = () => {
  const [movie, setMovie] = useState<MovieDetailsProps | null>(null);

  const [showPlayer, setShowPlayer] = useState(false);
  const [trailer, setTrailer] = useState('');

  const router = useRouter();
  const params = useParams();

  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/movie/${params.id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&append_to_response=videos`
      )
      .then((res) => {
        setMovie(res.data);
      });
  }, [params.id, process.env.NEXT_PUBLIC_API_KEY]);

  useEffect(() => {
    if (movie) {
      const trailerIndex = movie.videos?.results?.findIndex(
        (element: { type: string }) => element.type === 'Trailer'
      );

      if (trailerIndex !== -1) {
        const trailerURL = `https://www.youtube.com/watch?v=${movie.videos?.results[trailerIndex]?.key}`;
        setTrailer(trailerURL);
      }
    }
  }, [movie]);

  const startPlayer = () => {
    if (mainRef?.current) {
      mainRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
      setShowPlayer(true);
    }
  };

  return (
    <main
      className='bg-secondary p-8 relative max-h-[calc(100vh-77px)] overflow-y-scroll scrollbar-thin scrollbar-thumb-[#22222a] scrollbar-track-primary '
      ref={mainRef}
    >
      {movie === null && <div>Loading...</div>}
      <div
        className='text-textColor hover:text-white absolute right-0 top-0 m-2 cursor-pointer'
        onClick={router.back}
      >
        <IoMdClose size={28} />
      </div>
      <div className='flex justify-centre items-centre pt-4 md:pt-0'>
        <div className='grid md:grid-cols-[300px,1fr] max-w-[1200px] gap-12'>
          <div>
            <img src={`${BASE_URL}${movie?.poster_path}`} alt={movie?.title} />
          </div>
          <div className='flex gap-4 md:space-y-3 text-textColor'>
            <div>{movie?.title}</div>
            <div>
              {movie?.genres?.map(
                (
                  genre: { id: React.Key | null | undefined; name: any },
                  index: any
                ) => (
                  <Genres
                    key={genre.id}
                    id={genre.id}
                    index={index}
                    name={genre.name}
                    length={movie.genres.length}
                  />
                )
              )}
            </div>
            <div>
              <p className='mb-2'>
                <strong>Runtime:</strong> {movie?.runtime} minutes
              </p>
              <p>
                <strong>Status:</strong> {movie?.status}
              </p>
              <p>
                <strong>Release Date:</strong> {movie?.release_date}
              </p>
              <p>
                <strong>Tagline:</strong> <span>{movie?.tagline}</span>
              </p>
              <p>
                <strong>Original Language:</strong>{' '}
                <span>{movie?.original_language?.toUpperCase()}</span>
              </p>
              <p>
                <strong>Budget:</strong> ${movie?.budget}
              </p>
              <p>
                <strong>Revenue:</strong> ${movie?.revenue}
              </p>
              <p>
                <strong>Popularity:</strong> {movie?.popularity}
              </p>
              <p>
                <strong>Vote Count:</strong> <span>{movie?.vote_count}</span>
              </p>
            </div>
          </div>
          <div className='text-textColor my-4 md:my-0'>
            <h1 className='text-white text-2xl'>Overview:</h1>
            {movie?.overview}
          </div>
        </div>
      </div>
      {showPlayer && (
        <div>
          <div>
            <ReactPlayer url={trailer} playing />
          </div>
        </div>
      )}
    </main>
  );
};

export default MovieDetails;
