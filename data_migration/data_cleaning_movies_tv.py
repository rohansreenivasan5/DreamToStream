import pandas as pd
import numpy as np

# read csvs
df_mov = pd.read_csv("MoviesOnStreamingPlatforms.csv")
df_dp = pd.read_csv("disney_plus_titles.csv")
df_ap = pd.read_csv("amazon_prime_titles.csv")
df_hulu = pd.read_csv("hulu_titles.csv")
df_nf = pd.read_csv("netflix_titles.csv")

# add streaming service colmun
df_ap["Streaming Service"] = "Amazon Prime"
df_dp["Streaming Service"] = "Disney Plus"
df_nf["Streaming Service"] = "Netflix"
df_hulu["Streaming Service"] = "Hulu"

files = [df_ap, df_dp, df_hulu, df_nf]

# divide sets by movies and tv
df_nf_movies = df_nf[df_nf['type'] == 'Movie']
df_nf_tv = df_nf[df_nf['type'] == 'TV Show']

df_ap_movies = df_ap[df_ap['type'] == 'Movie']
df_ap_tv = df_ap[df_ap['type'] == 'TV Show']

df_dp_movies = df_dp[df_dp['type'] == 'Movie']
df_dp_tv = df_dp[df_dp['type'] == 'TV Show']

df_hulu_movies = df_hulu[df_hulu['type'] == 'Movie']
df_hulu_tv = df_hulu[df_hulu['type'] == 'TV Show']

# combine sets
movie_frames = [df_nf_movies, df_ap_movies, df_dp_movies, df_hulu_movies]
tv_frames = [df_nf_tv, df_ap_tv, df_dp_tv, df_hulu_tv]
all_movies = pd.concat(movie_frames)
all_tv = pd.concat(tv_frames)

# add rating and serverId columns
all_movies["rating"] = 0
all_tv["rating"] = 0

all_movies["serverId"] = 0
all_tv["serverId"] = 0

# rename cols to those of the schema
schema_fit_movies = all_movies.rename(columns={"title": "name", "duration": "length", "rating": "rating",
                                      "release_year": "releaseYear", "country": "location", "serverId": "serverId", "listed_in": "genre"})
schema_fit_tv = all_tv.rename(columns={"title": "name", "duration": "length", "rating": "rating",
                              "release_year": "releaseYear", "country": "location", "serverId": "serverId", "listed_in": "genre"})
# drop non essential columns
schema_fit_movies = schema_fit_movies.drop(
    columns=['show_id', 'director', 'cast', 'date_added', 'description', 'type'])
schema_fit_tv = schema_fit_tv.drop(
    columns=['show_id', 'director', 'cast', 'date_added', 'description', 'type'])
# save to csv
#print(all_movies.shape, all_tv.shape)
# schema_fit_movies.to_csv("all_movies.csv", index=False)
# schema_fit_tv.to_csv("all_tv.csv", index=False)
