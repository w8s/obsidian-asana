import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface AsanaPluginSettings {
	asana_pat: string;
	asana_workspace: string;
	asana_default_project_gid: string;
	asana_templates_dir: string;
}

const DEFAULT_SETTINGS: AsanaPluginSettings = {
	asana_pat: '',
	asana_workspace: '',
	asana_default_project_gid: '',
	asana_templates_dir: '',
}

export default class AsanaPlugin extends Plugin {
	settings: AsanaPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Asana', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is an asana thing!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new AsanaModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new AsanaModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new AsanaSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class AsanaModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class AsanaSettingTab extends PluginSettingTab {
	plugin: AsanaPlugin;

	constructor(app: App, plugin: AsanaPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Asana PAT')
			.setDesc('Your Asana Personal Access Token (PAT) to access your Asana workspace.')
			.addButton(btn => btn
				.setButtonText('Hide PAT')
				.onClick(e => {
					console.log("clicked the btn");
					const btn = (e.target as Element);
					const patField = (btn.nextElementSibling as Element);
					if (btn.getText() === "Show PAT") {
						btn.setText("Hide PAT");
						patField.setAttr('type', 'text');
					} else {
						btn.setText("Show PAT");
						patField.setAttr('type', 'password');
					}
				}))
			.addText(text => text
				.setPlaceholder('Enter your PAT')
				.setValue(this.plugin.settings.asana_pat)
				.onChange(async (value) => {
					this.plugin.settings.asana_pat = value;
					await this.plugin.saveSettings();
				}));
	}
}
