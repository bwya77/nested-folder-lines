import { App, Plugin, PluginSettingTab, Setting, MarkdownView, TFile } from 'obsidian';

interface NFLSettings {
    colors: string[];
    unfocusedColor: string;
    enableFocus: boolean;
}

const DEFAULT_SETTINGS: NFLSettings = {
    colors: ['#71a0ff', '#ff7070', '#d574ff', '#50fe3d', '#71a0ff'],
    unfocusedColor: '#999999',
    enableFocus: true
};

class NFLSettingTab extends PluginSettingTab {
    plugin: NestedFolderLinesPlugin;

    constructor(app: App, plugin: NestedFolderLinesPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;
        containerEl.empty();

        const colorNames = ['First level', 'Second level', 'Third level', 'Fourth level', 'Fifth level'];
        colorNames.forEach((name, i) => {
            new Setting(containerEl)
                .setName(`${name} color`)
                .setDesc(`Color for ${name.toLowerCase()} folder lines`)
                .addColorPicker(color => color
                    .setValue(this.plugin.settings.colors[i])
                    .onChange(async (value) => {
                        this.plugin.settings.colors[i] = value;
                        await this.plugin.saveSettings();
                    }));
        });

        new Setting(containerEl)
            .setName('Unfocused title color')
            .setDesc('Color for unfocused file and folder titles')
            .addColorPicker(color => color
                .setValue(this.plugin.settings.unfocusedColor)
                .onChange(async (value) => {
                    this.plugin.settings.unfocusedColor = value;
                    await this.plugin.saveSettings();
                }));
        
        new Setting(containerEl)
            .setName('Enable focus mode')
            .setDesc('Highlight active files and their parent folders')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableFocus)
                .onChange(async (value) => {
                    this.plugin.settings.enableFocus = value;
                    await this.plugin.saveSettings();
                }));
    }
}

export default class NestedFolderLinesPlugin extends Plugin {
    private styleElement: HTMLStyleElement;
    private focusedPaths: Set<string> = new Set();
    settings: NFLSettings;

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new NFLSettingTab(this.app, this));
        
        this.styleElement = document.createElement('style');
        this.styleElement.id = 'nested-folder-lines-styles';
        document.head.appendChild(this.styleElement);
        
        this.updateBaseStyles();
        
        this.registerEvent(
            this.app.workspace.on('file-open', (file) => {
                if (file) {
                    this.updateFocusedPaths();
                }
            })
        );

        this.registerEvent(
            this.app.workspace.on('layout-change', () => {
                this.updateFocusedPaths();
            })
        );

        this.updateFocusedPaths();
    }

    onunload() {
        this.styleElement.remove();
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
        this.updateBaseStyles();
        this.updateFocusedPaths();
    }

    private updateFocusedPaths() {
        this.focusedPaths.clear();
        
        const openLeaves = this.app.workspace.getLeavesOfType('markdown');
        for (const leaf of openLeaves) {
            const view = leaf.view;
            const file = view instanceof MarkdownView ? view.file : null;
            
            if (file instanceof TFile) {
                const filePath = file.path;
                this.focusedPaths.add(filePath);
                
                const pathSegments = filePath.split('/');
                let currentPath = '';
                for (let i = 0; i < pathSegments.length - 1; i++) {
                    currentPath += (i > 0 ? '/' : '') + pathSegments[i];
                    this.focusedPaths.add(currentPath);
                }
            }
        }
        
        this.updateFocusStyles();
    }

    private updateBaseStyles() {
        let baseStyles = '';
        const maxLevels = 10;
        
        for (let i = 0; i < maxLevels; i++) {
            const colorIndex = i % this.settings.colors.length;
            const nestedSelectors = '.nav-folder-children '.repeat(i);
            
            baseStyles += `
                ${nestedSelectors}.nav-folder-children {
                    border-left: 1px solid ${this.settings.colors[colorIndex]} !important;
                    margin-left: 12px !important;
                }
            `;
        }
        
        this.styleElement.textContent = baseStyles;
    }

    private updateFocusStyles() {
        const existingFocusStyle = document.getElementById('nested-folder-lines-focus-styles');
        if (existingFocusStyle) {
            existingFocusStyle.remove();
        }

        const focusStyle = document.createElement('style');
        focusStyle.id = 'nested-folder-lines-focus-styles';

        let focusStyles = '';
        
        if (this.settings.enableFocus) {
            focusStyles = `
                .nav-file-title, .nav-folder-title {
                    color: ${this.settings.unfocusedColor} !important;
                    transition: color 0.2s ease;
                }
                
                .nav-file-title .iconize-icon, .nav-folder-title .iconize-icon {
                    opacity: 0.5 !important;
                    transition: opacity 0.2s ease;
                }
            `;
        }

        this.focusedPaths.forEach(path => {
            if (this.settings.enableFocus) {
                focusStyles += `
                    [data-path="${path}"] > .nav-file-title,
                    [data-path="${path}"] > .nav-folder-title,
                    [data-path="${path}"],
                    [data-path="${path}"] * {
                        color: var(--nav-item-color) !important;
                    }
                    
                    [data-path="${path}"] .iconize-icon {
                        opacity: 1 !important;
                    }
                `;
            }
        });

        focusStyle.textContent = focusStyles;
        document.head.appendChild(focusStyle);
    }
}