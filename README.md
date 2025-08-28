# recover-rn

A command-line tool to recover React Native application source code from an APK file. It extracts the JavaScript bundle, assets, and AndroidManifest.xml.

This tool is useful for situations where the original source code is lost and you need to inspect the application's logic and resources.

---

## Features

- **APK Decompilation**: Uses `apktool` to disassemble the APK into a readable file structure.
- **JavaScript Extraction**: Locates and extracts the `index.android.bundle`, which contains the application's logic.
- **Code Formatting**: Applies a beautifier to the JavaScript bundle to improve readability.
- **Asset Recovery**: Copies all application assets (images, fonts, icons) into a separate directory.
- **Manifest Extraction**: Retrieves the `AndroidManifest.xml` file, which is essential for understanding the app's configurations, permissions, and components.
- **Error Logging**: Creates a `recover.log` file to record any issues that occur during the process.

---

## Requirements

- [Node.js](https://nodejs.org) (v16 or higher)
- [Apktool](https://ibotpeaches.github.io/Apktool/) (must be installed and accessible in the system's PATH)

<details>
<summary>Click to view Apktool installation instructions</summary>

**Linux (Debian/Ubuntu):**
```bash
sudo apt install apktool
```

**macOS (using Homebrew):**
```bash
brew install apktool
```

**Windows:**
1.  Go to the installation page: [https://ibotpeaches.github.io/Apktool/install/](https://ibotpeaches.github.io/Apktool/install/)
2.  Follow the instructions to download the `apktool.jar` and the `apktool.bat` wrapper script.
3.  Ensure the Java Runtime Environment (JRE) is installed.

</details>

---

## Installation

### Using NPX

This is the recommended method as it does not require a global installation.

```bash
npx recover-rn your-app.apk
```

### Global Installation

Alternatively, you can install the package globally.

```bash
npm install -g recover-rn
```

---

## Usage

Run the command by passing the path to your APK file as an argument:

```bash
recover-rn /path/to/your-app.apk
```

### Example

```bash
recover-rn MyApp.apk
```

---

## Output Structure

After execution, a `recovered_app` directory will be created with the following structure:

```
recovered_app/
 ├─ index.pretty.js         # The application's JavaScript code, formatted for readability.
 ├─ AndroidManifest.xml     # The app's manifest with its configurations.
 └─ extracted_assets/       # A directory containing all assets (images, fonts, etc.).
```

---

## Error Logs

If any failure occurs during execution, error details will be displayed in the terminal and also saved to the `recover.log` file in the directory where the command was run.

---

## Contributing

Contributions are welcome. If you have ideas for new features, improvements, or bug fixes, feel free to open an issue or submit a pull request.

---

## License

This project is distributed under the MIT License.
