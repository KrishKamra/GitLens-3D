import os
import requests
from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load our secret token
load_dotenv()
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
HEADERS = {"Authorization": f"token {GITHUB_TOKEN}"}

app = FastAPI(title="GitLens-3D Engine")

# Allow your React frontend to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/stats/{username}")
async def get_github_stats(username: str):
    # 1. Fetch User Profile
    user_url = f"https://api.github.com/users/{username}"
    user_res = requests.get(user_url, headers=HEADERS)

    if user_res.status_code != 200:
        raise HTTPException(status_code=404, detail="User not found")

    user_data = user_res.json()

    # 2. Fetch Repositories
    repos_url = (
        f"https://api.github.com/users/{username}/repos?per_page=10&sort=updated"
    )
    repos_res = requests.get(repos_url, headers=HEADERS)
    repos_data = repos_res.json()

    # 3. Silicon-Minimalist Data Processing
    # We only take what we need for the 3D visualizer
    cleaned_repos = [
        {
            "name": repo["name"],
            "stars": repo["stargazers_count"],
            "language": repo["language"],
            "size": repo["size"],
        }
        for repo in repos_data
    ]

    return {
        "user": {
            "name": user_data["name"],
            "avatar": user_data["avatar_url"],
            "bio": user_data["bio"],
        },
        "repos": cleaned_repos,
    }
