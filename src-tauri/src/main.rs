#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![delete_cookies])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn delete_cookies(window: tauri::Window) {
    window
        .with_webview(|webview| {
            #[cfg(windows)]
            unsafe {
                use webview2_com::Microsoft::Web::WebView2::Win32::ICoreWebView2_10;
                use windows::core::Interface;

                let core_webview2_10: ICoreWebView2_10 =
                    webview.controller().CoreWebView2().unwrap().cast().unwrap();
                let cookie_manager = core_webview2_10.CookieManager().unwrap();
                cookie_manager.DeleteAllCookies().unwrap();
            }
        })
        .expect("failed");
}
