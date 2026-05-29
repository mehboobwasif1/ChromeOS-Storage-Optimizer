import { CleanupModule, AdvisorCategory } from "./types";

export const DEFAULT_CHROMBOOK_PROFILES = [
  {
    model: "HP Chromebook 14 G7",
    codename: "drawman",
    chromeOsVersion: "148.16640.0",
    storageSizeGb: 64,
    hasLinux: true,
    hasAndroid: true,
    isDeveloperMode: false
  },
  {
    model: "HP Chromebook 14a",
    codename: "bloog",
    chromeOsVersion: "153.15662.0",
    storageSizeGb: 32,
    hasLinux: false,
    hasAndroid: true,
    isDeveloperMode: false
  },
  {
    model: "Generic Chromebook (Standard)",
    codename: "chromeos-generic",
    chromeOsVersion: "Latest R120+",
    storageSizeGb: 128,
    hasLinux: true,
    hasAndroid: true,
    isDeveloperMode: false
  }
];

export const STATIC_CLEANUP_MODULES: CleanupModule[] = [
  // --- CROSTINI LINUX ---
  {
    id: "apt-cache",
    name: "Apt Package Archives Cache",
    description: "Cleans download archives (.deb files) kept in /var/cache/apt/archives left by previous installations.",
    component: "Crostini Linux",
    sizeSavedEstimate: "150 MB - 1.2 GB",
    command: "sudo apt-get clean && sudo apt-get autoremove -y",
    risk: "Low",
    checked: true
  },
  {
    id: "journal-logs",
    name: "Systemd Journal Logs",
    description: "Tops off system journal log file sizes to retain only the past 3 days of events, vacuuming older redundant entries.",
    component: "Crostini Linux",
    sizeSavedEstimate: "50 MB - 800 MB",
    command: "sudo journalctl --vacuum-time=3d",
    risk: "Low",
    checked: true
  },
  {
    id: "user-cache",
    name: "Dev Caches (~/.cache)",
    description: "Empites standard user runtime caches, including python pip, cargo indices, and system icon pools.",
    component: "Crostini Linux",
    sizeSavedEstimate: "100 MB - 2.5 GB",
    command: "rm -rf ~/.cache/*",
    risk: "Medium",
    checked: false
  },
  {
    id: "npm-cache",
    name: "Node Package Manager (NPM) Cache",
    description: "Forces a vacuum purge on npm package cache directory (typically ~/.npm) to reclaim storage after heavy development runs.",
    component: "Crostini Linux",
    sizeSavedEstimate: "200 MB - 1.5 GB",
    command: "npm cache clean --force",
    risk: "Low",
    checked: false
  },
  {
    id: "pip-cache",
    name: "Python Pip Cache",
    description: "Wipes out downloaded repository wheels and setup packages cached by Python package installer (Pip).",
    component: "Crostini Linux",
    sizeSavedEstimate: "80 MB - 600 MB",
    command: "pip cache purge 2>/dev/null || true",
    risk: "Low",
    checked: false
  },
  {
    id: "docker-prune",
    name: "Dangling Docker Containers & Volumes",
    description: "Removes stopped containers, dangling network pipelines, unused disk caches, and unclaimed volume arrays.",
    component: "Crostini Linux",
    sizeSavedEstimate: "500 MB - 8 GB+",
    command: "docker system prune -a --volumes -f 2>/dev/null || true",
    risk: "Medium",
    checked: false
  },
  {
    id: "linux-trash",
    name: "Linux Trash Bin",
    description: "Empties hidden Crostini desktop files and folders sent to local recycle containers inside ~/.local/share/Trash.",
    component: "Crostini Linux",
    sizeSavedEstimate: "0 MB - 500 MB",
    command: "rm -rf ~/.local/share/Trash/* 2>/dev/null || true",
    risk: "Low",
    checked: true
  },
  
  // --- CHROME BROWSER ---
  {
    id: "browser-caches",
    name: "Browser Temporary Storage Caches",
    description: "Reclaims bloated space consumed by pre-fetched site assets, static layout pictures, and media items. (Recommended to do via Chrome settings page as script is sandboxed).",
    component: "Chrome Browser",
    sizeSavedEstimate: "300 MB - 3 GB",
    command: "# Open chrome://settings/clearBrowserData in a new browser tab to clear Cache seamlessly.",
    risk: "Low",
    checked: true
  },
  {
    id: "offline-drive",
    name: "Google Drive Offline Mirror Cache",
    description: "Un-caches offline sync databases and files that are kept inside ChromeOS storage. Recommended to disable Offline Drive in ChromeOS Files App settings.",
    component: "Chrome Browser",
    sizeSavedEstimate: "500 MB - 15 GB",
    command: "# Manage Drive offline files directly within ChromeOS Files App Settings.",
    risk: "Low",
    checked: false
  },

  // --- ANDROID SUBSYSTEM ---
  {
    id: "android-app-caches",
    name: "Android System/App Caches",
    description: "Details the step to trigger direct storage optimization on cached Android app systems within Settings.",
    component: "Android (ARC++)",
    sizeSavedEstimate: "400 MB - 4 GB",
    command: "# Android app caches are managed securely within ChromeOS Settings -> Apps -> Android Preferences -> Storage.",
    risk: "Low",
    checked: true
  }
];

