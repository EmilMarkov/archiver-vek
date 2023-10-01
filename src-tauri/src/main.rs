// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager};
use settimeout::set_timeout;
use window_shadows::set_shadow;
use std::{time::Duration};

// Import App Modules
mod app_modules;
use app_modules::file_manager::{FileEntry, FolderEntry, FileManager};

#[tauri::command]
async fn scan_files() -> Result<Vec<FileEntry>, String> {
    let result = async_scan_files().await;
    match result {
        Ok(file_entries) => Ok(file_entries),
        Err(error) => Err(error.to_string()),
    }
}

async fn async_scan_files() -> Result<Vec<FileEntry>, Box<dyn std::error::Error>> {
    let root_path = std::env::current_dir()?;
    let file_manager = FileManager::new(root_path)?;

    let file_entries: Vec<FileEntry> = file_manager.list_files().to_vec();

    Ok(file_entries)
}

#[tauri::command]
async fn scan_folders() -> Result<Vec<FolderEntry>, String> {
    let result = async_scan_folders().await;
    match result {
        Ok(folder_entries) => Ok(folder_entries),
        Err(error) => Err(error.to_string()),
    }
}

async fn async_scan_folders() -> Result<Vec<FolderEntry>, Box<dyn std::error::Error>> {
    let root_path = std::env::current_dir()?;
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

#[tauri::command]
async fn set_window_shadow(window: tauri::Window) {
    #[cfg(any(windows, target_os = "windows"))]
    set_shadow(&window, true).unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            close_splashscreen,
            set_window_shadow,
            scan_files,
            scan_folders
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}