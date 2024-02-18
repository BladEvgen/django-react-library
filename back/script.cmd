@echo off
chcp 65001 > nul

REM Установка виртуального окружения
echo Создание виртуального окружения...
python -m venv venv
if errorlevel 1 (
    echo Не удалось создать виртуальное окружение. Убедитесь, что Python установлен и доступен в PATH.
    exit /b
)

REM Активация виртуального окружения
echo Активация виртуального окружения...
call venv/scripts/activate
if errorlevel 1 (
    echo Не удалось активировать виртуальное окружение. Убедитесь, что venv было правильно создано.
    exit /b
)

REM Установка зависимостей
echo Установка зависимостей...
pip install -r requirements.txt
if errorlevel 1 (
    echo Не удалось установить зависимости. Проверьте файл requirements.txt и ваше интернет-соединение.
    exit /b
)

REM Создание миграций
echo Создание миграций...
python manage.py makemigrations
if errorlevel 1 (
    echo Не удалось создать миграции. Проверьте ваш код Django и настройки базы данных.
    exit /b
)

REM Применение миграций
echo Применение миграций...
python manage.py migrate
if errorlevel 1 (
    echo Не удалось применить миграции. Проверьте ваш код Django и настройки базы данных.
    exit /b
)

REM Запуск сервера
echo Запуск сервера...
python manage.py runserver 0.0.0.0:8000
if errorlevel 1 (
    echo Не удалось запустить сервер. Проверьте ваш код Django и настройки сервера.
    exit /b
)