export const ADVISOR_STEPS: AdvisorCategory[] = [
  {
    id: "browser-cache",
    title: "Clear Google Chrome Browser Bloat",
    description: "Chrome caching makes sites load faster, but it caches images, CSS, and large javascript bundles indefinitely, consuming gigabytes of system storage.",
    steps: [
      "Open a new browser tab and navigate to: chrome://settings/clearBrowserData",
      "Set the Time Range to 'All time'.",
      "Check the box next to 'Cached images and files' (this is the main space saver!).",
      "OPTIONAL: Check 'Hosted app data' and 'Cookies' if you want a complete flush (note this might sign you out of some websites).",
      "Click the blue 'Clear data' button on the lower-right side."
    ],
    visualTip: "Reclaims: 300MB - 3.5GB of core local storage chunk instantly.",
    estimatedSaving: "300 MB - 3.5 GB"
  },
  {
    id: "google-drive-offline",
    title: "Configure Google Drive Offline Sync",
    description: "ChromeOS automatically syncs commonly touched files from your Google Drive to your device's local drive so you are able to inspect them offline. This is usually the single biggest hidden hog on ChromeOS!",
    steps: [
      "Open your ChromeOS 'Files' App.",
      "Select 'Google Drive' on the left navigation column sidebar.",
      "Click on the three dots menu icon in the top right header panel.",
      "Navigate and clear the checkmark option labeled 'Available offline'.",
      "To selectively clean individual folders, right-click on specific folders in Google Drive, and toggle 'Available offline' off."
    ],
    visualTip: "Important: Turning off offline sync does NOT delete your files on Google Drive! They remain safely online.",
    estimatedSaving: "1.5 GB - 15 GB"
  },
  {
    id: "linux-settings",
    title: "Reclaim Space from ChromeOS Linux Partition",
    description: "When setting up Linux on a Chromebook, a fixed-size virtual disk (.qcow2) is created. If you gave it too much space, or packed it up with unused developer software, it blocks other system files.",
    steps: [
      "Open your central Chromebook 'Settings' app.",
      "Go to the 'Advanced' section labeled on the left panel sidebar and select 'Developers'.",
      "Click on the menu item labeled 'Linux Development Environment'.",
      "Look for the setting labeled 'Disk size', and click on the 'Change' button.",
      "Drag the slider slider to shrink your Linux partition size to reclaim free space. ChromeOS will resize the EXT4 container safely in realtime!"
    ],
    visualTip: "Tip: Before shrinking, run the 'APT Packages & Caches' script generated in the next tab to make sure there is enough empty space container to shrink!",
    estimatedSaving: "2 GB - 25 GB"
  },
  {
    id: "android-apps",
    title: "Purge Android Application Leftovers & Caches",
    description: "If you have the Google Play Store enabled on your HP Chromebook 14, Android runs inside a secure virtual environment. Android apps cache media files and runtime databases that persist even if you haven't opened the app in months.",
    steps: [
      "Open your Chromebook 'Settings' App.",
      "Navigate to the 'Apps' section, then select 'Manage Google Play preferences'.",
      "Click on 'Android Settings' to open the mobile-optimized setting interface.",
      "Select 'Storage', then click 'Games' or 'Other Apps' to view disk layouts.",
      "Tap on any heavy app (like Spotify, YouTube, or Netflix) and click 'Clear Cache' or 'Clear Storage' directly.",
      "Ensure to remove offline-downloaded movies, music, or podcast episodes which are massive."
    ],
    visualTip: "Pro-tip: If you do not use Android apps at all, you can disable the entire Play Store in ChromeOS app settings to reclaim up to 4GB of RAM and storage overhead!",
    estimatedSaving: "1 GB - 8 GB"
  }
];
