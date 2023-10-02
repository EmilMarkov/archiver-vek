# Archiver VEK | Программа для архивации файлов

![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white)
![Tauri](https://img.shields.io/badge/tauri-%2324C8DB.svg?style=for-the-badge&logo=tauri&logoColor=%23FFFFFF)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![C++](https://img.shields.io/badge/c++-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white)

## Описание главного заголовка:

| Параметр                        | Размер (в байтах)    | Фикс. Смещение (в байтах)        | Значение          |
|---------------------------------|----------------------|----------------------------------|-------------------|
| Сигнатура                       | 3                    | 0                                | vek               |
| Версия формата                  | 1                    | 3                                | 01                |
| Алгоритм сжатия                 | 1                    | 4                                | 00                |
| Алгоритм защиты от шума         | 1                    | 5                                | 00                |
| Размер файла                    | 4                    | 6                                | -                 |

## Описание записи архивируемых файлов:

| Параметр                        | Размер (в байтах)    | Относит. смещение (в байтах)     | Значение           |
|---------------------------------|----------------------|----------------------------------|--------------------|
| Размер описания записи          | 4                    | 0                                | 8 + L              |
| Размер архивируемого файла      | 4                    | 4                                | N |
| Относительный путь              | L                    | 8                                |  Путь к файлу в UTF-8                  |
| Содержимое архивируемого файла  | N                    | 8 + L                            | N байтов исх. файла                  |

## Коды алгоритмов сжатия:

- 00: Без сжатия

## Коды алгоритмов защиты от шума:

- 00: Без защиты