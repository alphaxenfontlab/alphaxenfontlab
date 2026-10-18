#!/usr/bin/env python3
"""
Alphaxen Type Foundry - Local Host Publisher GUI
A standalone desktop application with an "OPEN SITE" button that
auto-publishes the foundry website on localhost and opens the default browser.
"""

import os
import sys
import subprocess
import threading
import time
import webbrowser
import socket
import tkinter as tk
from tkinter import ttk, messagebox

PORT = 5173
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
SERVER_PROCESS = None

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('127.0.0.1', port)) == 0

class AlphaxenLauncherApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Alphaxen Type Foundry - Local Publisher")
        self.root.geometry("540x480")
        self.root.minsize(500, 440)
        self.root.configure(bg="#08090d")

        # Try to set icon if ax.png exists
        try:
            icon_path = os.path.join(PROJECT_DIR, "ax.png")
            if os.path.exists(icon_path):
                img = tk.PhotoImage(file=icon_path)
                self.root.iconphoto(False, img)
        except Exception:
            pass

        self.is_running = False
        self.server_thread = None

        self.create_widgets()
        self.check_initial_state()

        # Handle clean exit
        self.root.protocol("WM_DELETE_WINDOW", self.on_close)

    def create_widgets(self):
        # Header Container
        header_frame = tk.Frame(self.root, bg="#0d101d", pady=18, padx=20)
        header_frame.pack(fill="x")

        # Top Badge
        badge = tk.Label(
            header_frame,
            text="PROPRIETARY FOUNDRY VAULT",
            font=("Consolas", 8, "bold"),
            fg="#c084fc",
            bg="#2e1065",
            padx=8,
            pady=2
        )
        badge.pack(anchor="w")

        # Title
        title_lbl = tk.Label(
            header_frame,
            text="ALPHAXEN TYPE FOUNDRY",
            font=("Segoe UI", 18, "bold"),
            fg="#ffffff",
            bg="#0d101d"
        )
        title_lbl.pack(anchor="w", pady=(6, 0))

        subtitle_lbl = tk.Label(
            header_frame,
            text="Local Host Server Controller & One-Click Publisher",
            font=("Segoe UI", 9),
            fg="#94a3b8",
            bg="#0d101d"
        )
        subtitle_lbl.pack(anchor="w")

        # Status Bar
        self.status_frame = tk.Frame(self.root, bg="#131627", pady=10, padx=20)
        self.status_frame.pack(fill="x", pady=(1, 10))

        self.status_dot = tk.Label(
            self.status_frame,
            text="●",
            font=("Segoe UI", 14),
            fg="#ef4444",
            bg="#131627"
        )
        self.status_dot.pack(side="left", padx=(0, 8))

        self.status_text = tk.Label(
            self.status_frame,
            text="SERVER OFFLINE",
            font=("Consolas", 10, "bold"),
            fg="#f8fafc",
            bg="#131627"
        )
        self.status_text.pack(side="left")

        self.url_label = tk.Label(
            self.status_frame,
            text="",
            font=("Consolas", 9, "underline"),
            fg="#38bdf8",
            bg="#131627",
            cursor="hand2"
        )
        self.url_label.pack(side="right")
        self.url_label.bind("<Button-1>", lambda e: self.open_browser_url())

        # Main Action Button Container
        btn_container = tk.Frame(self.root, bg="#08090d", padx=20, pady=10)
        btn_container.pack(fill="x")

        # Primary Huge "OPEN SITE" Button
        self.open_site_btn = tk.Button(
            btn_container,
            text="🚀  OPEN SITE  (AUTO-PUBLISH)",
            font=("Segoe UI", 13, "bold"),
            bg="#7c3aed",
            fg="#ffffff",
            activebackground="#6d28d9",
            activeforeground="#ffffff",
            relief="flat",
            pady=12,
            cursor="hand2",
            command=self.start_and_open_site
        )
        self.open_site_btn.pack(fill="x", pady=(0, 10))

        # Secondary Actions Row
        action_row = tk.Frame(btn_container, bg="#08090d")
        action_row.pack(fill="x")

        self.rebuild_btn = tk.Button(
            action_row,
            text="🔄 Rebuild Site",
            font=("Segoe UI", 9, "bold"),
            bg="#1e2438",
            fg="#cbd5e1",
            activebackground="#334155",
            activeforeground="#ffffff",
            relief="flat",
            padx=12,
            pady=6,
            cursor="hand2",
            command=self.rebuild_site
        )
        self.rebuild_btn.pack(side="left", expand=True, fill="x", padx=(0, 4))

        self.stop_btn = tk.Button(
            action_row,
            text="⏹ Stop Server",
            font=("Segoe UI", 9, "bold"),
            bg="#1e2438",
            fg="#f87171",
            activebackground="#334155",
            activeforeground="#ffffff",
            relief="flat",
            padx=12,
            pady=6,
            cursor="hand2",
            command=self.stop_server
        )
        self.stop_btn.pack(side="left", expand=True, fill="x", padx=(4, 4))

        self.folder_btn = tk.Button(
            action_row,
            text="📂 Open Folder",
            font=("Segoe UI", 9, "bold"),
            bg="#1e2438",
            fg="#cbd5e1",
            activebackground="#334155",
            activeforeground="#ffffff",
            relief="flat",
            padx=12,
            pady=6,
            cursor="hand2",
            command=lambda: os.startfile(PROJECT_DIR)
        )
        self.folder_btn.pack(side="left", expand=True, fill="x", padx=(4, 0))

        # Log Console Container
        log_frame = tk.Frame(self.root, bg="#08090d", padx=20, pady=(6, 16))
        log_frame.pack(fill="both", expand=True)

        log_label = tk.Label(
            log_frame,
            text="ACTIVITY TELEMETRY:",
            font=("Consolas", 8, "bold"),
            fg="#64748b",
            bg="#08090d"
        )
        log_label.pack(anchor="w", pady=(0, 4))

        self.log_text = tk.Text(
            log_frame,
            bg="#0c0e18",
            fg="#94a3b8",
            insertbackground="#ffffff",
            font=("Consolas", 8),
            relief="flat",
            height=6,
            padx=8,
            pady=8
        )
        self.log_text.pack(fill="both", expand=True)
        self.log_text.config(state="disabled")

        self.log("Alphaxen Local Host Publisher initialized.")

    def log(self, message):
        self.log_text.config(state="normal")
        timestamp = time.strftime("%H:%M:%S")
        self.log_text.insert("end", f"[{timestamp}] {message}\n")
        self.log_text.see("end")
        self.log_text.config(state="disabled")

    def check_initial_state(self):
        if is_port_in_use(PORT):
            self.set_online_state()
            self.log(f"Detected existing service on port {PORT}.")
        else:
            self.set_offline_state()

    def set_online_state(self):
        self.is_running = True
        self.status_dot.config(fg="#10b981")
        self.status_text.config(text="ONLINE (ACTIVE)", fg="#10b981")
        self.url_label.config(text=f"http://localhost:{PORT}")
        self.open_site_btn.config(
            text="🌐  SITE RUNNING  (CLICK TO RE-OPEN BROWSER)",
            bg="#059669",
            activebackground="#047857"
        )

    def set_offline_state(self):
        self.is_running = False
        self.status_dot.config(fg="#ef4444")
        self.status_text.config(text="SERVER OFFLINE", fg="#94a3b8")
        self.url_label.config(text="")
        self.open_site_btn.config(
            text="🚀  OPEN SITE  (AUTO-PUBLISH)",
            bg="#7c3aed",
            activebackground="#6d28d9"
        )

    def start_and_open_site(self):
        # If already running, just open the browser
        if self.is_running:
            self.open_browser_url()
            return

        self.open_site_btn.config(text="⏳  PUBLISHING ON LOCALHOST...", state="disabled")
        self.log("Auto-publish sequence started...")

        threading.Thread(target=self._publish_worker, daemon=True).start()

    def _publish_worker(self):
        global SERVER_PROCESS
        dist_dir = os.path.join(PROJECT_DIR, "dist")
        
        # 1. Build if dist does not exist
        if not os.path.exists(dist_dir) or not os.path.exists(os.path.join(dist_dir, "index.html")):
            self.log("Compiling production bundle and demo glyphs...")
            try:
                cmd = "npx vite build"
                p = subprocess.run(cmd, shell=True, cwd=PROJECT_DIR, capture_output=True, text=True)
                if p.returncode != 0:
                    self.log(f"Build Error: {p.stderr[:120]}")
                    self.root.after(0, self.set_offline_state)
                    return
                self.log("Build compiled successfully.")
            except Exception as e:
                self.log(f"Build exception: {e}")
                self.root.after(0, self.set_offline_state)
                return

        # 2. Launch Local Server
        self.log(f"Starting server on http://localhost:{PORT}...")
        try:
            # We use npx vite preview --port 5173 --host
            cmd = f"npx vite preview --port {PORT} --host"
            SERVER_PROCESS = subprocess.Popen(
                cmd,
                shell=True,
                cwd=PROJECT_DIR,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            time.sleep(1.2)
        except Exception as e:
            self.log(f"Failed to start server: {e}")
            self.root.after(0, self.set_offline_state)
            return

        # 3. Open Web Browser
        self.log(f"Opening browser at http://localhost:{PORT}...")
        webbrowser.open(f"http://localhost:{PORT}")

        self.root.after(0, self.set_online_state)
        self.root.after(0, lambda: self.open_site_btn.config(state="normal"))
        self.log("Site is now live and published on localhost!")

    def rebuild_site(self):
        self.log("Triggering complete re-build of the site...")
        threading.Thread(target=self._rebuild_worker, daemon=True).start()

    def _rebuild_worker(self):
        try:
            cmd = "npx vite build"
            p = subprocess.run(cmd, shell=True, cwd=PROJECT_DIR, capture_output=True, text=True)
            if p.returncode == 0:
                self.log("Re-build complete: 100% updated.")
                messagebox.showinfo("Rebuild Complete", "The website bundle and demo glyphs have been successfully updated!")
            else:
                self.log(f"Rebuild failed: {p.stderr[:120]}")
        except Exception as e:
            self.log(f"Rebuild error: {e}")

    def stop_server(self):
        global SERVER_PROCESS
        if SERVER_PROCESS:
            self.log("Terminating server process...")
            try:
                subprocess.run(f"taskkill /F /T /PID {SERVER_PROCESS.pid}", shell=True, capture_output=True)
            except Exception:
                pass
            SERVER_PROCESS = None

        # Clean any remaining node process on port 5173
        self.set_offline_state()
        self.log("Local host server stopped.")

    def open_browser_url(self):
        webbrowser.open(f"http://localhost:{PORT}")
        self.log(f"Opened http://localhost:{PORT} in browser.")

    def on_close(self):
        self.stop_server()
        self.root.destroy()

def main():
    root = tk.Tk()
    app = AlphaxenLauncherApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()
