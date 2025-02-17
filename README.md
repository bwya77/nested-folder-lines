# Rainbow Tree

Add colored relationship lines to your files and folders in Obsidian, based on their nesting level. Enable focus mode to highlight active files and their parent folders, and set the relationship lines to be solid, dotted, or dashed.

![rainbowtree](/images/rainbowtree.png) 

## Features

- Set the colors to relationship lines
- Show the relationship lines in the editor
- Focus Mode: Folders and files that are not open are dimmed, including the icon in present.
- Set the relation lines to be solid, dotted or dashed.

### Focus Mode
![focus mode](/images/focusmode.png) 
Focus mode highlights active files and their parent folders, dimming the rest. In the screenshot above I have two files open, other files and folders are dimmed.

## Installation

1. Open Obsidian Settings
2. Navigate to Community Plugins and disable Safe Mode
3. Click Browse and search for "Rainbow Tree"
4. Install the plugin
5. Enable the plugin in your Community Plugins list

## Usage

### Settings

In the plugin settings, you can:

- Set the color of the relationship lines for 1-5 levels of nesting
- Enable focus mode that highlights active files and their parent folders, dimming the rest
- Set the relationship lines to be solid, dotted, or dashed

![Settings Panel](/images/settings.png)


## Support

If you encounter any issues or have suggestions:

- Create an issue on [GitHub](https://github.com/bwya77/rainbow-tree/issues)
- Support the development:
  - [Buy Me a Coffee](https://buymeacoffee.com/bwya77)
  - [GitHub Sponsor](https://github.com/sponsors/bwya77)

## Development

Want to contribute or modify the plugin? Here's how to get started with the source code:

1. Create a directory for your GitHub projects:
   ```bash
   cd path/to/somewhere
   mkdir Github
   cd Github
   ```

2. Clone the repository:
   ```bash
   git clone https://github.com/bwya77/rainbow-tree.git
   ```

3. Navigate to the plugin directory:
   ```bash
   cd dynamic-editor-width
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start development build mode:
   ```bash
   npm run dev
   ```
   This command will keep running in the terminal and automatically rebuild the plugin whenever you make changes to the source code.

6. You'll see a `main.js` file appear in the plugin directory - this is the compiled version of your plugin.

### Testing Your Changes

To test your modifications:

1. Create a symbolic link or copy your plugin folder to your vault's `.obsidian/plugins/` directory
2. Enable the plugin in Obsidian's community plugins settings
3. Use the developer console (Ctrl+Shift+I) to check for errors and debug

### Making Contributions

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Submit a pull request with a clear description of your changes

## License

[MIT](https://github.com/bwya77/rainbow-tree/blob/main/LICENSE)
