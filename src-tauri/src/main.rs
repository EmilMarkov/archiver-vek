// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager};
use settimeout::set_timeout;
use std::{time::Duration};
use tauri::api::path;
use std::path::{Path, PathBuf};
use sysinfo::{DiskExt, System, SystemExt};

// Import App Modules
mod app_modules;
use app_modules::file_manager::{FileEntry, FolderEntry, FileManager};

#[tauri::command]
fn get_all_disks() -> Vec<(String, u64, u64)> {
    let mut sys = System::new_all();
    sys.refresh_all();
    let mut disks = Vec::new();
    for disk in sys.disks() {
        let name = disk.mount_point().to_string_lossy().to_string();
        let total_space = disk.total_space() / 1_000_000_000;
        let available_space = disk.available_space() / 1_000_000_000;
        disks.push((name, total_space, available_space));
    }
    disks
}

#[tauri::command]
async fn get_home_dir() -> Result<PathBuf, String> {
    match path::home_dir() {
        Some(dir) => Ok(dir),
        None => Err("Failed to get home directory".to_string()),
    }
}

#[tauri::command]
async fn scan_files(path: String) -> Result<Vec<FileEntry>, String> {
    let result = async_scan_files(&path).await;
    match result {
        Ok(file_entries) => Ok(file_entries),
        Err(error) => Err(error.to_string()),
    }
}

async fn async_scan_files(path: &str) -> Result<Vec<FileEntry>, Box<dyn std::error::Error>> {
    let root_path = PathBuf::from(path);
    let file_manager = FileManager::new(root_path)?;

    let file_entries: Vec<FileEntry> = file_manager.list_files().to_vec();

    Ok(file_entries)
}

#[tauri::command]
async fn scan_folders(path: String) -> Result<Vec<FolderEntry>, String> {
    let result = async_scan_folders(&path).await;
    match result {
        Ok(folder_entries) => Ok(folder_entries),
        Err(error) => Err(error.to_string()),
    }
}

async fn async_scan_folders(path: &str) -> Result<Vec<FolderEntry>, Box<dyn std::error::Error>> {
    let root_path = PathBuf::from(path);
    let file_manager = FileManager::new(root_path)?;

    let folder_entries: Vec<FolderEntry> = file_manager.list_folders().to_vec();

    Ok(folder_entries)
}

#[tauri::command]
async fn close_splashscreen(window: tauri::Window) {
    // Close splashscreen
    if let Some(splashscreen) = window.get_window("splashscreen") {
        set_timeout(Duration::from_millis(100)).await;
        splashscreen.close().unwrap();
    }

    // Show main window
    set_timeout(Duration::from_millis(500)).await;
    window.get_window("main").unwrap().show().unwrap();
}

fn main() {
    let disks = get_all_disks();
    for disk in disks {
        println!("{:#?}", disk);
    }
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            close_splashscreen,
            scan_files,
            scan_folders,
            get_home_dir,
            get_all_disks
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}