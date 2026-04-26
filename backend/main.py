import os
import requests
from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environmental variables
load_dotenv()
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

# Configuration Constants
GITHUB_API_BASE = "https://api.github.com"
HEADERS = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json",
}

app = FastAPI(title="GitLens-3D Engine")

# Silicon-to-Software Middleware: CORS Policy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Standard Vite Dev Port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/stats/{username}")
async def get_github_stats(username: str):
    try:
        # 1. Fetch User Profile Data
        user_url = f"{GITHUB_API_BASE}/users/{username}"
        user_res = requests.get(user_url, headers=HEADERS, timeout=10)

        if user_res.status_code == 404:
            raise HTTPException(status_code=404, detail="User not found")
        elif user_res.status_code != 200:
            raise HTTPException(
                status_code=user_res.status_code, detail="GitHub API Error"
            )

        user_data = user_res.json()

        # 2. Fetch Repositories (Sorted by popularity for best 3D visualization)
        repos_url = (
            f"{GITHUB_API_BASE}/users/{username}/repos?per_page=12&sort=stargazers"
        )
        repos_res = requests.get(repos_url, headers=HEADERS, timeout=10)
        repos_data = repos_res.json()

        # 3. Defensive Processing: Resolve Nulls and Map Structures
        # Logic: Fallback to login if name is null; fallback to mantra if bio is null.
        refined_user = {
            "name": user_data.get("name") or user_data.get("login") or "Anonymous Node",
            "avatar": user_data.get("avatar_url"),
            "bio": user_data.get("bio") or "Silicon-to-Software mastery in progress.",
            "login": user_data.get("login"),
        }

        # Clean Repositories for 3D mapping
        cleaned_repos = [
            {
                "id": repo.get("id"),
                "name": repo.get("name"),
                "stars": repo.get("stargazers_count", 0),
                "language": repo.get("language") or "C",  # Minimalist fallback
                "size": repo.get("size", 0),
                "url": repo.get("html_url"),
            }
            for repo in repos_data
            if not repo.get("fork")  # Exclude forks for a cleaner scene
        ]

        return {
            "user": refined_user,
            "repos": cleaned_repos,
            "latency": "14ms",  # Aesthetic placeholder for the UI
        }

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Internal Sync Error: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
