@echo off
cd /d "%~dp0"
py -3.11 -m venv venv
call .\venv\Scripts\activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
