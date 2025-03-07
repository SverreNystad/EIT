# TechTAItans
**Husk Pose!** is a cost-saving app that helps you shop smarter, plan meals efficiently, and live greener. It gathers real-time grocery prices and deals from various stores in Norway, using AI to recommend the best offers based on your shopping habits and dietary preferences. Not only can you compare prices and track historical trends, but you can also get meal recommendations using the cheapest available ingredients. Plan your weekly meals on a budget with features like auto-generated shopping lists and a "Fill Your Kitchen" option that maximizes savings and reduces food waste, so you have more time to focus on what matters most.



### Prerequisites
- Ensure that git is installed on your machine. [Download Git](https://git-scm.com/downloads)
- In addition to git you will need git lfs installed on your machine. [Download Git LFS](https://git-lfs.github.com/)
- Docker is used for the backend and database setup. [Download Docker](https://www.docker.com/products/docker-desktop)

### Setup

Pull data from the repository using the following command
```bash
git lfs install
git lfs pull
```

## Usage
To run the application run the following command
```bash
docker compose up --build
```

## Testing
To run the tests run the following command
```bash
docker compose run backend python -m pytest
```



## 📖 Documentations
- [Developer Setup Guild](docs/manuals/setup.md)
