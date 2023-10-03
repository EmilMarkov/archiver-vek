use std::fs;
use std::path::{Path, PathBuf};
use std::error::Error;
use serde::Serialize;
use std::time::SystemTime;
use chrono::{DateTime, Utc};

fn format_system_time(system_time: SystemTime) -> String {
    let datetime: DateTime<Utc> = system_time.into(); // Преобразование SystemTime в DateTime
    let formatted_string = datetime.format("%Y-%m-%d %H:%M:%S").to_string(); // Форматирование даты и времени
    formatted_string
}

// Структура, представляющая файл
#[derive(Clone)]
#[derive(Serialize)]
pub struct FileEntry {
    path: PathBuf,
    name: String,
    size: u64,
    created_at: String
}

impl FileEntry {
    pub fn new(path: PathBuf, name: String, size: u64, created_at: String) -> Self {
        FileEntry { path, name, size, created_at }
    }

    pub fn path(&self) -> &Path {
        &self.path
    }

    pub fn size(&self) -> u64 {
        self.size
    }

    pub fn name(&self) -> &String {
        &self.name
    }   
}

// Структура, представляющая папку
#[derive(Clone)]
#[derive(Serialize)]
pub struct FolderEntry {
    path: PathBuf,
    name: String,
    created_at: String
}

impl FolderEntry {
    pub fn new(path: PathBuf, name: String, created_at: String) -> Self {
        FolderEntry { path, name, created_at }
    }

    pub fn path(&self) -> &Path {
        &self.path
    }

    pub fn name(&self) -> &String {
        &self.name
    }
}

// Главный класс для работы с файлами и папками
pub struct FileManager {
    current_location: PathBuf,
    folder_structure: Vec<FolderEntry>,
    file_structure: Vec<FileEntry>,
}

impl FileManager {
    pub fn new(root_path: PathBuf) -> Result<Self, Box<dyn Error>> {
        let root_metadata = fs::metadata(&root_path)?;
        if root_metadata.is_file() {
            return Err("Root path must be a directory".into());
        }

        let mut folder_structure = Vec::new();
        let mut file_structure = Vec::new();
        let current_location = root_path.clone();

        for entry in fs::read_dir(&root_path)? {
            let entry = entry?;
            let entry_path = entry.path();
            let entry_name = entry.file_name().to_string_lossy().to_string();
            let entry_metadata = entry.metadata()?;
            let entry_creation_date = entry_metadata.created()?;
            if entry_metadata.is_dir() {
                folder_structure.push(FolderEntry::new(entry_path, entry_name, format_system_time(entry_creation_date)));
            } else if entry_metadata.is_file() {
                file_structure.push(FileEntry::new(entry_path, entry_name, entry_metadata.len(), format_system_time(entry_creation_date)));
            }
        }

        Ok(FileManager {
            current_location,
            folder_structure,
            file_structure,
        })
    }

    pub fn get_current_location(&self) -> &Path {
        &self.current_location
    }

    pub fn list_folders(&self) -> &[FolderEntry] {
        &self.folder_structure
    }

    pub fn list_files(&self) -> &[FileEntry] {
        &self.file_structure
    }

    pub fn navigate_up(&mut self) -> Result<(), Box<dyn Error>> {
        if self.current_location.parent().is_none() {
            return Err("Already at the top level".into());
        }

        self.current_location.pop();
        self.file_structure.clear();
        self.folder_structure.clear();

        for entry in fs::read_dir(&self.current_location)? {
            let entry = entry?;
            let entry_path = entry.path();
            let entry_name = entry.file_name().to_string_lossy().to_string();
            let entry_metadata = entry.metadata()?;
            let entry_creation_date = entry_metadata.created()?;
            if entry_metadata.is_dir() {
                self.folder_structure.push(FolderEntry::new(entry_path, entry_name, format_system_time(entry_creation_date)));
            } else if entry_metadata.is_file() {
                self.file_structure.push(FileEntry::new(entry_path, entry_name, entry_metadata.len(), format_system_time(entry_creation_date)));
            }
        }

        Ok(())
    }
}