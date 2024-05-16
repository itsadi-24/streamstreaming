'use client';
import Genres from '@/app/genres/[id]/page';
import Loading from '@/components/Loading';
import { BASE_URL } from '@/utils/Const';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { IoMdClose } from 'react-icons/io';

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

export interface Root {
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
export interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}
export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}
export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}
export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}
export interface Videos {
  results: Result[];
}

export interface Result {
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
  const [movie, setMovie] = useState([]);

  const [showPlayer, setShowPlayer] = useState(false);
  const [trailer, setTrailer] = useState('');

  const router = useRouter();
  const params = useParams();

  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get(
        `https:??api.themoviedb.org/3/movie/${params.id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&append_to_response-videos`
      )
      .then((res) => {
        console.log(res.data);
        setMovie(res.data);
      });
  }, [params.id]);

  useEffect(() => {
    const trailerIndex = movie?.videos?.results?.findIndex(
      (element) => element.type === 'Trailer'
    );

    const trailerURL = `https://www.youtube.com/watch?v=${movie?.videos?.results[trailerIndex]?.key}`;
    setTrailer(trailerURL);
  }, [movie]);

  const startPlayer = () => {
    mainRef?.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    setShowPlayer(true);
  };

  return (
    <main
      className=' bg-secondary p-8 relative max-h-[calc(100vh-77px)] overflow-y-scroll scrollbar-thin scrollbar-thumb-[#22222a] scrollbar-track-primary '
      ref={mainRef}
    >
      {movie === null && <Loading />}
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
              {movie?.genres?.map((genre, index) => (
                <Genres
                  key={genre.id}
                  id={genre.id}
                  index={index}
                  name={genre.name}
                  length={movie.genres.length}
                />
              ))}
            </div>
            <div className='flex flex-col md:flex-row gap-2 md:gap-6'>
              <div>Language: {movie?.original_language.toUpperCase()}</div>
              <div>Release: {movie?.release_date}</div>
              <div>Runtime: {movie?.runtime} min</div>
              <div>Ratings: {movie?.vote_average}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MovieDetails;
