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
