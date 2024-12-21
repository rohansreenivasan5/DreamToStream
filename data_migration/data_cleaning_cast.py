import pandas as pd
import numpy as np
import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)
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

movies_cast = all_movies['director']
tv_cast = all_tv['director']
movies_cast = movies_cast.dropna()
tv_cast = tv_cast.dropna()

movies_cast_schema = pd.DataFrame(columns=['FirstName', 'LastName'])
tv_cast_schema = pd.DataFrame(columns=['Firstname', 'Lastname'])

movies_cast_schema = movies_cast_schema.dropna()
tv_cast_schema = tv_cast_schema.dropna()
movies_cast_schema = movies_cast_schema.drop_duplicates(inplace=False)
tv_cast_schema = tv_cast_schema.drop_duplicates(inplace=False)
s = set()
for director in movies_cast:
    if director in s:
        continue
    s.add(director)
    names = director.split(' ')
    if len(names) == 1:
        ln = ''
        movies_cast_schema = movies_cast_schema.append(
            {'FirstName': names[0], 'LastName': ln}, ignore_index=True)
    else:
        movies_cast_schema = movies_cast_schema.append(
            {'FirstName': names[0], 'LastName': names[1]}, ignore_index=True)

for director in tv_cast:

    names = director.split(' ')
    if len(names) == 1:
        ln = ''
        tv_cast_schema = tv_cast_schema.append(
            {'FirstName': names[0], 'LastName': ln}, ignore_index=True)
    else:
        tv_cast_schema = tv_cast_schema.append(
            {'FirstName': names[0], 'LastName': names[1]}, ignore_index=True)

all_directors = pd.concat([tv_cast_schema, movies_cast_schema])
# print(all_directors)
tv_cast_schema.to_csv("cast_tv.csv", index=False)
movies_cast_schema.to_csv("cast_movie.csv", index=False)
