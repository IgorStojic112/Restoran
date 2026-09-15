### Inicijalizacija backend servera
U root direktoriju:

### 1. Kreirajte virtualno okruženje
```
python3 -m venv venv
```

### 2. Aktivirajte ga
```
### macOS/Linux:
source venv/bin/activate
```
```
### Windows:
venv\Scripts\activate
```
### 3. Instalirajte Python pakete
```pip install -r requirements.txt```

### 4. Pokrenite inicijalizaciju i migraciju za bazu podataka
` python manage.py makemigrations `
```python manage.py migrate```

### 5. Kreirajte admin superuser
```python manage.py createsuperuser```

### 6. Pokrenite Django dev server
```python manage.py runserver```

---
### Inicijalizacija frontend servera

### 1. Prebacite se u ```frontend``` direktorij
```cd frontend```

### 2. Instalirajte JS pakete
```npm install```

### 3. Pokrenite Vite dev server
```npm run dev```

Rutama se sada može pristupiti na http://localhost:5173/login ...