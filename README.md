# GroupUp

## TDT4140 Prosjektarbeid Gruppe 22

## Setup Guide

Pull latest changes with ```git pull```

### UNIX/MacOS

#### Backend

```shell
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
cd backend
python manage.py runserver
```

#### Frontend

```shell
cd frontend
npm install
npm start
```

### Windows

#### Backend

```shell
python3 -m venv env
env/Scripts/activate
pip install -r requirements.txt
cd backend
python manage.py runserver
```

#### Frontend

```shell
cd frontend
npm install
npm start
```

### Docker setup
Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Requires WSL2 on windows, as well as HyperV and virtualization enabled in BIOS on Windows Computers.<br>
  - SVM for AMD processors, "Intel Virtualization Technology" on Intel.

From the repo root folder:
```shell
docker-compose up --build
```
Frontend is accessible at ```localhost:3000```<br>
Backend accessible at ```localhost:8000```

Containers can be closed using ```CTRL+C```

